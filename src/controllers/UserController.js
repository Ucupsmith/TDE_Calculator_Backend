import {
  getUserById,
  createUser,
  getUserByEmail,
  getUser
} from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_TOKEN;

export const getUsers = async (req, res) => {
  try {
    const users = await getUser();
    res.status(201).json({
      message: 'Successfully Retrived',
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Error Get Users' });
  }
};

export const getUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await getUserById(parseInt(userId));
    if (!user) {
      return res.status(404).json({ message: 'User Not Found!' });
    }
    res.status(201).json({
      message: 'Successfully Retrived',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user' });
  }
};

export const registerUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email Already Exist!' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await createUser(username, hashedPassword, email);
    res.status(201).json({
      message: 'User Registered Successfully!',
      data: {
        id: newUser.userId,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({
      message: 'Logged in successfully',
      token,
      data: {
        id: user.userId,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
