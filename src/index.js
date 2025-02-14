import express from "express";
import * as path from "path";

const app = express();
const PORT = process.env.DATABASE || 3000;

app.use("/", () => {});

app.listen(PORT, () => {
    console.log("server is running!", PORT);
});
