import PostModel from "#src/models/post.model.js";
import CategoryModel from "#src/models/category.model.js";
import UserModel from "#src/models/user.model.js";
import { ValidationError, ForbiddenError, ConflictError } from "#src/utils/error.class.js";
import CommentModel from "#src/models/comment.model.js";
import PostLikeModel from "#src/models/postLike.model.js";
import FavoriteModel from "#src/models/favorite.model.js";
import SubscriptionModel from "#src/models/subscription.model.js";
import NotificationService from "#src/services/notification.service.js";
import fileService from "#src/services/file.service.js";

export async function list(req, res) {
  const {
    sortBy = 'likes',
    sortOrder = 'DESC',
    categories,
    status,
    dateFrom,
    dateTo,
    userId,
    limit,
    offset = 0,
    search,
    commentCount
  } = req.query;

  let categoriesArray = [];
  if (categories) {
    categoriesArray = Array.isArray(categories)
      ? categories.map(Number).filter(Boolean)
      : categories.split(',').map(Number).filter(Boolean);
  }

  const options = {
    sortBy,
    sortOrder: sortOrder.toUpperCase(),
    categories: categoriesArray,
    status,
    dateFrom,
    dateTo,
    userId: userId ? parseInt(userId) : null,
    limit: limit ? parseInt(limit) : null,
    offset: parseInt(offset),
    search: search || null,
    commentCount: commentCount !== undefined ? parseInt(commentCount) : null
  };

  const [posts, total] = await Promise.all([
    PostModel.findAllWithFiltersAndSorting(options),
    PostModel.countWithFilters(options)
  ]);

  res.json({
    posts,
    total,
    limit: options.limit,
    offset: options.offset
  });
}

export async function get(req, res) {
  const post = await PostModel.findWithCategories(req.params.post_id);
  if (!post) throw new ValidationError("Post not found");

  res.json(post);
}

export async function incrementView(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  await PostModel.incrementViews(post_id);

  res.status(204).send();
}

export async function categories(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const categories = await CategoryModel.findByPost(post_id);

  res.json({
    post_id: parseInt(post_id),
    categories
  });
}

export async function create(req, res) {
  const { title, content, status = "active", categories } = req.body;
  const user_id = req.user.id;

  if (Array.isArray(categories) && categories.length > 0) {
    for (const categoryId of categories) {
      const category = await CategoryModel.find(categoryId);
      if (!category) {
        throw new ValidationError(`Category ${categoryId} not found`);
      }
    }
  }

  const post = await PostModel.create({
    user_id,
    title,
    content,
    status,
    categories: categories || []
  });

  if (req.files && req.files.length > 0) {
    const imagePaths = req.files.map(file => `/uploads/posts/${file.filename}`);
    await PostModel.addImages(post.id, imagePaths);
  }

  const postWithImages = await PostModel.findWithCategories(post.id);

  res.status(201).json({
    message: "Post created",
    post: postWithImages
  });
}

export async function update(req, res) {
  const { post_id } = req.params;
  const { title, content, status, categories } = req.body;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const isAuthor = req.user.id === post.user_id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError();
  }

  if (Array.isArray(categories)) {
    for (const categoryId of categories) {
      const category = await CategoryModel.find(categoryId);
      if (!category) {
        throw new ValidationError(`Category ${categoryId} not found`);
      }
    }
  }

  let fieldsToUpdate = {};

  if (isAuthor) {
    if (title !== undefined) fieldsToUpdate.title = title;
    if (content !== undefined) fieldsToUpdate.content = content;
    if (status !== undefined) fieldsToUpdate.status = status;
    if (categories !== undefined) fieldsToUpdate.categories = categories;
  }

  if (isAdmin) {
    if (status !== undefined) fieldsToUpdate.status = status;
    if (categories !== undefined) fieldsToUpdate.categories = categories;
  }

  const updatedPost = await PostModel.update(post_id, fieldsToUpdate);

  if (req.files && req.files.length > 0) {
    const existingImages = await PostModel.getImages(post_id);
    const totalImages = existingImages.length + req.files.length;

    if (totalImages <= 5) {
      const imagePaths = req.files.map(file => `/uploads/posts/${file.filename}`);
      await PostModel.addImages(post_id, imagePaths);
    } else {
      for (const file of req.files) {
        await fileService.deleteFile(file.path);
      }
      throw new ValidationError('Cannot exceed 5 images per post');
    }
  }

  const postWithImages = await PostModel.findWithCategories(post_id);

  await NotificationService.notifyPostUpdate(post_id, postWithImages.title, req.user.full_name);

  res.status(200).json({
    message: "Post updated",
    post: postWithImages
  });
}

export async function remove(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  if (req.user.id !== post.user_id && req.user.role !== "admin") {
    throw new ForbiddenError();
  }

  await PostModel.deleteWithCascade(post_id);

  res.status(204).send();
}

export async function comments(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const comments = await CommentModel.findByPost(post_id);
  res.json(comments);
}

