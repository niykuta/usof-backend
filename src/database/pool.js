import mysql from "mysql2/promise";
import config from "./config.json" assert { type: "json" };

const db = mysql.createPool(config);

export default db;
