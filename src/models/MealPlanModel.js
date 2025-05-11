import db from "../config/db.js";
import { PrismaClient } from "@prisma/client";

export const getMealPlanById = async (mealPlanId) => {
  const [rows] = await db.query(
    "SELECT * FROM meal_plans WHERE meal_plan_id = ?",
    [mealPlanId]
  );
  return rows[0];
};

export const getMealPlansByUserId = async (userId) => {
  const [rows] = await db.query("SELECT * FROM meal_plans WHERE user_id = ?", [
    userId,
  ]);
  return rows;
};

export const createMealPlan = async (userId, adminId, goal, mealDetails) => {
  const [result] = await db.query(
    `INSERT INTO meal_plans (user_id, admin_id, goal, meal_details) VALUES (?, ?, ?, ?)`,
    [userId, adminId, goal, mealDetails]
  );
  return result.insertId;
};

export const updateMealPlan = async (mealPlanId, goal, mealDetails) => {
  const [result] = await db.query(
    `UPDATE meal_plans SET goal = ?, meal_details = ? WHERE meal_plan_id = ?`,
    [goal, mealDetails, mealPlanId]
  );
  return result.affectedRows > 0;
};

export const deleteMealPlan = async (mealPlanId) => {
  const [result] = await db.query(
    `DELETE FROM meal_plans WHERE meal_plan_id = ?`,
    [mealPlanId]
  );
  return result.affectedRows > 0;
};
