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
  FIND_BY_ID: `SELECT * FROM users WHERE id = ?`,
  FIND_BY_LOGIN: `SELECT * FROM users WHERE login = ?`,
  FIND_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,
};

export const SESSION_QUERIES = {
  CREATE: `
    INSERT INTO sessions (user_id, refresh_token, expires_at)
    VALUES (?, ?, ?)
  `,
  UPDATE: `
    UPDATE sessions
    SET refresh_token = ?, expires_at = ?
    WHERE user_id = ?
  `,
  FIND_BY_USER: `SELECT * FROM sessions WHERE user_id = ?`,
  DELETE_BY_USER: `DELETE FROM sessions WHERE user_id = ?`
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
      COUNT(CASE WHEN pl.type = 'like' THEN 1 END) as like_count,
      COUNT(CASE WHEN pl.type = 'dislike' THEN 1 END) as dislike_count,
      (COUNT(CASE WHEN pl.type = 'like' THEN 1 END) - COUNT(CASE WHEN pl.type = 'dislike' THEN 1 END)) as total_likes
    FROM posts p
    LEFT JOIN post_likes pl ON p.id = pl.post_id
    LEFT JOIN users u ON p.user_id = u.id
    WHERE 1=1
    {{WHERE}}
    GROUP BY p.id
    {{ORDER_BY}}
    {{LIMIT}}
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
    INSERT INTO comments (post_id, user_id, content)
    VALUES (?, ?, ?)
  `,
  UPDATE: `
    UPDATE comments
    SET status = ?
    WHERE id = ?
  `,
  FIND_BY_POST: `
    SELECT * FROM comments
    WHERE post_id = ?
    ORDER BY created_at ASC
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
  DELETE_BY_USER: `
    DELETE FROM post_likes
    WHERE post_id = ? AND user_id = ?
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

export const FAVORITE_QUERIES = {
  CREATE: `
    INSERT INTO favorites (user_id, post_id)
    VALUES (?, ?)
  `,
  FIND_BY_USER: `
    SELECT f.*,
           p.title, p.content, p.status, p.created_at as post_created_at,
           u.login as author_login, u.full_name as author_name
    FROM favorites f
    JOIN posts p ON f.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE f.user_id = ?
    ORDER BY f.created_at DESC
  `,
  FIND_BY_USER_AND_POST: `
    SELECT * FROM favorites
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

export const ADMIN_QUERIES = {
  USER_COUNT: `SELECT COUNT(*) as count FROM users`,
  POST_COUNT: `SELECT COUNT(*) as count FROM posts`,
  COMMENT_COUNT: `SELECT COUNT(*) as count FROM comments`,
  CATEGORY_COUNT: `SELECT COUNT(*) as count FROM categories`,
  DELETE_USER_CASCADE: [
    `DELETE FROM sessions WHERE user_id = ?`,
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
