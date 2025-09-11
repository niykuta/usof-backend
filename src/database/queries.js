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
  DELETE: `DELETE FROM users WHERE id = ?`,
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
