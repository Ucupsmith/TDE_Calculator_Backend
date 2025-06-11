import express from "express";
import {
  createArticleHandler,
  getAllArticlesHandler,
  getArticleByIdHandler,
  updateArticleHandler,
  deleteArticleHandler,
  upload
} from "../controllers/ArticleController.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllArticles, getArticleById, getArticlesByCategory } from '../public/articles/articles.js';

const articleRoutes = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a new article with image upload
articleRoutes.post("/", upload.single("image"), createArticleHandler);

// Get all articles
articleRoutes.get("/", getAllArticlesHandler);

// Get article by ID
articleRoutes.get("/:id", getArticleByIdHandler);

// Get articles by category
articleRoutes.get("/category/:category", (req, res) => {
  try {
    const categoryArticles = getArticlesByCategory(req.params.category);
    res.json(categoryArticles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles by category', error: error.message });
  }
});

// Serve article TSX file
articleRoutes.get("/view/:id", (req, res) => {
  const articleId = req.params.id;
  res.sendFile(path.join(__dirname, `../public/article/${articleId}.tsx`));
});

// Update article with optional image upload
articleRoutes.put("/:id", upload.single("image"), updateArticleHandler);

// Delete article
articleRoutes.delete("/:id", deleteArticleHandler);

// Get related articles
articleRoutes.get('/:id/related', (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    const related = (article.related_ids || []).map(id => getArticleById(id)).filter(Boolean);
    res.json(related);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching related articles', error: error.message });
  }
});

// Increment views
articleRoutes.post('/:id/views', (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    article.views = (article.views || 0) + 1;
    res.json({ views: article.views });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing views', error: error.message });
  }
});

// Toggle like (for demo, just increment)
articleRoutes.post('/:id/like', (req, res) => {
  try {
    const article = getArticleById(req.params.id);
    if (!article) return res.status(404).json({ message: 'Article not found' });
    article.likes = (article.likes || 0) + 1;
    res.json({ likes: article.likes });
  } catch (error) {
    res.status(500).json({ message: 'Error liking article', error: error.message });
  }
});

export { articleRoutes }; 