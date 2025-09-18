import express from 'express';
import { list, get, create, update, remove, posts } from "#src/controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.get('/', list);
categoryRouter.get('/:category_id', get);
categoryRouter.get('/:category_id/posts', posts);

categoryRouter.post('/', create);

categoryRouter.patch('/:category_id', update);

categoryRouter.delete('/:category_id', remove);

export { categoryRouter };
