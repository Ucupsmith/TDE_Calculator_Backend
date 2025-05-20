import express from "express";
import { calculateTdeeOnly, saveTdeeCalculationController, getTdeeHistory, getLatestTdeeResultByProfile } from "../controllers/TdeeController.js";

const tdeeRoutes = express.Router();

tdeeRoutes.post("/calculate", calculateTdeeOnly);
tdeeRoutes.post("/", saveTdeeCalculationController);
tdeeRoutes.get("/history/:profileId", getTdeeHistory);
tdeeRoutes.get("/result", getLatestTdeeResultByProfile);

export { tdeeRoutes }; 