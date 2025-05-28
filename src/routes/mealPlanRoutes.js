import express from 'express';
const router = express.Router();
import { 
  createMealSelection, 
  getMealSelections, 
  getLatestSelection, 
  getCurrentDayCaloriesController,
  getMealPlanHistory,
  updateMealSelection
} from '../controllers/UserMealSelectionController.js';

// Create meal plan
router.post('/selections', createMealSelection);

// Get all meal plans
router.get('/', getMealSelections);

// Get latest meal plan
router.get('/latest', getLatestSelection);

// Get current day calories
router.get('/current-day', getCurrentDayCaloriesController);

// Get meal plan history
router.get('/history', getMealPlanHistory);

// Update meal selection
router.put('/selections/:id', updateMealSelection);

export default router; 