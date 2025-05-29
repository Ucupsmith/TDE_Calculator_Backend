import express from 'express';
import {
  calculateTdeeOnly,
  saveTdeeCalculationController,
  getTdeeHistory,
  getLatestTdeeResultByProfile,
  saveTdeeToHomeController,
  getLastTdeeController
} from '../controllers/TdeeController.js';

const tdeeRoutes = express.Router();

tdeeRoutes.post('/calculate', calculateTdeeOnly);
tdeeRoutes.post('/save', saveTdeeCalculationController);
tdeeRoutes.get('/history/:profileId', getTdeeHistory);
tdeeRoutes.get('/result', getLatestTdeeResultByProfile);
tdeeRoutes.post('/home/save', saveTdeeToHomeController);
tdeeRoutes.get('/home/last', getLastTdeeController);

export { tdeeRoutes };
