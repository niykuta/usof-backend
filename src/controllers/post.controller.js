import PostModel from "#src/models/post.model.js";
import CategoryModel from "#src/models/category.model.js";
import { ValidationError, ForbiddenError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const posts = await PostModel.findAllWithCategories();
  res.json(posts);
}

export async function get(req, res) {
  const post = await PostModel.findWithCategories(req.params.id);
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