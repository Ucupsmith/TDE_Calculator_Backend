import express from 'express';
import {
  calculateTdeeOnly,
  saveTdeeCalculationController,
  getTdeeHistory,
  getLatestTdeeResultByProfile
} from '../controllers/TdeeController.js';
import {
  getLastTdeeController,
  saveTdeeToHomeController
} from '../models/TdeeModel.js';

const tdeeRoutes = express.Router();

tdeeRoutes.post('/calculate', calculateTdeeOnly);
tdeeRoutes.post('/save', saveTdeeCalculationController);
tdeeRoutes.get('/history/:profileId', getTdeeHistory);
tdeeRoutes.get('/result', getLatestTdeeResultByProfile);
tdeeRoutes.post('/home/save', saveTdeeToHomeController);
tdeeRoutes.get('/home/last', getLastTdeeController);

export { tdeeRoutes };
