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
  return await prisma.profile.findUnique({
    where: { profileId: userId },
  });
};

export const createProfile = async (
  userId,
  gender,
  weight,
  height,
  activityLevel
) => {
  return await prisma.profile.create({
    data: {
      userId,
      gender,
      weight,
      height,
      activityLevel,
    },
  });
};

export const updateProfile = async (userId, profileData) => {
  try {
    const updatedProfile = await prisma.profile.update({
      where: { userId: userId },
      data: {
        full_name: profileData.full_name,
        birth_place: profileData.birth_place,
        birth_date: profileData.birth_date,
        address: profileData.address,
        phone_number: profileData.phone_number,
        email: profileData.email,
        gender: profileData.gender,
        avatar: profileData.avatar,
      },
    });
    return updatedProfile();
  } catch (error) {
    throw error;
  }
};
