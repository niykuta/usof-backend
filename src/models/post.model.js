import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { POST_QUERIES } from "#src/database/queries.js";

class PostModel extends BaseModel {
  constructor() {
    super("posts");
  }

  async create({ user_id, title, content, status = "active" }) {
    const [result] = await db.execute(POST_QUERIES.CREATE, [
      user_id,
      title,
      content,
      status
    ]);
    return this.find(result.insertId);
  }

  async update(id, { title, content, status }) {
    await db.execute(POST_QUERIES.UPDATE, [title, content, status, id]);
    return this.find(id);
  }
}

export default new PostModel();
