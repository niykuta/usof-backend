import PostModel from "#src/models/post.model.js";
import CategoryModel from "#src/models/category.model.js";
import { ValidationError, ForbiddenError } from "#src/utils/error.class.js";
import CommentModel from "#src/models/comment.model.js";
import PostLikeModel from "#src/models/postLike.model.js";

export async function list(req, res) {
  const {
    sortBy = 'likes',
    sortOrder = 'DESC',
    categories,
    status,
    dateFrom,
    dateTo,
    limit,
    offset = 0
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
    limit: limit ? parseInt(limit) : null,
    offset: parseInt(offset)
  };

  const posts = await PostModel.findAllWithFiltersAndSorting(options);
  res.json(posts);
}

export async function get(req, res) {
  const post = await PostModel.findWithCategories(req.params.post_id);
  if (!post) throw new ValidationError("Post not found");

  res.json(post);
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

  res.status(201).json({
    message: "Post created",
    post
  });
}

export async function update(req, res) {
  const { id } = req.params;
  const { title, content, status, categories } = req.body;

  const post = await PostModel.find(id);
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
    if (categories !== undefined) fieldsToUpdate.categories = categories;
  }

  if (isAdmin) {
    if (status !== undefined) fieldsToUpdate.status = status;
    if (categories !== undefined) fieldsToUpdate.categories = categories;
  }

  const updatedPost = await PostModel.update(id, fieldsToUpdate);

  res.status(200).json({
    message: "Post updated",
    post: updatedPost
  });
}

export async function remove(req, res) {
  const { id } = req.params;

  const post = await PostModel.find(id);
  if (!post) throw new ValidationError("Post not found");

  if (req.user.id !== post.user_id && req.user.role !== "admin") {
    throw new ForbiddenError();
  }

  await CategoryModel.deleteByPost(id);
  await PostModel.delete(id);

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
  const { content } = req.validatedBody;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");
  if (post.status !== "active") throw new ForbiddenError("Cannot comment inactive post");

  const comment = await CommentModel.create({
    post_id,
    user_id: req.user.id,
    content,
  });

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

  const like = await PostLikeModel.create({
    post_id,
    user_id: req.user.id,
    type,
  });

  res.status(201).json({
    message: "Like added",
    like,
  });
}

export async function removeLike(req, res) {
  const { post_id } = req.params;

  const post = await PostModel.find(post_id);
  if (!post) throw new ValidationError("Post not found");

  await PostLikeModel.deleteByUser(post_id, req.user.id);
  res.status(204).send();
}
