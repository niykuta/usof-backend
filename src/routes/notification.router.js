import express from 'express';
import { list, unread, markAsRead, markAllAsRead } from '#src/controllers/notification.controller.js';
import { requireAuth } from '#src/middlewares/auth.middleware.js';

const notificationRouter = express.Router();

notificationRouter.get('/:user_id', requireAuth, list);
notificationRouter.get('/:user_id/unread', requireAuth, unread);

notificationRouter.patch('/:notification_id/read', requireAuth, markAsRead);
notificationRouter.patch('/read-all', requireAuth, markAllAsRead);

export { notificationRouter };