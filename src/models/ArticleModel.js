import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all articles
export const getAllArticles = async () => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    return articles;
  } catch (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }
};

// Get article by ID
export const getArticleById = async (id) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    
    if (!article) {
      throw new Error("Article not found");
    }
    
    return article;
  } catch (error) {
    throw new Error(`Error fetching article: ${error.message}`);
  }
};

// Create a new article
export const createArticle = async (title, content, image_path, author_id, category) => {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        imagePath: image_path,
        authorId: author_id,
        category
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    
    return newArticle;
  } catch (error) {
    throw new Error(`Error creating article: ${error.message}`);
  }
};

// Update an article
export const updateArticle = async (id, title, content, image_path, category) => {
  try {
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        imagePath: image_path,
        category
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true
          }
        }
      }
    });
    
    return updatedArticle;
  } catch (error) {
    throw new Error(`Error updating article: ${error.message}`);
  }
};

// Delete an article
export const deleteArticle = async (id) => {
  try {
    await prisma.article.delete({
      where: { id }
    });
    
    return { message: "Article deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting article: ${error.message}`);
  }
};

// Get user by ID
export const getUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}; 