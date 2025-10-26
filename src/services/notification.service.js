import NotificationModel from '#src/models/notification.model.js';
import SubscriptionModel from '#src/models/subscription.model.js';

class NotificationService {
  async notifyPostUpdate(postId, postTitle, updaterName) {
    const subscribers = await SubscriptionModel.findByPost(postId);

    if (subscribers.length === 0) return;

    const notifications = subscribers.map(subscriber => ({
      user_id: subscriber.user_id,
      post_id: postId,
      comment_id: null,
      type: 'post_updated',
      message: `Post "${postTitle}" was updated`
    }));

    return await NotificationModel.createBulk(notifications);
  }

  async notifyNewComment(postId, postTitle, commenterName, commentId = null, excludeUserId = null) {
    const subscribers = await SubscriptionModel.findByPost(postId);

    if (subscribers.length === 0) return;

    const notifications = subscribers
      .filter(subscriber => subscriber.user_id !== excludeUserId)
      .map(subscriber => ({
        user_id: subscriber.user_id,
        post_id: postId,
        comment_id: commentId,
        type: 'comment_added',
        message: `New comment on post "${postTitle}"`
      }));

    if (notifications.length === 0) return;

    return await NotificationModel.createBulk(notifications);
  }

  async getUserNotifications(userId, limit = 20, offset = 0) {
    return await NotificationModel.findByUser(userId, limit, offset);
  }

  async getUnreadNotifications(userId) {
    return await NotificationModel.findUnreadByUser(userId);
  }

  async markAsRead(notificationId, userId) {
    return await NotificationModel.markAsRead(notificationId, userId);
  }

  async markAllAsRead(userId) {
    return await NotificationModel.markAllAsRead(userId);
  }

  async getUnreadCount(userId) {
    return await NotificationModel.countUnreadByUser(userId);
  }
}

export default new NotificationService();