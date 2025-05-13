import express from "express";
import { calculateTdeeOnly, saveTdeeCalculationController, getTdeeHistory } from "../controllers/TdeeController.js";

const tdeeRoutes = express.Router();

tdeeRoutes.post("/calculate", calculateTdeeOnly);
tdeeRoutes.post("/", saveTdeeCalculationController);
tdeeRoutes.get("/history/:profileId", getTdeeHistory);

export { tdeeRoutes }; 