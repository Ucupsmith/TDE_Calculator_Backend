import express from 'express';
import {
  registerUser,
  login,
  getUsers,
  getUserId,
  oauthLoginRegister
} from '../controllers/UserController.js';

const userRoutes = express.Router();
userRoutes.get('/', getUsers);
userRoutes.get('/:userId', getUserId);
userRoutes.post('/register', registerUser);
userRoutes.post('/login', login);
userRoutes.post('/oauth-login-register', oauthLoginRegister);

export { userRoutes };
