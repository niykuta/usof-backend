export const USER_QUERIES = {
  CREATE: `
    INSERT INTO users (login, password, full_name, email, profile_picture, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE: `
    UPDATE users
    SET login = ?, password = ?, full_name = ?, email = ?, profile_picture = ?, role = ?
    WHERE id = ?
  `,
  VERIFY_EMAIL: `
    UPDATE users
    SET email_verified = TRUE
    WHERE id = ?
  `,
  UPDATE_RATING: `
    UPDATE users
    SET rating = ?
    WHERE id = ?
  `,
  CALCULATE_RATING: `
    SELECT
      COALESCE(
        (SELECT COUNT(*) FROM post_likes pl
         JOIN posts p ON pl.post_id = p.id
         WHERE p.user_id = ? AND pl.type = 'like'), 0
      ) -
      COALESCE(
        (SELECT COUNT(*) FROM post_likes pl
         JOIN posts p ON pl.post_id = p.id
         WHERE p.user_id = ? AND pl.type = 'dislike'), 0
      ) +
      COALESCE(
        (SELECT COUNT(*) FROM comment_likes cl
         JOIN comments c ON cl.comment_id = c.id
         WHERE c.user_id = ? AND cl.type = 'like'), 0
      ) -
      COALESCE(
        (SELECT COUNT(*) FROM comment_likes cl
         JOIN comments c ON cl.comment_id = c.id
         WHERE c.user_id = ? AND cl.type = 'dislike'), 0
      ) as rating
  `,
  FIND_BY_ID: `SELECT * FROM users WHERE id = ?`,
  FIND_BY_LOGIN: `SELECT * FROM users WHERE login = ?`,
  FIND_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,
};

export const PASSWORD_RESET_QUERIES = {
  CREATE: `
    INSERT INTO password_resets (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `,
  FIND_BY_TOKEN: `SELECT * FROM password_resets WHERE token = ?`,
  DELETE_BY_USER: `DELETE FROM password_resets WHERE user_id = ?`
};

export const POST_QUERIES = {
  CREATE: `
    INSERT INTO posts (user_id, title, content, status)
    VALUES (?, ?, ?, ?)
  `,
  UPDATE: `
    UPDATE posts
    SET title = ?, content = ?, status = ?
    WHERE id = ?
  `,
  FIND_ALL_WITH_LIKES: `
    SELECT
      p.*,
      u.login as author_login,
      u.full_name as author_name,
      u.profile_picture as author_profile_picture,
      COUNT(DISTINCT CASE WHEN pl.type = 'like' THEN pl.id END) as like_count,
      COUNT(DISTINCT CASE WHEN pl.type = 'dislike' THEN pl.id END) as dislike_count,
      (COUNT(DISTINCT CASE WHEN pl.type = 'like' THEN pl.id END) - COUNT(DISTINCT CASE WHEN pl.type = 'dislike' THEN pl.id END)) as total_likes,
      COUNT(DISTINCT c.id) as comment_count
    FROM posts p
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN comments c ON p.id = c.post_id
    WHERE 1=1
    {{WHERE}}
    GROUP BY p.id
    {{HAVING}}
    {{ORDER_BY}}
    {{LIMIT}}
  `,
  COUNT_WITH_FILTERS: `
    SELECT COUNT(*) as total
    FROM (
      SELECT p.id, COUNT(DISTINCT c.id) as comment_count
      FROM posts p
      LEFT JOIN post_likes pl ON p.id = pl.post_id
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN comments c ON p.id = c.post_id
      WHERE 1=1
      {{WHERE}}
      GROUP BY p.id
      {{HAVING}}
    ) as filtered_posts
  `,
  FIND_BY_ID_WITH_DETAILS: `
    SELECT p.*,
           u.login as author_login,
           u.full_name as author_name,
           u.rating as author_rating,
           u.profile_picture as author_profile_picture,
           COUNT(DISTINCT CASE WHEN pl.type = 'like' THEN pl.id END) as like_count,
           COUNT(DISTINCT CASE WHEN pl.type = 'dislike' THEN pl.id END) as dislike_count,
           (COUNT(DISTINCT CASE WHEN pl.type = 'like' THEN pl.id END) - COUNT(DISTINCT CASE WHEN pl.type = 'dislike' THEN pl.id END)) as total_likes,
           COUNT(DISTINCT c.id) as comment_count
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    LEFT JOIN comments c ON p.id = c.post_id
    WHERE p.id = ?
    GROUP BY p.id
  `,
  INCREMENT_VIEWS: `
    UPDATE posts
    SET views = views + 1
    WHERE id = ?
  `
};

export const POST_IMAGE_QUERIES = {
  ADD_IMAGES: `
    INSERT INTO post_images (post_id, image_path, display_order)
    VALUES ?
  `,
  GET_IMAGES: `
    SELECT id, image_path, display_order
    FROM post_images
    WHERE post_id = ?
    ORDER BY display_order ASC
  `,
  DELETE_IMAGE: `
    DELETE FROM post_images
    WHERE id = ? AND post_id = ?
  `,
  DELETE_IMAGES_BULK: `
    DELETE FROM post_images
    WHERE post_id = ? AND id IN (?)
  `,
  GET_IMAGE_BY_ID: `
    SELECT id, post_id, image_path
    FROM post_images
    WHERE id = ?
  `,
  GET_IMAGES_BY_IDS: `
    SELECT id, post_id, image_path
    FROM post_images
    WHERE post_id = ? AND id IN (?)
  `
};

export const CATEGORY_QUERIES = {
  CREATE: `
    INSERT INTO categories (title, description)
    VALUES (?, ?)
  `,
  UPDATE: `
    UPDATE categories
    SET title = ?, description = ?
    WHERE id = ?
  `,
};

export const POST_CATEGORY_QUERIES = {
  ADD: `
    INSERT INTO post_categories (post_id, category_id)
    VALUES (?, ?)
  `,
  REMOVE: `
    DELETE FROM post_categories
    WHERE post_id = ? AND category_id = ?
  `,
  DELETE_BY_POST: `
    DELETE FROM post_categories
    WHERE post_id = ?
  `,
  FIND_BY_POST: `
    SELECT categories.*
    FROM categories
    JOIN post_categories ON categories.id = post_categories.category_id
    WHERE post_categories.post_id = ?
  `,
  FIND_POSTS_BY_CATEGORY: `
    SELECT posts.* 
    FROM posts
    JOIN post_categories ON posts.id = post_categories.post_id
    WHERE post_categories.category_id = ?
  `
};

export const COMMENT_QUERIES = {
  CREATE: `
    INSERT INTO comments (post_id, user_id, parent_comment_id, content)
    VALUES (?, ?, ?, ?)
  `,
  UPDATE: `
    UPDATE comments
    SET status = ?
    WHERE id = ?
  `,
  UPDATE_FULL: `
    UPDATE comments
    SET content = ?, status = ?
    WHERE id = ?
  `,
  FIND_BY_POST: `
    SELECT c.*,
           u.login as author_login,
           u.full_name as author_name,
           u.rating as author_rating,
           u.profile_picture as author_profile_picture,
           COUNT(DISTINCT CASE WHEN cl.type = 'like' THEN cl.id END) as like_count,
           COUNT(DISTINCT CASE WHEN cl.type = 'dislike' THEN cl.id END) as dislike_count,
           (COUNT(DISTINCT CASE WHEN cl.type = 'like' THEN cl.id END) - COUNT(DISTINCT CASE WHEN cl.type = 'dislike' THEN cl.id END)) as total_likes
    FROM comments c
    LEFT JOIN users u ON c.user_id = u.id
    LEFT JOIN comment_likes cl ON c.id = cl.comment_id
    WHERE c.post_id = ?
    GROUP BY c.id
    ORDER BY c.created_at ASC
  `
};

export const POST_LIKE_QUERIES = {
  CREATE: `
    INSERT INTO post_likes (post_id, user_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type)
  `,
  FIND_BY_POST: `
    SELECT * FROM post_likes
    WHERE post_id = ?
  `,
  FIND_BY_USER_AND_POST: `
    SELECT * FROM post_likes
    WHERE user_id = ? AND post_id = ?
  `,
  DELETE_BY_USER: `
    DELETE FROM post_likes
    WHERE post_id = ? AND user_id = ?
  `,
  GET_RATING: `
    SELECT
      COUNT(CASE WHEN type = "like" THEN 1 END) as likes,
      COUNT(CASE WHEN type = "dislike" THEN 1 END) as dislikes
    FROM post_likes
    WHERE post_id = ?
  `
};

export const COMMENT_LIKE_QUERIES = {
  CREATE: `
    INSERT INTO comment_likes (comment_id, user_id, type)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE type = VALUES(type)
  `,
  FIND_BY_COMMENT: `
    SELECT * FROM comment_likes
    WHERE comment_id = ?
  `,
  FIND_BY_USER_AND_COMMENT: `
    SELECT * FROM comment_likes
    WHERE user_id = ? AND comment_id = ?
  `,
  DELETE_BY_USER: `
    DELETE FROM comment_likes
    WHERE comment_id = ? AND user_id = ?
  `
};

export const EMAIL_VERIFICATION_QUERIES = {
  CREATE: `
    INSERT INTO email_verifications (user_id, token, expires_at)
    VALUES (?, ?, ?)
  `,
  FIND_BY_TOKEN: `
    SELECT * FROM email_verifications
    WHERE token = ? AND expires_at > NOW()
  `,
  DELETE_BY_USER: `
    DELETE FROM email_verifications
    WHERE user_id = ?
  `
};

export const SUBSCRIPTION_QUERIES = {
  CREATE: `
    INSERT INTO subscriptions (user_id, post_id)
    VALUES (?, ?)
  `,
  FIND_BY_USER: `
    SELECT s.user_id, s.post_id,
           p.title, p.content, p.status, p.created_at as post_created_at,
           u.login as author_login, u.full_name as author_name
    FROM subscriptions s
    JOIN posts p ON s.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE s.user_id = ?
    ORDER BY p.created_at DESC
  `,
  FIND_BY_POST: `
    SELECT s.user_id, s.post_id, u.login, u.full_name, u.email
    FROM subscriptions s
    JOIN users u ON s.user_id = u.id
    WHERE s.post_id = ?
  `,
  FIND_BY_USER_AND_POST: `
    SELECT user_id, post_id FROM subscriptions
    WHERE user_id = ? AND post_id = ?
  `,
  DELETE_BY_USER_AND_POST: `
    DELETE FROM subscriptions
    WHERE user_id = ? AND post_id = ?
  `,
  COUNT_BY_POST: `
    SELECT COUNT(*) as count
    FROM subscriptions
    WHERE post_id = ?
  `
};

export const NOTIFICATION_QUERIES = {
  CREATE: `
    INSERT INTO notifications (user_id, post_id, comment_id, type, message)
    VALUES (?, ?, ?, ?, ?)
  `,
  CREATE_BULK: (count) => {
    const placeholders = Array(count).fill('(?, ?, ?, ?, ?)').join(', ');
    return `INSERT INTO notifications (user_id, post_id, comment_id, type, message) VALUES ${placeholders}`;
  },
  FIND_BY_USER: (limit, offset) => `
    SELECT n.*,
           p.title as post_title,
           c.content as comment_content
    FROM notifications n
    LEFT JOIN posts p ON n.post_id = p.id
    LEFT JOIN comments c ON n.comment_id = c.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}
  `,
  FIND_UNREAD_BY_USER: `
    SELECT n.*,
           p.title as post_title,
           c.content as comment_content
    FROM notifications n
    LEFT JOIN posts p ON n.post_id = p.id
    LEFT JOIN comments c ON n.comment_id = c.id
    WHERE n.user_id = ? AND n.is_read = FALSE
    ORDER BY n.created_at DESC
  `,
  MARK_AS_READ: `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ? AND user_id = ?
  `,
  MARK_ALL_AS_READ: `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = ?
  `,
  COUNT_UNREAD_BY_USER: `
    SELECT COUNT(*) as count
    FROM notifications
    WHERE user_id = ? AND is_read = FALSE
  `
};

export const FAVORITE_QUERIES = {
  CREATE: `
    INSERT INTO favorites (user_id, post_id)
    VALUES (?, ?)
  `,
  FIND_BY_USER: `
    SELECT f.user_id, f.post_id,
           p.title, p.content, p.status, p.created_at as post_created_at,
           u.login as author_login, u.full_name as author_name
    FROM favorites f
    JOIN posts p ON f.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE f.user_id = ?
    ORDER BY p.created_at DESC
  `,
  FIND_BY_USER_AND_POST: `
    SELECT user_id, post_id FROM favorites
    WHERE user_id = ? AND post_id = ?
  `,
  DELETE_BY_USER_AND_POST: `
    DELETE FROM favorites
    WHERE user_id = ? AND post_id = ?
  `,
  COUNT_BY_POST: `
    SELECT COUNT(*) as count
    FROM favorites
    WHERE post_id = ?
  `
};

export const ACTIVITY_QUERIES = {
  GET_USER_POSTS: `
    SELECT id, title, created_at, 'post' as type
    FROM posts
    WHERE user_id = ? AND status = 'active'
  `,
  GET_USER_COMMENTS: `
    SELECT c.id, c.content, c.created_at, c.post_id, p.title as post_title, 'comment' as type
    FROM comments c
    JOIN posts p ON c.post_id = p.id
    WHERE c.user_id = ? AND c.status = 'active'
  `,
  GET_USER_POST_LIKES: `
    SELECT pl.id, pl.created_at, pl.type as like_type, pl.post_id, p.title as post_title, 'post_like' as type
    FROM post_likes pl
    JOIN posts p ON pl.post_id = p.id
    WHERE pl.user_id = ?
  `,
  GET_USER_COMMENT_LIKES: `
    SELECT cl.id, cl.created_at, cl.type as like_type, cl.comment_id, c.content as comment_content, c.post_id, p.title as post_title, 'comment_like' as type
    FROM comment_likes cl
    JOIN comments c ON cl.comment_id = c.id
    JOIN posts p ON c.post_id = p.id
    WHERE cl.user_id = ?
  `
};

export const ADMIN_QUERIES = {
  USER_COUNT: `SELECT COUNT(*) as count FROM users`,
  POST_COUNT: `SELECT COUNT(*) as count FROM posts`,
  COMMENT_COUNT: `SELECT COUNT(*) as count FROM comments`,
  CATEGORY_COUNT: `SELECT COUNT(*) as count FROM categories`,
  DELETE_USER_CASCADE: [
    `DELETE FROM post_likes WHERE user_id = ?`,
    `DELETE FROM comment_likes WHERE user_id = ?`,
    `DELETE FROM favorites WHERE user_id = ?`,
    `DELETE FROM comments WHERE user_id = ?`,
    `DELETE FROM posts WHERE user_id = ?`,
    `DELETE FROM users WHERE id = ?`
  ],
  DELETE_POST_CASCADE: [
    `DELETE FROM post_likes WHERE post_id = ?`,
    `DELETE FROM favorites WHERE post_id = ?`,
    `DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE post_id = ?)`,
    `DELETE FROM comments WHERE post_id = ?`,
    `DELETE FROM post_categories WHERE post_id = ?`,
    `DELETE FROM posts WHERE id = ?`
  ]
};
