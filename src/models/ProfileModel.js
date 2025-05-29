import db from "../config/db.js";
import prisma from "../../prisma/prismaClient.js";

const validateProfileData = (data) => {
  const requiredFields = ['full_name', 'birth_place', 'birth_date', 'address', 'phone_number', 'email', 'gender'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate phone number format
  const phoneRegex = /^[0-9]{10,12}$/;
  if (!phoneRegex.test(data.phone_number)) {
    throw new Error('Invalid phone number format');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  // Validate birth date
  const birthDate = new Date(data.birth_date);
  if (isNaN(birthDate.getTime())) {
    throw new Error('Invalid birth date format');
  }
};

export const getProfile = async () => {
  return await prisma.profile.findMany({
    select: {
      userId: true,
    },
  });
};

export const getProfileByUserId = async (userId) => {
  try {
    const profile = await prisma.profile.findUnique({
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

    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile;
  } catch (error) {
    throw new Error(`Error fetching profile: ${error.message}`);
  }
};

export const createProfile = async (userId, profileData) => {
  try {
    validateProfileData(profileData);

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (existingProfile) {
      throw new Error('Profile already exists for this user');
    }

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
    validateProfileData(profileData);

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

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
