import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { SESSION_QUERIES } from "#src/database/queries.js";
import bcrypt from "bcrypt";

class SessionModel extends BaseModel {
  constructor() {
    super("sessions");
  }

  async create({ user_id, refresh_token, expires_at }) {
    const hashedToken = await bcrypt.hash(refresh_token, 12);
    await db.execute(SESSION_QUERIES.CREATE, [user_id, hashedToken, expires_at]);
    return this.findByUser(user_id);
  }

  async update({ user_id, refresh_token, expires_at }) {
    const hashedToken = await bcrypt.hash(refresh_token, 12);
    await db.execute(SESSION_QUERIES.UPDATE, [hashedToken, expires_at, user_id]);
    return this.findByUser(user_id);
  }

  async findByUser(user_id) {
    const [rows] = await db.execute(SESSION_QUERIES.FIND_BY_USER, [user_id]);
    return rows[0] || null;
  }

  async validateToken(user_id, refreshToken) {
    const session = await this.findByUser(user_id);
    if (!session) return null;

    const isMatch = await bcrypt.compare(refreshToken, session.refresh_token);
    if (!isMatch) return null;

    if (new Date(session.expires_at) < new Date()) {
      await this.deleteByUser(user_id);
      return null;
    }

    return session;
  }

  async deleteByUser(user_id) {
    await db.execute(SESSION_QUERIES.DELETE_BY_USER, [user_id]);
  }
}

export default new SessionModel();
