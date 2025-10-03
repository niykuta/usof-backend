import BaseModel from '#src/models/base.model.js';
import db from '#src/database/pool.js';
import { USER_QUERIES, ADMIN_QUERIES } from '#src/database/queries.js';

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async create({ login, password, full_name, email, profile_picture = null, role = 'user' }) {
    const [result] = await db.execute(USER_QUERIES.CREATE, [
      login,
      password,
      full_name,
      email,
      profile_picture,
      role
    ]);

    return this.find(result.insertId);
  }

  async update(id, updates) {
    const current = await this.find(id);
    if (!current) {
      throw new Error("User not found");
    }

    const merged = {
      login: updates.login ?? current.login,
      password: updates.password ?? current.password,
      full_name: updates.full_name ?? current.full_name,
      email: updates.email ?? current.email,
      profile_picture: updates.profile_picture ?? current.profile_picture,
      role: updates.role ?? current.role
    };

    await db.execute(USER_QUERIES.UPDATE, [
      merged.login,
      merged.password,
      merged.full_name,
      merged.email,
      merged.profile_picture,
      merged.role,
      id
    ]);

    return this.find(id);
  }

  async findByLogin(login) {
    const [rows] = await db.execute(USER_QUERIES.FIND_BY_LOGIN, [login]);
    return rows[0] || null;
  }

  async findByEmail(email) {
    const [rows] = await db.execute(USER_QUERIES.FIND_BY_EMAIL, [email]);
    return rows[0] || null;
  }

  async verifyEmail(id) {
    await db.execute(USER_QUERIES.VERIFY_EMAIL, [id]);
    return this.find(id);
  }

  async deleteWithCascade(id) {
    for (const query of ADMIN_QUERIES.DELETE_USER_CASCADE) {
      await db.execute(query, [id]);
    }
  }
}

export default new UserModel();
