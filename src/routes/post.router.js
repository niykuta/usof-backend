import express from 'express';
import { create, get, list, remove, update } from "#src/controllers/post.controller.js";
import { requireAuth } from "#src/middlewares/auth.middleware.js";

const postRouter = express.Router();

postRouter.get("/", list);
postRouter.get("/:id", get);
// postRouter.get('/:post_id/comments', comments);

// postRouter.post('/:post_id/comments', addComment);
// postRouter.get('/:post_id/categories', categories);
// postRouter.get('/:post_id/like', likes);

postRouter.post("/", requireAuth, create);
// postRouter.post('/:post_id/like', addLike);

postRouter.patch("/:id", requireAuth, update);

postRouter.delete("/:id", requireAuth, remove);
// postRouter.delete('/:post_id/like', removeLike);


export { postRouter };
