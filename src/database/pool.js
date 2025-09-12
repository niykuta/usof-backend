import mysql from "mysql2/promise";
import config from "#src/config/database.config.js";

const pool = mysql.createPool(config);

export default pool;
