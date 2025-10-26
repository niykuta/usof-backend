import UserModel from "#src/models/user.model.js";
import FavoriteModel from "#src/models/favorite.model.js";
import SubscriptionModel from "#src/models/subscription.model.js";
import db from "#src/database/pool.js";
import fileService from "#src/services/file.service.js";
import { sanitizeUser } from "#src/utils/sanitize.utils.js";
import { AuthError, ForbiddenError, ValidationError } from "#src/utils/error.class.js";
import { ACTIVITY_QUERIES } from "#src/database/queries.js";
import bcrypt from 'bcrypt';

export async function list(req, res) {
  const users = await UserModel.findAll();

  res.json(users.map(sanitizeUser));
}

export async function top(req, res) {
  const limit = parseInt(req.query.limit) || 10;
  const users = await UserModel.findAll();

  const topUsers = users
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
    .map(sanitizeUser);

  res.json(topUsers);
}

export async function get(req, res) {
  const user = await UserModel.find(req.params.user_id);
  if (!user) throw new ValidationError("User not found");

  const [postCountResult] = await db.execute(
    'SELECT COUNT(*) as count FROM posts WHERE user_id = ? AND status = "active"',
    [req.params.user_id]
  );

  const [answerCountResult] = await db.execute(
    'SELECT COUNT(*) as count FROM comments WHERE user_id = ? AND status = "active"',
    [req.params.user_id]
  );

  const userWithCounts = {
    ...sanitizeUser(user),
    questions_count: postCountResult[0]?.count || 0,
    answers_count: answerCountResult[0]?.count || 0
  };

  res.json(userWithCounts);
}

export async function create(req, res) {
  const { login, password, full_name, email, role } = req.body;

  if (!login || !password || !email) {
    throw new ValidationError("Missing required fields");
  }

  const user = await UserModel.create({ login, password, full_name, email, role });

  res.status(201).json({
    message: "User created successfully",
    user: sanitizeUser(user),
  });
}

export async function update(req, res) {
  const { user_id } = req.params;
  const { old_password, new_password, ...otherUpdates } = req.body;

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot update other user's data");
  }

  if (old_password && new_password) {
    if (!isOwner) {
      throw new ForbiddenError("Only the user can change their own password");
    }

    const user = await UserModel.find(user_id);
    if (!user) throw new ValidationError("User not found");

    const isValidPassword = await bcrypt.compare(old_password, user.password);
    if (!isValidPassword) {
      throw new AuthError("Invalid old password");
    }

    otherUpdates.password = await bcrypt.hash(new_password, 12);
  }

  const updatedUser = await UserModel.update(user_id, otherUpdates);

  res.status(200).json({
    message: "User updated successfully",
    user: sanitizeUser(updatedUser),
  });
}

export async function avatar(req, res) {
  if (!req.file) {
    throw new ValidationError("No file uploaded");
  }

  const currentUser = await UserModel.find(req.user.id);

  const avatarUrl = fileService.getFileUrl(req.file.filename, 'avatar');

  await UserModel.update(req.user.id, { profile_picture: avatarUrl });

  if (currentUser.profile_picture) {
    const oldFilename = fileService.extractFilenameFromUrl(currentUser.profile_picture);
    await fileService.deleteFile(oldFilename, 'avatar');
  }

  res.status(200).json({
    message: "Avatar uploaded successfully",
    avatar_url: avatarUrl
  });
}

export async function remove(req, res) {
  const { user_id } = req.params;
  await UserModel.deleteWithCascade(user_id);

  res.status(200).json({
    message: "User deleted successfully"
  });
}

export async function favorites(req, res) {
  const { user_id } = req.params;

  const user = await UserModel.find(user_id);
  if (!user) throw new ValidationError("User not found");

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot access other user's favorites");
  }

  const favorites = await FavoriteModel.findByUser(user_id);

  res.json({
    user_id: parseInt(user_id),
    favorites
  });
}

export async function subscriptions(req, res) {
  const { user_id } = req.params;

  const user = await UserModel.find(user_id);
  if (!user) throw new ValidationError("User not found");

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot access other user's subscriptions");
  }

  const subscriptions = await SubscriptionModel.findByUser(user_id);

  res.json({
    user_id: parseInt(user_id),
    subscriptions
  });
}

export async function answers(req, res) {
  const { user_id } = req.params;

  const user = await UserModel.find(user_id);
  if (!user) throw new ValidationError("User not found");

  const [rows] = await db.execute(
    `SELECT c.*, p.id as question_id, p.title as question_title
     FROM comments c
     JOIN posts p ON c.post_id = p.id
     WHERE c.user_id = ? AND c.status = 'active'
     ORDER BY c.created_at DESC`,
    [user_id]
  );

  const answers = rows.map(row => ({
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    rating: row.rating || 0,
    question: {
      id: row.question_id,
      title: row.question_title
    }
  }));

  res.json(answers);
}

export async function activity(req, res) {
  const { user_id } = req.params;
  const limit = parseInt(req.query.limit) || 20;
  const offset = parseInt(req.query.offset) || 0;

  const user = await UserModel.find(user_id);
  if (!user) throw new ValidationError("User not found");

  const [posts] = await db.execute(ACTIVITY_QUERIES.GET_USER_POSTS, [user_id]);
  const [comments] = await db.execute(ACTIVITY_QUERIES.GET_USER_COMMENTS, [user_id]);
  const [postLikes] = await db.execute(ACTIVITY_QUERIES.GET_USER_POST_LIKES, [user_id]);
  const [commentLikes] = await db.execute(ACTIVITY_QUERIES.GET_USER_COMMENT_LIKES, [user_id]);

  const activities = [
    ...posts.map(p => ({
      type: 'post',
      id: p.id,
      title: p.title,
      created_at: p.created_at
    })),
    ...comments.map(c => ({
      type: 'comment',
      id: c.id,
      content: c.content.substring(0, 150),
      post_id: c.post_id,
      post_title: c.post_title,
      created_at: c.created_at
    })),
    ...postLikes.map(pl => ({
      type: 'post_like',
      id: pl.id,
      like_type: pl.like_type,
      post_id: pl.post_id,
      post_title: pl.post_title,
      created_at: pl.created_at
    })),
    ...commentLikes.map(cl => ({
      type: 'comment_like',
      id: cl.id,
      like_type: cl.like_type,
      comment_id: cl.comment_id,
      comment_content: cl.comment_content.substring(0, 150),
      post_id: cl.post_id,
      post_title: cl.post_title,
      created_at: cl.created_at
    }))
  ];

  activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const paginatedActivities = activities.slice(offset, offset + limit);

  res.json({
    activities: paginatedActivities,
    total: activities.length,
    limit,
    offset
  });
}
