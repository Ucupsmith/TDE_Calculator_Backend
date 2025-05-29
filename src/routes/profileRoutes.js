import express from "express";
import {
  getProfile,
  createuserProfile,
  updatedProfile
} from "../controllers/ProfileController.js";
import { authenticateToken } from "../middleware/auth.js";

const profileRoutes = express.Router();

// All profile routes require authentication
profileRoutes.use(authenticateToken);

// Get user's own profile
profileRoutes.get("/", getProfile);

// Create new profile
profileRoutes.post("/", createuserProfile);

// Update profile
profileRoutes.put("/", updatedProfile);

export { profileRoutes };
