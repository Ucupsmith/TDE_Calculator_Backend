import mysql2 from "mysql2/promise";

const db = mysql2.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "tdee_calculator",
  port: process.env.DB_PORT || "3306",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;
