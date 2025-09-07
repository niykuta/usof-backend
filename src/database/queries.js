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