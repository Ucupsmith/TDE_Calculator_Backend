import db from "../config/db.js";

export const getProfileByUserId = async (userId) => {
  const [rows] = await db.query("SELECT * FROM Profile WHERE user_id = ?", [
    userId,
  ]);
  return rows[0];
};

export const createProfile = async (
  userId,
  gender,
  weight,
  height,
  activityLevel
) => {
  const [rows] = await db.query(
    `INSERT INTO Profiles (user_id, gender, weight, height, activity_level) VALUES (?, ?, ?, ?, ?)`,
    [userId, gender, weight, height, activityLevel]
  );
  return rows.insertId;
};
