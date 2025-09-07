import db from '#src/database/pool.js';

class BaseModel {
  constructor(table) {
    this.table = table;
  }

  async find(id) {
    const [rows] = await db.execute(
      `SELECT * FROM \`${this.table}\` WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  async findAll() {
    const [rows] = await db.execute(
      `SELECT * FROM \`${this.table}\``
    );
    return rows;
  }

  async delete(id) {
    await db.execute(
      `DELETE FROM \`${this.table}\` WHERE id = ?`,
      [id]
    );
  }
}

export default BaseModel;
