import express from "express";
import { sendNotification } from "../controllers/NotificationController.js";

const notificationRoutes = express.Router();

notificationRoutes.post("/send", sendNotification);

export { notificationRoutes }; 