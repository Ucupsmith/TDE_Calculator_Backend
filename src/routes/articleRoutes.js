import express from "express";
import {
  createArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
  updateArticleHandler,
  deleteArticleHandler,
  upload
} from "../controllers/ArticleController.js";

const articleRoutes = express.Router();

// Create a new article with image upload
articleRoutes.post("/", upload.single("image"), createArticleHandler);

// Get all articles
articleRoutes.get("/", getAllArticlesHandler);

// Get article by ID
articleRoutes.get("/:id", getArticleByIdHandler);

// Update article with optional image upload
articleRoutes.put("/:id", upload.single("image"), updateArticleHandler);

// Delete article
articleRoutes.delete("/:id", deleteArticleHandler);

export { articleRoutes }; 