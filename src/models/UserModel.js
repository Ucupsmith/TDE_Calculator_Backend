import db from '../config/db.js';
import prisma from '../../prisma/prismaClient.js';

export const getUser = async () => {
  return await prisma.user.findMany({
    select: {
      userId: true,
      username: true,
      email: true
    }
  });
};

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { userId: id },
    select: {
      userId: true
    }
  });
};

export const createUser = async (
  username,
  email,
  number_phone,
  hashedPassword,
  googleId = null
) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      number_phone,
      password: hashedPassword,
      googleId,
    }
  });
};

export const getUserByEmail = async (email) => {
  try {
    // log email yang dicari
    console.log('Mencari user dengan email:', email);
    return await prisma.user.findFirst({
      where: { email }
    });
    // ...query ke database
  } catch (err) {
    console.error('Error in getUserByEmail:', err);
    throw err; // biar error-nya naik ke controller
  }
};

export const updateUser = async (newUsername, newEmail, newPassword) => {
  return await prisma.user.updateMany({
    data: {
      username: newUsername,
      email: newEmail,
      password: newPassword
    }
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { userId: id }
  });
};
