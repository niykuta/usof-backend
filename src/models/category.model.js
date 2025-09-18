import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { CATEGORY_QUERIES, POST_CATEGORY_QUERIES } from "#src/database/queries.js";

class CategoryModel extends BaseModel {
  constructor() {
    super("categories");
  }

  async create({ title, description }) {
    const [result] = await db.execute(CATEGORY_QUERIES.CREATE, [title, description]);
    return this.find(result.insertId);
  }

  async update(id, { title, description }) {
    await db.execute(CATEGORY_QUERIES.UPDATE, [title, description, id]);
    return this.find(id);
  }

  async findPosts(categoryId) {
    const [rows] = await db.execute(POST_CATEGORY_QUERIES.FIND_POSTS_BY_CATEGORY, [categoryId]);
    return rows;
  }

  async findByPost(postId) {
    const [rows] = await db.execute(POST_CATEGORY_QUERIES.FIND_BY_POST, [postId]);
    return rows;
  }

  async addToPost(postId, categoryId) {
    await db.execute(POST_CATEGORY_QUERIES.ADD, [postId, categoryId]);
  }

  async removeFromPost(postId, categoryId) {
    await db.execute(POST_CATEGORY_QUERIES.REMOVE, [postId, categoryId]);
  }

  async deleteByPost(postId) {
    await db.execute(POST_CATEGORY_QUERIES.DELETE_BY_POST, [postId]);
  }
}

export default new CategoryModel();
