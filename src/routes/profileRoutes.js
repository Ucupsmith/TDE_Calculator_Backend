import express from "express";
import {
  getProfile,
  createuserProfile,
} from "../controllers/profileController";

const profileRoutes = express.Router();

profileRoutes.get("/:id", getProfile);
profileRoutes.get("/", createuserProfile);

export { profileRoutes };
