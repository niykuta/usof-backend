import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { POST_QUERIES, ADMIN_QUERIES } from "#src/database/queries.js";
import CategoryModel from "#src/models/category.model.js";
import { PostQueryBuilder } from "#src/utils/queryBuilder.utils.js";

class PostModel extends BaseModel {
  constructor() {
    super("posts");
  }

  async create({ user_id, title, content, status = "active", categories = [] }) {
    const [result] = await db.execute(POST_QUERIES.CREATE, [
      user_id,
      title,
      content,
      status,
    ]);
    const postId = result.insertId;

    for (const categoryId of categories) {
      await CategoryModel.addToPost(postId, categoryId);
    }

    return this.findWithCategories(postId);
  }

  async update(id, updates) {
    const current = await this.find(id);
    if (!current) {
      throw new Error("Post not found");
    }

    const merged = {
      title: updates.title ?? current.title,
      content: updates.content ?? current.content,
      status: updates.status ?? current.status
    };

    await db.execute(POST_QUERIES.UPDATE, [merged.title, merged.content, merged.status, id]);

    if (updates.categories) {
      await CategoryModel.deleteByPost(id);
      for (const categoryId of updates.categories) {
        await CategoryModel.addToPost(id, categoryId);
      }
    }

    return this.findWithCategories(id);
  }

  async findWithCategories(id) {
    const post = await super.find(id);
    if (!post) return null;

    post.categories = await CategoryModel.findByPost(id);

    const { POST_LIKE_QUERIES } = await import("#src/database/queries.js");
    const [likes] = await db.execute(POST_LIKE_QUERIES.GET_RATING, [id]);
    post.rating = (likes[0]?.likes || 0) - (likes[0]?.dislikes || 0);

    return post;
  }

  async findAllWithCategories() {
    const posts = await super.findAll();

    return Promise.all(
      posts.map(async (post) => {
        post.categories = await CategoryModel.findByPost(post.id);
        return post;
      })
    );
  }

  async findAllWithFiltersAndSorting(options = {}) {
    const { query, params } = PostQueryBuilder.buildPostQuery(POST_QUERIES.FIND_ALL_WITH_LIKES, options);

    const [rows] = await db.execute(query, params);

    return Promise.all(
      rows.map(async (post) => {
        post.categories = await CategoryModel.findByPost(post.id);
        return post;
      })
    );
  }

  async deleteWithCascade(id) {
    for (const query of ADMIN_QUERIES.DELETE_POST_CASCADE) {
      await db.execute(query, [id]);
    }
  }
}

export default new PostModel();
