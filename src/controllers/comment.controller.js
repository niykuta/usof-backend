import CommentModel from "#src/models/comment.model.js";
import { ValidationError, ForbiddenError } from "#src/utils/error.class.js";

export async function get(req, res) {
  const comment = await CommentModel.find(req.params.comment_id);
  if (!comment) throw new ValidationError("Comment not found");
  res.json(comment);
}

export async function update(req, res) {
  const { comment_id } = req.params;
  const { status } = req.validatedBody;

  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  const isAuthor = req.user.id === comment.user_id;
  const isAdmin = req.user.role === "admin";
  if (!isAuthor && !isAdmin) throw new ForbiddenError();

  const updated = await CommentModel.update(comment_id, { status });

  res.json({
    message: "Comment updated",
    comment: updated });
}

export async function remove(req, res) {
  const { comment_id } = req.params;

  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  const isAuthor = req.user.id === comment.user_id;
  const isAdmin = req.user.role === "admin";
  if (!isAuthor && !isAdmin) throw new ForbiddenError();

  await CommentModel.delete(comment_id);
  res.status(204).send();
}
