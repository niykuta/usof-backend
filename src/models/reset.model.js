import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { PASSWORD_RESET_QUERIES } from "#src/database/queries.js";

class PasswordResetModel extends BaseModel {
  constructor() {
    super("password_resets");
  }

  async create({ user_id, token, expires_at }) {
    await db.execute(PASSWORD_RESET_QUERIES.CREATE, [user_id, token, expires_at]);
  }

  async findByToken(tokenHash) {
    const [rows] = await db.execute(PASSWORD_RESET_QUERIES.FIND_BY_TOKEN, [tokenHash]);
    return rows[0] || null;
  }

  async deleteByUser(user_id) {
    await db.execute(PASSWORD_RESET_QUERIES.DELETE_BY_USER, [user_id]);
  }
}

export default new PasswordResetModel();
