import express from 'express';
import { list, get, create, update, remove, posts } from "#src/controllers/category.controller.js";
import { requireAdmin } from "#src/middlewares/auth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.get('/', list);
categoryRouter.get('/:category_id', get);
categoryRouter.get('/:category_id/posts', posts);

categoryRouter.post('/', requireAdmin, create);

categoryRouter.patch('/:category_id', requireAdmin, update);

categoryRouter.delete('/:category_id', requireAdmin, remove);

export { categoryRouter };
