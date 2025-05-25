import express from 'express';
import {
  getAllFoodsController,
  getFoodByNameController,
  calculateTotalCaloriesController,
  calculateRemainingCaloriesController
} from '../controllers/FoodController.js';

const router = express.Router();

// Get all available foods
router.get('/foods', getAllFoodsController);

// Get food by name
router.get('/foods/:name', getFoodByNameController);

// Calculate total calories for selected foods
router.post('/calculate-total-calories', calculateTotalCaloriesController);

// Calculate remaining calories based on TDEE and selected foods
router.post('/calculate-remaining-calories', calculateRemainingCaloriesController);

export default router; 