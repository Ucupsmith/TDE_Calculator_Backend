import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get all articles with pagination
export const getAllArticles = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        where: { status: "Published" },
        include: {
          author: {
            select: {
              adminId: true,
              admin_name: true,
              email: true
            }
          }
        }
      }),
      prisma.article.count({ where: { status: "Published" } })
    ]);

    return { articles, total };
  } catch (error) {
    throw new Error(`Error fetching articles: ${error.message}`);
  }
};

// Get article by ID
export const getArticleById = async (id) => {
  try {
    const article = await prisma.article.findUnique({
      where: { article_id: parseInt(id) },
      include: {
        author: {
          select: {
            adminId: true,
            admin_name: true,
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
        image_path,
        author_id: parseInt(author_id),
        category,
        status: 'Published',
        views: 0,
        likes: 0
      },
      include: {
        author: {
          select: {
            adminId: true,
            admin_name: true,
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
      where: { article_id: parseInt(id) },
      data: {
        title,
        content,
        image_path,
        category
      },
      include: {
        author: {
          select: {
            adminId: true,
            admin_name: true,
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
      where: { article_id: parseInt(id) }
    });
    
    return { message: "Article deleted successfully" };
  } catch (error) {
    throw new Error(`Error deleting article: ${error.message}`);
  }
};

// Get admin by ID
export const getUserById = async (id) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { adminId: parseInt(id) }
    });
    
    if (!admin) {
      throw new Error("Admin not found");
    }
    
    return admin;
  } catch (error) {
    throw new Error(`Error fetching admin: ${error.message}`);
  }
}; 