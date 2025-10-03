import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { COMMENT_LIKE_QUERIES } from "#src/database/queries.js";

class CommentLikeModel extends BaseModel {
  constructor() {
    super("comment_likes");
  }

  async create({ comment_id, user_id, type }) {
    const [result] = await db.execute(COMMENT_LIKE_QUERIES.CREATE, [comment_id, user_id, type]);
    return this.find(result.insertId);
  }

  async findByComment(commentId) {
    const [rows] = await db.execute(COMMENT_LIKE_QUERIES.FIND_BY_COMMENT, [commentId]);
    return rows;
  }

  async findByUserAndComment(userId, commentId) {
    const [rows] = await db.execute(COMMENT_LIKE_QUERIES.FIND_BY_USER_AND_COMMENT, [userId, commentId]);
    return rows[0] || null;
  }

  async deleteByUser(commentId, userId) {
    await db.execute(COMMENT_LIKE_QUERIES.DELETE_BY_USER, [commentId, userId]);
  }
}

export default new CommentLikeModel();
