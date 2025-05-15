import express from "express";
import { checkoutMealPlan, confirmPayment, getPayment } from "../controllers/PaymentController.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/checkout", checkoutMealPlan);
paymentRoutes.post("/confirm", confirmPayment);
paymentRoutes.get("/:payment_id", getPayment);

export { paymentRoutes }; 