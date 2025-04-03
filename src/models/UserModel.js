import db from "../config/db.js";

export const getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM User WHERE user_id = ?", [id]);
  return rows[0];
};

export const createUser = async (username, password, email) => {
  const [result] = await db.query(
    `INSERT INTO Users (username, password, email) VALUES (?, ?, ?)`,
    [username, password, email]
  );
  return result.insertId;
};
