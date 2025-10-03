import BaseModel from './base.model.js';
import db from '#src/database/pool.js';
import { NOTIFICATION_QUERIES } from '#src/database/queries.js';

class NotificationModel extends BaseModel {
  constructor() {
    super('notifications');
  }

  async create(notificationData) {
    const { user_id, post_id, comment_id, type, message } = notificationData;

    const [result] = await db.execute(NOTIFICATION_QUERIES.CREATE, [user_id, post_id, comment_id, type, message]);
    return this.find(result.insertId);
  }

  async findByUser(userId, limit = 20, offset = 0) {
    const [rows] = await db.execute(NOTIFICATION_QUERIES.FIND_BY_USER(limit, offset), [userId]);
    return rows;
  }

  async findUnreadByUser(userId) {
    const [rows] = await db.execute(NOTIFICATION_QUERIES.FIND_UNREAD_BY_USER, [userId]);
    return rows;
  }

  async markAsRead(notificationId, userId) {
    const [result] = await db.execute(NOTIFICATION_QUERIES.MARK_AS_READ, [notificationId, userId]);
    return result.affectedRows > 0;
  }

  async markAllAsRead(userId) {
    const [result] = await db.execute(NOTIFICATION_QUERIES.MARK_ALL_AS_READ, [userId]);
    return result.affectedRows;
  }

  async countUnreadByUser(userId) {
    const [rows] = await db.execute(NOTIFICATION_QUERIES.COUNT_UNREAD_BY_USER, [userId]);
    return rows[0].count;
  }

  async createBulk(notifications) {
    if (notifications.length === 0) return;

    const values = notifications.map(n => [n.user_id, n.post_id, n.comment_id, n.type, n.message]);
    const query = NOTIFICATION_QUERIES.CREATE_BULK(notifications.length);

    const [result] = await db.execute(query, values.flat());
    return result.affectedRows;
  }
}

export default new NotificationModel();