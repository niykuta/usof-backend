import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { COMMENT_QUERIES } from "#src/database/queries.js";

class CommentModel extends BaseModel {
  constructor() {
    super("comments");
  }

  async create({ post_id, user_id, content }) {
    const [result] = await db.execute(COMMENT_QUERIES.CREATE, [post_id, user_id, content]);
    return this.find(result.insertId);
  }

  async update(id, updates) {
    const current = await this.find(id);
    if (!current) throw new Error("Comment not found");

    const merged = {
      content: updates.content ?? current.content,
      status: updates.status ?? current.status
    };

    await db.execute(COMMENT_QUERIES.UPDATE_FULL, [merged.content, merged.status, id]);
    return this.find(id);
  }

  async findByPost(postId) {
    const [rows] = await db.execute(COMMENT_QUERIES.FIND_BY_POST, [postId]);
    return rows;
  }
}

export default new CommentModel();
