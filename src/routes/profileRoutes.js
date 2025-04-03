import express from "express";
import {
  getProfile,
  createuserProfile,
} from "../controllers/profileController.js";

const profileRoutes = express.Router();

profileRoutes.get("/:id", getProfile);
profileRoutes.get("/", createuserProfile);

export { profileRoutes };
