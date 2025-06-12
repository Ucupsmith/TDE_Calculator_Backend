import {
  getUserById,
  createUser,
  getUserByEmail,
  getUser
} from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getMealHistoryForUser } from '../models/MealHistoryModel.js';

const JWT_SECRET = process.env.JWT_TOKEN;
const prisma = new PrismaClient();

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
  const { username, email, number_phone, password } = req.body;

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email Already Exist!' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await createUser(
      username,
      email,
      number_phone,
      hashedPassword
    );

    console.log(
      `User created successfully with ID: ${newUser.userId}. Attempting to create profile...`
    );

    // Create a corresponding profile for the new user
    try {
      const newProfile = await prisma.profile.create({
        data: {
          userId: newUser.userId,
          phone_number: req.body.number_phone,
          email: newUser.email,
          full_name: null,
          birth_date: null,
          birth_place: null,
          address: null,
          gender: null
        }
      });
      console.log(
        `Profile created successfully for user ID: ${newProfile.userId}`
      );
    } catch (profileError) {
      console.error(
        `Error creating profile for user ID ${newUser.userId}:`,
        profileError
      );
    }

    res.status(201).json({
      message: 'User Registered Successfully!',
      data: {
        id: newUser.userId,
        username: newUser.username,
        email: newUser.email,
        number_phone: newUser.number_phone
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
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        number_phone: user.number_phone
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return res.json({
      message: 'Logged in successfully',
      token,
      data: {
        id: user.userId,
        username: user.username,
        email: user.email,
        number_phone: user.number_phone
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getUserMealHistory = async (req, res) => {
  const { userId } = req.query;
  // In a real application, you'd likely get the userId from the authenticated user's token/session

  try {
    const history = await getMealHistoryForUser(parseInt(userId));
    res.status(200).json({
      message: 'Meal history retrieved successfully',
      data: history,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error fetching meal history' });
  }
};

export const oauthLoginRegister = async (req, res) => {
  const { email, username, googleId } = req.body;

  try {
    let user = await getUserByEmail(email);
    console.log(`User retrieved by email (${email}):`, user);

    if (user) {
      // User exists, check if it's a Google-linked account or needs linking
      if (user.googleId === null || user.googleId === undefined) {
        // Link existing account with Google ID
        user = await prisma.user.update({
          where: { userId: user.userId },
          data: { googleId: googleId },
        });
        console.log(`Linked existing user ${user.userId} with Google ID. Updated user:`, user);
      } else if (user.googleId !== googleId) {
        // Conflict: user with this email exists but has a different Google ID
        return res.status(409).json({ message: 'Email already registered with a different Google account or method.' });
      }
      // If user exists and googleId matches, proceed to login
    } else {
      // No existing user, create a new one
      console.log('Creating new user via Google OAuth...');
      user = await createUser(
        username,
        email,
        null, // Assuming number_phone is not provided by Google OAuth for now
        null, // Assuming password is not provided by Google OAuth
        googleId
      );
      if (!user) {
        console.error('createUser returned null or undefined.');
        return res.status(500).json({ message: 'Failed to create user.' });
      }
      console.log(`New user created with ID: ${user.userId} via Google OAuth. Created user:`, user);

      // Create a corresponding profile for the new user
      try {
        await prisma.profile.create({
          data: {
            userId: user.userId,
            email: user.email,
            full_name: user.username,
            phone_number: null,
            birth_date: null,
            birth_place: null,
            address: null,
            gender: null
          }
        });
        console.log(`Profile created successfully for user ID: ${user.userId}`);
      } catch (profileError) {
        console.error(
          `Error creating profile for new OAuth user ${user?.userId || 'unknown'}:`,
          profileError
        );
        return res.status(500).json({ message: 'Server Error creating profile during OAuth login/registration' });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.userId,
        email: user.email,
        username: user.username,
        number_phone: user.number_phone || null,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'OAuth login/registration successful',
      token,
      data: {
        id: user.userId,
        username: user.username,
        email: user.email,
        number_phone: user.number_phone || null,
      },
    });
  } catch (error) {
    console.error('OAuth login/registration server error:', error);
    return res.status(500).json({ message: 'Server Error during OAuth login/registration' });
  }
};
