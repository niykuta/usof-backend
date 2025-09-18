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
    UPDATE session
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

