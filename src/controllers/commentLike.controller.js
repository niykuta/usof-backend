import CommentLikeModel from "#src/models/commentLike.model.js";
import CommentModel from "#src/models/comment.model.js";
import UserModel from "#src/models/user.model.js";
import { ValidationError, ConflictError } from "#src/utils/error.class.js";

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

  const existingLike = await CommentLikeModel.findByUserAndComment(req.user.id, comment_id);

  if (existingLike && existingLike.type === type) {
    await CommentLikeModel.deleteByUser(comment_id, req.user.id);
    await UserModel.updateRating(comment.user_id);
    return res.status(200).json({
      message: "Vote removed",
      action: "removed"
    });
  }

  const like = await CommentLikeModel.create({
    comment_id,
    user_id: req.user.id,
    type,
  });

  await UserModel.updateRating(comment.user_id);

  res.status(existingLike ? 200 : 201).json({
    message: existingLike ? "Vote updated" : "Vote added",
    action: existingLike ? "updated" : "created",
    like
  });
}

export async function remove(req, res) {
  const { comment_id } = req.params;
  const comment = await CommentModel.find(comment_id);
  if (!comment) throw new ValidationError("Comment not found");

  await CommentLikeModel.deleteByUser(comment_id, req.user.id);
  await UserModel.updateRating(comment.user_id);
  res.status(204).send();
}
