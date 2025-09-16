import PostModel from "#src/models/post.model.js";
import { ValidationError, ForbiddenError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const posts = await PostModel.findAll();
  res.json(posts);
}

export async function get(req, res) {
  const post = await PostModel.find(req.params.id);
  if (!post) throw new ValidationError("Post not found");
  res.json(post);
}

export async function create(req, res) {
  const { title, content, status } = req.body;
  const user_id = req.user.id;

  const post = await PostModel.create({ user_id, title, content, status });
  res.status(201).json({
    message: "Post created",
    post
  });
}

export async function update(req, res) {
  const { id } = req.params;
  const { title, content, status } = req.body;

  const post = await PostModel.find(id);
  if (!post) throw new ValidationError("Post not found");

  if (req.user.id !== post.user_id && req.user.role !== "admin") {
    throw new ForbiddenError();
  }

  const updated = await PostModel.update(id, { title, content, status });
  res.status(200).json({
    message: "Post updated", post: updated
  });
}

export async function remove(req, res) {
  const { id } = req.params;

  const post = await PostModel.find(id);
  if (!post) throw new ValidationError("Post not found");

  if (req.user.id !== post.user_id && req.user.role !== "admin") {
    throw new ForbiddenError();
  }

  await PostModel.delete(id);
  res.status(204).send();
}
