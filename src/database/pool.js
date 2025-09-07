import mysql from "mysql2/promise";
import config from "./config.json" assert { type: "json" };

const pool = mysql.createPool(config);

export default pool;
