import express from 'express';
const router = express.Router();
import {
  createMealSelection,
  getMealSelections,
  getLatestSelection,
  getCurrentDayCaloriesController,
  getMealPlanHistory,
  updateMealSelection,
  getMealPlanSummary,
  getMealPlanByTdeeId,
  getMealPlanFoods
} from '../controllers/UserMealSelectionController.js';

// Create meal plan (modified to save daily history)
// Old route was router.post('/selections', createMealSelection);
router.post('/history', createMealSelection);

// Get all meal plans (might need adjustment to query DailyMealHistory)
router.get('/', getMealSelections);

// Get latest meal plan (might need adjustment)
router.get('/latest', getLatestSelection);

// Get current day calories (might need adjustment)
router.get('/current-day', getCurrentDayCaloriesController);

// Get meal plan history (already points to /history, will need controller logic update)
router.get('/history', getMealPlanHistory);

// Update meal selection (might need adjustment to update DailyMealHistory/DailyMealFoodEntry)
router.put('/history/:id', updateMealSelection); // Changed from /selections/:id

// Get meal plan summary (might need adjustment)
router.get('/summary', getMealPlanSummary);

router.get('/summary/', getMealPlanByTdeeId);

// Add food to today's meal plan
// router.post('/add-meal', createMealSelection);

// Get available foods for meal plan
router.get('/foods', getMealPlanFoods);

export default router;
