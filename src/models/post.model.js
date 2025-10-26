import BaseModel from "#src/models/base.model.js";
import db from "#src/database/pool.js";
import { POST_QUERIES, POST_IMAGE_QUERIES, ADMIN_QUERIES } from "#src/database/queries.js";
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
    const [rows] = await db.execute(POST_QUERIES.FIND_BY_ID_WITH_DETAILS, [id]);

    if (!rows || rows.length === 0) return null;

    const post = rows[0];
    post.categories = await CategoryModel.findByPost(id);
    post.images = await this.getImages(id);

    return post;
  }

  async incrementViews(id) {
    await db.execute(POST_QUERIES.INCREMENT_VIEWS, [id]);
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

  async countWithFilters(options = {}) {
    const { query, params } = PostQueryBuilder.buildPostQuery(
      POST_QUERIES.COUNT_WITH_FILTERS,
      { ...options, limit: null, offset: 0 }
    );
    const [rows] = await db.execute(query, params);
    return rows[0]?.total || 0;
  }

  async deleteWithCascade(id) {
    for (const query of ADMIN_QUERIES.DELETE_POST_CASCADE) {
      await db.execute(query, [id]);
    }
  }

  async addImages(postId, imagePaths) {
    if (!imagePaths || imagePaths.length === 0) return [];

    const values = imagePaths.map((path, index) => [postId, path, index]);
    const placeholders = values.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();

    const query = `INSERT INTO post_images (post_id, image_path, display_order) VALUES ${placeholders}`;
    await db.execute(query, flatValues);

    return this.getImages(postId);
  }

  async getImages(postId) {
    const [rows] = await db.execute(POST_IMAGE_QUERIES.GET_IMAGES, [postId]);
    return rows || [];
  }

  async deleteImage(imageId, postId) {
    const [result] = await db.execute(POST_IMAGE_QUERIES.DELETE_IMAGE, [imageId, postId]);
    return result.affectedRows > 0;
  }

  async getImageById(imageId) {
    const [rows] = await db.execute(POST_IMAGE_QUERIES.GET_IMAGE_BY_ID, [imageId]);
    return rows[0] || null;
  }

  async getImagesByIds(postId, imageIds) {
    if (!imageIds || imageIds.length === 0) return [];
    const placeholders = imageIds.map(() => '?').join(',');
    const query = `
      SELECT id, post_id, image_path
      FROM post_images
      WHERE post_id = ? AND id IN (${placeholders})
    `;
    const [rows] = await db.execute(query, [postId, ...imageIds]);
    return rows || [];
  }

  async deleteImagesBulk(postId, imageIds) {
    if (!imageIds || imageIds.length === 0) return 0;
    const placeholders = imageIds.map(() => '?').join(',');
    const query = `
      DELETE FROM post_images
      WHERE post_id = ? AND id IN (${placeholders})
    `;
    const [result] = await db.execute(query, [postId, ...imageIds]);
    return result.affectedRows;
  }
}

export default new PostModel();
