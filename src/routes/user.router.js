import express from 'express';

const userRouter = express.Router();

userRouter.get('/', list);
userRouter.get('/:user_id', get);

userRouter.post('/', create);

userRouter.patch('/avatar', avatar);
userRouter.patch('/:user_id', update);

userRouter.delete('/:user_id', remove);

export { userRouter };
