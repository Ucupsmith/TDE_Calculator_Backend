import express from "express";
import { requestPasswordReset, resetPassword } from "../controllers/AuthController.js";

const authRoutes = express.Router();

// Endpoint untuk meminta reset password
authRoutes.post("/request-password-reset", requestPasswordReset);

// Endpoint untuk melakukan reset password
authRoutes.post("/reset-password", resetPassword);

// Endpoints for authentication will go here

export { authRoutes }; 