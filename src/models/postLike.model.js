import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { POST_LIKE_QUERIES } from "#src/database/queries.js";

class PostLikeModel extends BaseModel {
  constructor() {
    super("post_likes");
  }

  async create({ post_id, user_id, type }) {
    const [result] = await db.execute(POST_LIKE_QUERIES.CREATE, [post_id, user_id, type]);
    return this.find(result.insertId);
  }

  async findByPost(postId) {
    const [rows] = await db.execute(POST_LIKE_QUERIES.FIND_BY_POST, [postId]);
    return rows;
  }

  async deleteByUser(postId, userId) {
    await db.execute(POST_LIKE_QUERIES.DELETE_BY_USER, [postId, userId]);
  }
}

export default new PostLikeModel();
