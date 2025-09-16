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
