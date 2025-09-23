import BaseModel from '#src/models/base.model.js';
import db from '#src/database/pool.js';
import { EMAIL_VERIFICATION_QUERIES } from '#src/database/queries.js';

class EmailVerificationModel extends BaseModel {
  constructor() {
    super('email_verifications');
  }

  async create({ user_id, token, expires_at }) {
    const [result] = await db.execute(EMAIL_VERIFICATION_QUERIES.CREATE, [
      user_id,
      token,
      expires_at
    ]);

    return this.find(result.insertId);
  }

  async findByToken(token) {
    const [rows] = await db.execute(EMAIL_VERIFICATION_QUERIES.FIND_BY_TOKEN, [token]);
    return rows[0] || null;
  }

  async deleteByUserId(user_id) {
    await db.execute(EMAIL_VERIFICATION_QUERIES.DELETE_BY_USER, [user_id]);
  }
}

export default new EmailVerificationModel();