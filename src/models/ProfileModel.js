import db from '../config/db.js';
import prisma from '../../prisma/prismaClient.js';

const validateProfileData = (data) => {
  // Check for missing fields only if they are expected for a specific operation (like create)
  // For PATCH, we only validate fields that are provided

  // Validate phone number format if provided
  if (data.phone_number !== undefined) {
    const phoneRegex = /^[0-9]{10,12}$/;
    if (!phoneRegex.test(data.phone_number)) {
      throw new Error('Invalid phone number format');
    }
  }

  // Validate email format if provided
  if (data.email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }
  }

  // Validate birth date format if provided
  if (data.birth_date !== undefined) {
    const birthDate = new Date(data.birth_date);
    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid birth date format');
    }
  }
};

export const getProfile = async () => {
  return await prisma.profile.findMany({
    select: {
      userId: true
    }
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
    console.log('updateProfile received userId:', userId);
    // No need to call validateProfileData here for PATCH, validation should be per-field if needed

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: parseInt(userId) }
    });

    if (!existingProfile) {
      throw new Error('Profile not found');
    }

    // Build the data object for Prisma update, including only provided fields
    const dataToUpdate = {};
    if (profileData.full_name !== undefined)
      dataToUpdate.full_name = profileData.full_name;
    if (profileData.gender !== undefined)
      dataToUpdate.gender = profileData.gender;
    if (profileData.address !== undefined)
      dataToUpdate.address = profileData.address;
    // Add other fields here if they were intended to be updatable and sent from frontend
    // For example:
    // if (profileData.birth_place !== undefined) dataToUpdate.birth_place = profileData.birth_place;
    // if (profileData.birth_date !== undefined) dataToUpdate.birth_date = new Date(profileData.birth_date);
    // if (profileData.phone_number !== undefined) dataToUpdate.phone_number = profileData.phone_number;
    // if (profileData.email !== undefined) dataToUpdate.email = profileData.email;
    // if (profileData.avatar !== undefined) dataToUpdate.avatar = profileData.avatar;

    // Ensure there is at least one field to update
    if (Object.keys(dataToUpdate).length === 0) {
      console.warn('No fields provided for profile update for userId:', userId);
      // Optionally return the existing profile data if nothing was updated
      const currentProfile = await prisma.profile.findUnique({
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
      return currentProfile; // Return existing data if nothing to update
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId: parseInt(userId) },
      data: dataToUpdate, // Gunakan objek dataToUpdate yang sudah difilter
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
    // Handle potential Prisma validation errors more specifically if needed
    if (error.code === 'P2002') {
      // Example: Handle unique constraint violation
      console.error(
        'Prisma error (P2002): Unique constraint failed',
        error.message
      );
      throw new Error('Duplicate entry for a unique field.');
    }
    console.error('Error in updateProfile model:', error);
    throw new Error(`Error updating profile: ${error.message}`);
  }
};
