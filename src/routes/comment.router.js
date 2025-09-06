import express from 'express';

const commentRouter = express.Router();

commentRouter.get('/:comment_id', get);
commentRouter.get('/:comment_id/like', likes);

commentRouter.post('/:comment_id/like', addLike);

commentRouter.patch('/:comment_id', update);

commentRouter.delete('/:comment_id', remove);
commentRouter.delete('/:comment_id/like', removeLike);

export { commentRouter };
