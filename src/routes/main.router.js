import express from 'express';

import { authRouter } from './auth.router.js';
import { userRouter } from './user.router.js';
import { postRouter } from './post.router.js';
import { commentRouter } from './comment.router.js';
import { categoryRouter } from './category.router.js';

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/posts', postRouter);
mainRouter.use('/categories', categoryRouter);
mainRouter.use('/comments', commentRouter);

export { mainRouter };