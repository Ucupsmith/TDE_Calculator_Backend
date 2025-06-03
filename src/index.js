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
import { authRoutes } from './routes/authRoutes.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

//  Middleware for parsing JSON request body
app.use(express.json());
app.use(cors());

// --- Middleware Penanganan Error Umum --- //
app.use((err, req, res, next) => {
  console.error('Unhandled Backend Error:', err.stack); // Log error ke console backend
  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred on the server.'
    // Di lingkungan produksi, hindari mengirim detail error sensitif ke klien
    // Untuk debugging lokal, bisa disertakan: error: err.message
  });
});
// --- Akhir Middleware Penanganan Error Umum --- //

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
app.use('/user/v1/auth', authRoutes);

// Serve static files from the "public" directory
app.use(express.static('src/public'));

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
