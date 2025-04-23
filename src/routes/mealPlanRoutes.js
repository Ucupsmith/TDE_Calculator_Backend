import express from "express";
import {
  getMealPlan,
  getUserMealPlans,
  createUserMealPlan,
  updateUserMealPlan,
  deleteUserMealPlan,
} from "../controllers/MealPlanController.js";

const mealPlanRoutes = express.Router();

// Get all meal plans for a specific user
mealPlanRoutes.get("/user/:userId", getUserMealPlans);

// Get a specific meal plan by ID
mealPlanRoutes.get("/:id", getMealPlan);

// Create a new meal plan
mealPlanRoutes.post("/", createUserMealPlan);

// Update an existing meal plan
mealPlanRoutes.put("/:id", updateUserMealPlan);

// Delete a meal plan
mealPlanRoutes.delete("/:id", deleteUserMealPlan);

export { mealPlanRoutes };
