import express from "express";
import {
  createMealPlan,
  getUserMealPlans,
  getMealPlan,
  updateUserMealPlan,
  deleteUserMealPlan,
} from "../controllers/MealPlanController.js";

const mealPlanRoutes = express.Router();

// Create a new meal plan
mealPlanRoutes.post("/", createMealPlan);

// Get all meal plans for a specific user
mealPlanRoutes.get("/user/:userId", getUserMealPlans);

// Get a specific meal plan by ID
mealPlanRoutes.get("/:id", getMealPlan);

// Update meal plan with selected food
mealPlanRoutes.put("/:id", updateUserMealPlan);

// Delete a meal plan
mealPlanRoutes.delete("/:id", deleteUserMealPlan);

export { mealPlanRoutes };
