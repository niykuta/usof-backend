import express from "express";
import {
  list,
  get,
  comments,
  categories,
  likes,
  create,
  addComment,
  addLike,
  update,
  remove,
  removeLike,
  addFavorite,
  removeFavorite,
  addSubscription,
  removeSubscription,
  incrementView,
  deleteImage,
  deleteImagesBulk,
} from "#src/controllers/post.controller.js";
import { requireAuth } from "#src/middlewares/auth.middleware.js";
import {
  validatePostCreate,
  validatePostUpdate,
  validateCommentCreate,
  validateLike,
  parseMultipartJson,
} from "#src/middlewares/validation.middleware.js";
import { uploadPostImages } from "#src/middlewares/upload.middleware.js";

const postRouter = express.Router();

postRouter.get("/", list);
postRouter.get("/:post_id", get);
postRouter.get("/:post_id/comments", comments);
postRouter.get("/:post_id/categories", categories);
postRouter.get("/:post_id/like", likes);

postRouter.post("/", requireAuth, uploadPostImages, parseMultipartJson, validatePostCreate, create);
postRouter.post("/:post_id/comments", requireAuth, validateCommentCreate, addComment);
postRouter.post("/:post_id/like", requireAuth, validateLike, addLike);
postRouter.post("/:post_id/favorite", requireAuth, addFavorite);
postRouter.post("/:post_id/subscribe", requireAuth, addSubscription);
postRouter.post("/:post_id/view", incrementView);

postRouter.patch("/:post_id", requireAuth, uploadPostImages, parseMultipartJson, validatePostUpdate, update);

postRouter.delete("/:post_id", requireAuth, remove);
postRouter.delete("/:post_id/like", requireAuth, removeLike);
postRouter.delete("/:post_id/favorite", requireAuth, removeFavorite);
postRouter.delete("/:post_id/subscribe", requireAuth, removeSubscription);
postRouter.delete("/:post_id/images", requireAuth, deleteImagesBulk);
postRouter.delete("/:post_id/images/:image_id", requireAuth, deleteImage);

export { postRouter };
