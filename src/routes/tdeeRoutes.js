import express from 'express';
import {
  calculateTdeeOnly,
  saveTdeeCalculationController,
  getTdeeHistory,
  getLatestTdeeResultByProfile,
  saveTdeeToHomeController,
  getLastTdeeController,
  getTdeeHistoryForHome,
  deleteTdeeCalculationController,
  calculateTdeeMifflinStJeorOnly
} from '../controllers/TdeeController.js';
import { authenticateToken } from '../middleware/auth.js';

const tdeeRoutes = express.Router();

tdeeRoutes.post('/calculate', calculateTdeeOnly);
tdeeRoutes.post('/calculate-mifflin-st-jeor', calculateTdeeMifflinStJeorOnly);
tdeeRoutes.post('/save', authenticateToken, saveTdeeCalculationController);
tdeeRoutes.get('/history/:profileId', authenticateToken, getTdeeHistory);
tdeeRoutes.get('/result', authenticateToken, getLatestTdeeResultByProfile);
tdeeRoutes.post('/home/save', authenticateToken, saveTdeeToHomeController);
tdeeRoutes.get('/home/last', authenticateToken, getLastTdeeController);
tdeeRoutes.get('/home/history', authenticateToken, getTdeeHistoryForHome);
tdeeRoutes.delete('/history/:tdeeId', authenticateToken, deleteTdeeCalculationController);

export { tdeeRoutes };
