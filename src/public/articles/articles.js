// Sample article data
const articles = [
  {
    id: '1',
    title: 'Understanding TDEE: Total Daily Energy Expenditure',
    content: 'Learn about how your body burns calories and how to calculate your TDEE.',
    category: 'nutrition',
    views: 0,
    likes: 0,
    related_ids: ['2', '3']
  },
  {
    id: '2',
    title: 'How to Track Your Calories Effectively',
    content: 'A comprehensive guide to tracking your daily caloric intake.',
    category: 'nutrition',
    views: 0,
    likes: 0,
    related_ids: ['1', '3']
  },
  {
    id: '3',
    title: 'The Role of Exercise in Weight Management',
    content: 'Understanding how exercise affects your weight loss journey.',
    category: 'fitness',
    views: 0,
    likes: 0,
    related_ids: ['1', '2']
  }
];

// Get all articles
export const getAllArticles = () => {
  return articles;
};

// Get article by ID
export const getArticleById = (id) => {
  return articles.find(article => article.id === id);
};

// Get articles by category
export const getArticlesByCategory = (category) => {
  return articles.filter(article => article.category === category);
}; 