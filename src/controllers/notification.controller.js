import NotificationService from '#src/services/notification.service.js';
import { ValidationError, ForbiddenError } from '#src/utils/error.class.js';

export async function list(req, res) {
  const { user_id } = req.params;
  const { limit = 20, offset = 0 } = req.query;

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot access other user's notifications");
  }

  const notifications = await NotificationService.getUserNotifications(
    user_id,
    parseInt(limit),
    parseInt(offset)
  );

  res.json({
    user_id: parseInt(user_id),
    notifications,
    pagination: {
      limit: parseInt(limit),
      offset: parseInt(offset)
    }
  });
}

export async function unread(req, res) {
  const { user_id } = req.params;

  const isOwner = req.user.id === parseInt(user_id);
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new ForbiddenError("Cannot access other user's notifications");
  }

  const notifications = await NotificationService.getUnreadNotifications(user_id);
  const count = await NotificationService.getUnreadCount(user_id);

  res.json({
    user_id: parseInt(user_id),
    unread_count: count,
    notifications
  });
}

export async function markAsRead(req, res) {
  const { notification_id } = req.params;

  const success = await NotificationService.markAsRead(notification_id, req.user.id);
  if (!success) {
    throw new ValidationError("Notification not found or already read");
  }

  res.json({
    message: "Notification marked as read"
  });
}

export async function markAllAsRead(req, res) {
  const affectedRows = await NotificationService.markAllAsRead(req.user.id);

  res.json({
    message: `${affectedRows} notifications marked as read`
  });
}