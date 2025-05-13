import express from "express";
import { sendNotification, createNotification, getNotifications } from "../controllers/NotificationController.js";

const notificationRoutes = express.Router();

notificationRoutes.post("/send", sendNotification);
notificationRoutes.post("/", createNotification);
notificationRoutes.get("/:profileId", getNotifications);

export { notificationRoutes }; 