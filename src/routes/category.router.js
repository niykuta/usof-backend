import express from 'express';
import { list, get, create, update, remove, posts } from "#src/controllers/category.controller.js";
import { requireAuth } from "#src/middlewares/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.get('/', list);
categoryRouter.get('/:category_id', get);
categoryRouter.get('/:category_id/posts', posts);

categoryRouter.post('/', requireAuth, create);

categoryRouter.patch('/:category_id', requireAuth, update);

categoryRouter.delete('/:category_id', requireAuth, remove);

export { categoryRouter };
