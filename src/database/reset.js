import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const rootConfig = {
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.ROOT_PASSWORD,
  multipleStatements: true
};

async function resetDatabase() {
  let connection;

  try {
    connection = await mysql.createConnection(rootConfig);

    await connection.execute(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await connection.execute(`DROP USER IF EXISTS '${process.env.DB_USER}'@'localhost'`);

    await connection.end();

  } catch (error) {
    console.error('Database reset failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

if (import.meta.url.startsWith('file://') && (process.argv[1]?.includes('reset.js') || process.argv[1] === undefined)) {
  resetDatabase();
}

export { resetDatabase };