export async function addComment(req, res) {
  const { post_id } = req.params;
  const { content, parent_comment_id } = req.validatedBody;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");
  if (post.status !== "active") throw new ForbiddenError("Cannot comment inactive post");

  if (parent_comment_id) {
    const parentComment = await CommentModel.find(parent_comment_id);
    if (!parentComment) throw new ValidationError("Parent comment not found");
    if (parentComment.post_id !== parseInt(post_id)) {
      throw new ValidationError("Parent comment belongs to different post");
    }
  }

  const comment = await CommentModel.create({
    post_id,
    user_id: req.user.id,
    parent_comment_id: parent_comment_id || null,
    content,
  });

  await NotificationService.notifyNewComment(post_id, post.title, req.user.full_name, req.user.id);

  res.status(201).json({
    message: "Comment created",
    comment,
  });
}

export async function likes(req, res) {
  const { post_id } = req.params;
  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const likes = await PostLikeModel.findByPost(post_id);
  res.json(likes);
}

export async function addLike(req, res) {
  const { post_id } = req.params;
  const { type } = req.validatedBody;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");
  if (post.status !== "active") throw new ForbiddenError("Cannot like inactive post");

  const existingLike = await PostLikeModel.findByUserAndPost(req.user.id, post_id);

  if (existingLike && existingLike.type === type) {
    await PostLikeModel.deleteByUser(post_id, req.user.id);
    await UserModel.updateRating(post.user_id);
    return res.status(200).json({
      message: "Vote removed",
      action: "removed"
    });
  }

  const like = await PostLikeModel.create({
    post_id,
    user_id: req.user.id,
    type,
  });

  await UserModel.updateRating(post.user_id);

  res.status(existingLike ? 200 : 201).json({
    message: existingLike ? "Vote updated" : "Vote added",
    action: existingLike ? "updated" : "created",
    like,
  });
}

export async function removeLike(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  await PostLikeModel.deleteByUser(post_id, req.user.id);
  await UserModel.updateRating(post.user_id);
  res.status(204).send();
}

export async function addFavorite(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");
  if (post.status !== "active") throw new ForbiddenError("Cannot favorite inactive post");

  const existingFavorite = await FavoriteModel.findByUserAndPost(req.user.id, post_id);
  if (existingFavorite) throw new ConflictError("Post already in favorites");

  const favorite = await FavoriteModel.create({
    user_id: req.user.id,
    post_id,
  });

  res.status(201).json({
    message: "Post added to favorites",
    favorite,
  });
}

export async function removeFavorite(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const removed = await FavoriteModel.deleteByUserAndPost(req.user.id, post_id);
  if (!removed) throw new ValidationError("Post not in favorites");

  res.status(204).send();
}

export async function addSubscription(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");
  if (post.status !== "active") throw new ForbiddenError("Cannot subscribe to inactive post");

  const existingSubscription = await SubscriptionModel.findByUserAndPost(req.user.id, post_id);
  if (existingSubscription) throw new ConflictError("Already subscribed to this post");

  const subscription = await SubscriptionModel.create({
    user_id: req.user.id,
    post_id,
  });

  res.status(201).json({
    message: "Subscribed to post",
    subscription,
  });
}

export async function removeSubscription(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const removed = await SubscriptionModel.deleteByUserAndPost(req.user.id, post_id);
  if (!removed) throw new ValidationError("Not subscribed to this post");

  res.status(204).send();
}

export async function deleteImage(req, res) {
  const { post_id, image_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const isAuthor = req.user.id === post.user_id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError("You don't have permission to delete this image");
  }

  const image = await PostModel.getImageById(image_id);
  if (!image) throw new ValidationError("Image not found");

  if (image.post_id !== parseInt(post_id)) {
    throw new ValidationError("Image does not belong to this post");
  }

  const deleted = await PostModel.deleteImage(image_id, post_id);
  if (!deleted) throw new ValidationError("Failed to delete image");

  await fileService.deleteFile(`usof-backend${image.image_path}`);

  res.status(204).send();
}

export async function deleteImagesBulk(req, res) {
  const { post_id } = req.params;
  const { image_ids } = req.body;

  if (!Array.isArray(image_ids) || image_ids.length === 0) {
    throw new ValidationError("image_ids must be a non-empty array");
  }

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  const isAuthor = req.user.id === post.user_id;
  const isAdmin = req.user.role === "admin";

  if (!isAuthor && !isAdmin) {
    throw new ForbiddenError("You don't have permission to delete these images");
  }

  const images = await PostModel.getImagesByIds(post_id, image_ids);

  if (images.length === 0) {
    throw new ValidationError("No valid images found");
  }

  const deletedCount = await PostModel.deleteImagesBulk(post_id, image_ids);

  for (const image of images) {
    await fileService.deleteFile(`usof-backend${image.image_path}`);
  }

  res.status(200).json({
    message: "Images deleted",
    deleted: deletedCount
  });
}
