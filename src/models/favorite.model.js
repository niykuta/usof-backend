import BaseModel from './base.model.js';
import db from '#src/database/pool.js';
import { FAVORITE_QUERIES } from '#src/database/queries.js';

class FavoriteModel extends BaseModel {
  constructor() {
    super('favorites');
  }

  async create(favoriteData) {
    const { user_id, post_id } = favoriteData;

    await db.execute(FAVORITE_QUERIES.CREATE, [user_id, post_id]);
    return { user_id, post_id };
  }

  async findByUser(userId) {
    const [rows] = await db.execute(FAVORITE_QUERIES.FIND_BY_USER, [userId]);
    return rows;
  }

  async findByUserAndPost(userId, postId) {
    const [rows] = await db.execute(FAVORITE_QUERIES.FIND_BY_USER_AND_POST, [userId, postId]);
    return rows[0];
  }

  async deleteByUserAndPost(userId, postId) {
    const [result] = await db.execute(FAVORITE_QUERIES.DELETE_BY_USER_AND_POST, [userId, postId]);
    return result.affectedRows > 0;
  }

  async countByPost(postId) {
    const [rows] = await db.execute(FAVORITE_QUERIES.COUNT_BY_POST, [postId]);
    return rows[0].count;
  }
}

export default new FavoriteModel();