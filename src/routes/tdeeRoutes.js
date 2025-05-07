import express from "express";
import { calculateTdee } from "../controllers/TdeeController.js";

const tdeeRoutes = express.Router();

tdeeRoutes.post("/", calculateTdee);

export { tdeeRoutes }; 