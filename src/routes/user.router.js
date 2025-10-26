import express from 'express';
import { avatar, create, get, list, remove, update, favorites, subscriptions, top, answers, activity } from "#src/controllers/user.controller.js";
import {requireAuth, requireAdmin} from "#src/middlewares/auth.middleware.js";
import { uploadAvatar } from "#src/middlewares/upload.middleware.js";

const userRouter = express.Router();

userRouter.get('/top', top);
userRouter.get('/', requireAdmin, list);
userRouter.get('/:user_id', requireAuth, get);
userRouter.get('/:user_id/favorites', requireAuth, favorites);
userRouter.get('/:user_id/subscriptions', requireAuth, subscriptions);
userRouter.get('/:user_id/answers', requireAuth, answers);
userRouter.get('/:user_id/activity', requireAuth, activity);

userRouter.post('/', requireAdmin, create);

userRouter.patch('/avatar', requireAuth, uploadAvatar, avatar);
userRouter.patch('/:user_id', requireAuth, update);

userRouter.delete('/:user_id', requireAdmin, remove);

export { userRouter };
