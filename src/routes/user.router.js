import express from 'express';
import { avatar, create, get, list, remove, update, favorites } from "#src/controllers/user.controller.js";
import {requireAuth} from "#src/middlewares/auth.middleware.js";

const userRouter = express.Router();

userRouter.get('/', requireAuth, list);
userRouter.get('/:user_id', requireAuth, get);
userRouter.get('/:user_id/favorites', requireAuth, favorites);

userRouter.post('/', requireAuth, create);

userRouter.patch('/avatar', requireAuth, avatar);
userRouter.patch('/:user_id', requireAuth, update);

userRouter.delete('/:user_id', requireAuth, remove);

export { userRouter };
