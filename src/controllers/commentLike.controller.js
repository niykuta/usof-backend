import CommentLikeModel from "#src/models/commentLike.model.js";
import CommentModel from "#src/models/comment.model.js";
import { ValidationError } from "#src/utils/error.class.js";

export async function list(req, res) {
  const { comment_id } = req.params;
  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  const likes = await CommentLikeModel.findByComment(comment_id);
  res.json(likes);
}

export async function create(req, res) {
  const { comment_id } = req.params;
  const { type } = req.validatedBody;

  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  const like = await CommentLikeModel.create({
    comment_id,
    user_id: req.user.id,
    type,
  });

  res.status(201).json({ message: "Like added", like });
}

export async function remove(req, res) {
  const { comment_id } = req.params;
  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  await CommentLikeModel.deleteByUser(comment_id, req.user.id);
  res.status(204).send();
}
