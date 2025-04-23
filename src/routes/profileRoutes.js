import express from "express";
import {
  getProfile,
  createuserProfile,
} from "../controllers/ProfileController.js";

const profileRoutes = express.Router();

profileRoutes.get("/:id", getProfile);
profileRoutes.post("/", createuserProfile);

export { profileRoutes };
