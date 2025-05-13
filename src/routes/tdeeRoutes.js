import express from "express";
import { calculateTdee, getTdeeHistory } from "../controllers/TdeeController.js";

const tdeeRoutes = express.Router();

tdeeRoutes.post("/", calculateTdee);
tdeeRoutes.get("/history/:profileId", getTdeeHistory);

export { tdeeRoutes }; 