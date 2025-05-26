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
  hashedPassword
) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      number_phone,
      password: hashedPassword
    }
  });
};

export const getUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: email
  });
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
