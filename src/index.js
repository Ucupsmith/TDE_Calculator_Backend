import express from "express";
import * as path from "path";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes.js";
import { profileRoutes } from "./routes/profileRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 80;
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.use("/", (req, res) => {
  res.status(200).send("welcome to TDEE calculator API");
});
app.use("user/v1/users", userRoutes);
app.use("user/v1/profiles", profileRoutes);
app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
