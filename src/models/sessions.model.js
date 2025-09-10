import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { SESSION_QUERIES } from "#src/database/queries.js";

class SessionModel extends BaseModel {
  constructor() {
    super("sessions");
  }

  async create({ user_id, refresh_token, expires_at }) {
    const [result] = await db.execute(SESSION_QUERIES.CREATE, [
      user_id,
      refresh_token,
      expires_at
    ]);
    return this.find(result.insertId);
  }

  async findByToken(refreshToken) {
    const [rows] = await db.execute(SESSION_QUERIES.FIND_BY_TOKEN, [refreshToken]);
    return rows[0] || null;
  }

  async validateToken(refreshToken) {
    const session = await this.findByToken(refreshToken);
    if (!session) return null;

    if (new Date(session.expires_at) < new Date()) {
      await this.delete(session.id);
      return null;
    }

    return session;
  }

  async deleteByUser(userId) {
    await db.execute(SESSION_QUERIES.DELETE_BY_USER, [userId]);
  }
}

export default new SessionModel();
