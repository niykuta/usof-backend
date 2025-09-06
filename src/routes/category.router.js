import express from 'express';

const categoryRouter = express.Router();

categoryRouter.get('/', list);
categoryRouter.get('/:category_id', get);
categoryRouter.get('/:category_id/posts', posts);

categoryRouter.post('/', create);

categoryRouter.patch('/:category_id', update);

categoryRouter.delete('/:category_id', remove);

export { categoryRouter };
