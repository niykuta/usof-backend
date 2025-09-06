import express from 'express';

const postRouter = express.Router();

postRouter.get('/', list);
postRouter.get('/:post_id', get);
postRouter.get('/:post_id/comments', comments);

postRouter.post('/:post_id/comments', addComment);
postRouter.get('/:post_id/categories', categories);
postRouter.get('/:post_id/like', likes);

postRouter.post('/', create);
postRouter.post('/:post_id/like', addLike);

postRouter.patch('/:post_id', update);

postRouter.delete('/:post_id', remove);
postRouter.delete('/:post_id/like', removeLike);

export { postRouter };
