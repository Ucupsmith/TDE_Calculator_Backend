import express from "express";
import { getUser, registerUser } from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.get("/:id", getUser);
userRoutes.get("/", registerUser);

export { userRoutes };
