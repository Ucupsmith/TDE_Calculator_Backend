import express from "express";
import * as path from "path";
import dotenv from "dotenv";
import { userRoutes } from "./routes/UserRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";
import { mealPlanRoutes } from "./routes/mealPlanRoutes.js";
import { tdeeRoutes } from "./routes/tdeeRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";
<<<<<<< Updated upstream
import { paymentRoutes } from "./routes/paymentRoutes.js";
=======
import { articleRoutes } from "./routes/articleRoutes.js";
>>>>>>> Stashed changes

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON request body
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).send("welcome to TDEE calculator API");
});

// API routes
app.use("/user/v1/users", userRoutes);
app.use("/user/v1/profiles", profileRoutes);
app.use("/user/v1/meal-plans", mealPlanRoutes);
app.use("/user/v1/articles", articleRoutes);
app.use("/user/v1/tdee", tdeeRoutes);
app.use("/user/v1/notifications", notificationRoutes);
app.use("/user/v1/payments", paymentRoutes);

// Error handler middleware (should come after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke! Please Try Again Later! ");
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});


