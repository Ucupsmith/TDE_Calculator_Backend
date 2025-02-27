import express from "express";
import * as path from "path";
import dotenv from "dotenv";
import db from "./models/tdee_calculator.db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/", (req, res) => {
  res.status(200).send("welcome to TDEE calculator API");
});

app.use("/user", (req, res) => {
  res.status(200).send("welcome to TDEE calculator si user API");
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
