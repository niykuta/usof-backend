import express from "express";
import { get, update, remove } from "#src/controllers/comment.controller.js";
import { list, create, remove as removeLike } from "#src/controllers/commentLike.controller.js";
import { requireAuth } from "#src/middlewares/auth.middleware.js";
import { validateCommentUpdate, validateLike } from "#src/middlewares/validation.middleware.js";

const commentRouter = express.Router();

commentRouter.get("/:comment_id", requireAuth, get);
commentRouter.get("/:comment_id/like", requireAuth, list);

commentRouter.post("/:comment_id/like", requireAuth, validateLike, create);

commentRouter.patch("/:comment_id", requireAuth, validateCommentUpdate, update);

commentRouter.delete("/:comment_id", requireAuth, remove);
commentRouter.delete("/:comment_id/like", requireAuth, removeLike);

export { commentRouter };
