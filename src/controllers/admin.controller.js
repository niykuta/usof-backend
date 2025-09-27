import db from '#src/database/pool.js';
import { ADMIN_QUERIES } from '#src/database/queries.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [userCount] = await db.execute(ADMIN_QUERIES.USER_COUNT);
    const [postCount] = await db.execute(ADMIN_QUERIES.POST_COUNT);
    const [commentCount] = await db.execute(ADMIN_QUERIES.COMMENT_COUNT);
    const [categoryCount] = await db.execute(ADMIN_QUERIES.CATEGORY_COUNT);

    res.json({
      users: userCount[0].count,
      posts: postCount[0].count,
      comments: commentCount[0].count,
      categories: categoryCount[0].count
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};