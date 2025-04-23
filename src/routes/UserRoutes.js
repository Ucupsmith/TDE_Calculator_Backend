import express from "express";
import { getUser, registerUser } from "../controllers/UserController.js";

const userRoutes = express.Router();

userRoutes.get("/:id", getUser);
userRoutes.post("/", registerUser);

export { userRoutes };
