import express from 'express';
import {
  getAllFoodsController,
  getFoodByNameController,
  calculateTotalCaloriesController,
  calculateRemainingCaloriesController,
  getMealPlanFoodsController,
  addCustomFoodController,
  getUserCustomFoodsController,
  deleteUserCustomFoodController,
  updateUserCustomFoodController
} from '../controllers/FoodController.js';

const router = express.Router();

// Get all available foods
router.get('/', getAllFoodsController);

// Get food by name
router.get('/:name', getFoodByNameController);

// Get available foods for meal plan
router.get('/meal-plan/foods', getMealPlanFoodsController);

// Get user's custom foods
router.get('/custom/user', getUserCustomFoodsController);

// Add custom food
router.post('/custom', addCustomFoodController);

// Calculate total calories
router.post('/calculate-total-calories', calculateTotalCaloriesController);

// Calculate remaining calories based on TDEE and selected foods
router.post(
  '/calculate-remaining-calories',
  calculateRemainingCaloriesController
);

// Delete user's custom food
router.delete('/custom', deleteUserCustomFoodController);

// Update user's custom food
router.put('/custom', updateUserCustomFoodController);

export default router;
