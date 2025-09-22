import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD || 'root',
  multipleStatements: true
};

const userDbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  multipleStatements: true
};

async function runSqlFile(connection, filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  await connection.execute(sql);
}

async function initializeDatabase() {
  let connection;
  let userConnection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const sqlFiles = [
      'database.sql',
      'users.sql',
      'categories.sql',
      'posts.sql',
      'comments.sql',
      'likes.sql',
      'sessions.sql',
      'resets.sql'
    ];

    const sqlDir = path.join(__dirname, 'sql');

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      await runSqlFile(connection, filePath);
    }

    await connection.end();

    userConnection = await mysql.createConnection(userDbConfig);

    const mockDataPath = path.join(sqlDir, 'mock.sql');
    try {
      await fs.access(mockDataPath);
      await runSqlFile(userConnection, mockDataPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    await userConnection.end();

  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
    if (userConnection) await userConnection.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export { initializeDatabase };