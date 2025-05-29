import db from "../config/db.js";
import prisma from "../../prisma/prismaClient.js";

export const getProfile = async () => {
  return await prisma.profile.findMany({
    select: {
      userId: true,
    },
  });
};

export const getProfileByUserId = async (userId) => {
  try {
    return await prisma.profile.findUnique({
      where: { userId: parseInt(userId) },
      include: {
        user: {
          select: {
            email: true,
            number_phone: true
          }
        }
      }
    });
  } catch (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
};

export const createProfile = async (userId, profileData) => {
  try {
    return await prisma.profile.create({
      data: {
        userId: parseInt(userId),
        full_name: profileData.full_name,
        birth_place: profileData.birth_place,
        birth_date: new Date(profileData.birth_date),
        address: profileData.address,
        phone_number: profileData.phone_number,
        email: profileData.email,
        gender: profileData.gender,
        avatar: profileData.avatar
      }
    });
  } catch (error) {
    throw new Error(`Error creating profile: ${error.message}`);
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId: parseInt(userId) },
      data: {
        full_name: profileData.full_name,
        birth_place: profileData.birth_place,
        birth_date: new Date(profileData.birth_date),
        address: profileData.address,
        phone_number: profileData.phone_number,
        email: profileData.email,
        gender: profileData.gender,
        avatar: profileData.avatar
      },
      include: {
        user: {
          select: {
            email: true,
            number_phone: true
          }
        }
      }
    });
    return updatedProfile;
  } catch (error) {
    throw new Error(`Error updating profile: ${error.message}`);
  }
};
