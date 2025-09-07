import BaseModel from '#src/models/base.model.js';
import db from '#src/database/pool.js';
import { USER_QUERIES } from '#src/database/queries.js';

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async create({ login, password, full_name, email, profile_picture, role = 'user' }) {
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

  async update(id, { login, password, full_name, email, profile_picture, role }) {
    await db.execute(USER_QUERIES.UPDATE, [
      login,
      password,
      full_name,
      email,
      profile_picture,
      role,
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
}

export default new UserModel();
