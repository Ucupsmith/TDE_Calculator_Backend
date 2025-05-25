import express from "express";
import {
  getMealPlan,
  getUserMealPlans,
  createUserMealPlan,
  updateUserMealPlan,
  deleteUserMealPlan,
  getAllMenus,
  getUserMealSelections,
  addMealSelection,
  removeMealSelection,
  addMenuByAdmin,
  updateMenuByAdmin,
  deleteMenuByAdmin
} from '../controllers/MealPlanController.js';
import { validateTdeeCalculation } from "../middleware/tdeeValidation.js";

const mealPlanRoutes = express.Router();

// Apply TDEE validation middleware to all meal plan routes except admin routes
mealPlanRoutes.use((req, res, next) => {
  // Skip validation for admin routes
  if (req.path.startsWith('/menus')) {
    return next();
  }
  validateTdeeCalculation(req, res, next);
});

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

// Get all menus
mealPlanRoutes.get('/menus', getAllMenus);

// Get user's meal selections for today
mealPlanRoutes.get('/selections/:userId/:tdeeId', getUserMealSelections);

// Add meal selection
mealPlanRoutes.post('/selections', addMealSelection);

// Remove meal selection
mealPlanRoutes.delete('/selections/:selectionId', removeMealSelection);

// Add menu by admin
mealPlanRoutes.post('/menus', addMenuByAdmin);

// Update menu by admin
mealPlanRoutes.put('/menus/:menuId', updateMenuByAdmin);

// Delete menu by admin
mealPlanRoutes.delete('/menus/:menuId', deleteMenuByAdmin);

export { mealPlanRoutes };
