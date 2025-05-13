import multer from "multer";
import path from "path";
import fs from "fs";
import { 
  getAllArticles, 
  getArticleById, 
  createArticle, 
  updateArticle, 
  deleteArticle,
  getUserById
} from "../models/ArticleModel.mjs";

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "uploads", "articles");
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Create a new article
export const createArticleHandler = async (req, res) => {
  try {
    const { title, content, author_id, category } = req.body;
    
    // Handle image path
    let image_path = null;
    if (req.file) {
      // Store relative path in database
      image_path = `/uploads/articles/${req.file.filename}`;
    }

    // Check if author exists
    try {
      await getUserById(author_id);
    } catch (error) {
      return res.status(400).json({ message: "Invalid author ID" });
    }

    const result = await createArticle(
      title, 
      content, 
      image_path, 
      author_id, 
      category
    );

    res.status(201).json({
      message: "Article created successfully",
      article: result
    });
  } catch (error) {
    console.error("Error creating article:", error);
    res.status(500).json({ message: "Error creating article", error: error.message });
  }
};

// Get all articles
export const getAllArticlesHandler = async (req, res) => {
  try {
    const articles = await getAllArticles();
    
    // Get author information for each article
    const articlesWithAuthors = await Promise.all(
      articles.map(async (article) => {
        try {
          const author = await getUserById(article.author_id);
          return {
            ...article,
            author_name: author.username
          };
        } catch (error) {
          return {
            ...article,
            author_name: "Unknown"
          };
        }
      })
    );
    
    res.json(articlesWithAuthors);
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Error fetching articles", error: error.message });
  }
};

// Get article by ID
export const getArticleByIdHandler = async (req, res) => {
  try {
    const article = await getArticleById(req.params.id);
    
    // Get author information
    try {
      const author = await getUserById(article.author_id);
      article.author_name = author.username;
    } catch (error) {
      article.author_name = "Unknown";
    }
    
    res.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    res.status(404).json({ message: "Article not found", error: error.message });
  }
};

// Update article
export const updateArticleHandler = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const articleId = req.params.id;
    
    let image_path = null;
    
    // If new image is uploaded, use its path
    if (req.file) {
      // Store relative path in database
      image_path = `/uploads/articles/${req.file.filename}`;
      
      // Get the old article to delete the old image if it exists
      try {
        const oldArticle = await getArticleById(articleId);
        if (oldArticle.image_path) {
          const oldImagePath = path.join(process.cwd(), oldArticle.image_path);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Continue with update even if old image deletion fails
      }
    }
    
    const updatedArticle = await updateArticle(
      articleId, 
      title, 
      content, 
      image_path, 
      category
    );
    
    res.json({ 
      message: "Article updated successfully",
      article: updatedArticle
    });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Error updating article", error: error.message });
  }
};

// Delete article
export const deleteArticleHandler = async (req, res) => {
  try {
    const articleId = req.params.id;
    
    // Get article to check if it exists and get image path
    const article = await getArticleById(articleId);
    
    // Delete image file if exists
    if (article.image_path) {
      const imagePath = path.join(process.cwd(), article.image_path);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await deleteArticle(articleId);
    
    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Error deleting article", error: error.message });
  }
};

