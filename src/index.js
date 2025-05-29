import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userRoutes } from './routes/UserRoutes.js';
import { profileRoutes } from './routes/profileRoutes.js';
import { tdeeRoutes } from './routes/tdeeRoutes.js';
import { notificationRoutes } from './routes/notificationRoutes.js';
import { articleRoutes } from './routes/articleRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//  Middleware for parsing JSON request body
app.use(express.json());
app.use(cors());

// Root route
app.get('/', (req, res) => {
  res.status(200).send('welcome to TDEE calculator API');
});

// API routes
app.use('/user/v1/users', userRoutes);
app.use('/user/v1/profiles', profileRoutes);
app.use('/user/v1/articles', articleRoutes);
app.use('/user/v1/tdee', tdeeRoutes);
app.use('/user/v1/notifications', notificationRoutes);
app.use('/user/v1/foods', foodRoutes);
app.use('/user/v1/meal-plans', mealPlanRoutes);


// Serve static files from the "public" directory
app.use(express.static('src/public'));

// Error handler middleware (should come after routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!' 
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
