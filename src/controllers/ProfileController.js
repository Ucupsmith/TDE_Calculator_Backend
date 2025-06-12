import {
  getProfileByUserId,
  createProfile,
  updateProfile
} from '../models/ProfileModel.js';
import prisma from '../../prisma/prismaClient.js';

// src/controllers/ProfileController.js

const getProfile = async (req, res) => {
  const userId = req.user.id;
  console.log('Fetching profile for userId:', userId);

  try {
    let profile = await getProfileByUserId(userId); // Coba fetch profile

    // Jika profile ditemukan, langsung kirim response
    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    // === TANGKAP ERROR SPESIFIK "Profile not found" DI SINI ===
    if (
      error.message === 'Error fetching profile: Profile not found' ||
      error.message.includes('not found')
    ) {
      // Cek pesan error
      console.log(
        `No profile found for userId ${userId}, creating default profile...`
      );
      try {
        // === PINDAHKAN LOGIKA CREATE PROFILE KE DALAM BLOK INI ===
        const newProfile = await prisma.profile.create({
          data: {
            userId: userId,
            email: req.user.email,
            phone_number: req.user.number_phone || '',
            full_name: null,
            birth_date: null,
            birth_place: null,
            address: null,
            gender: null
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
        console.log(
          `Default profile created successfully for user ID: ${userId}`
        );
        res.status(201).json({
          // Kembalikan status 201 Created untuk profile baru
          status: 'success',
          data: newProfile
        });
        // === SAMPAI SINI ===
      } catch (createError) {
        // Tangkap error jika pembuatan profile default GAGAL
        console.error(
          'Error creating default profile for userId:',
          userId,
          JSON.stringify(createError, null, 2) // Log entire error object
        );
        res.status(500).json({
          status: 'error',
          message: 'Error creating default profile', // Pesan lebih spesifik
          error: createError.message
        });
      }
    } else {
      // === TANGKAP ERROR LAIN (BUKAN "NOT FOUND") DI SINI ===
      console.error('Error in getProfile controller (other error):', error);
      res.status(500).json({
        status: 'error',
        message: 'Error retrieving profile', // Pesan umum
        error: error.message
      });
    }
  }
};

const createuserProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // Assuming you have authentication middleware
    const profileData = {
      full_name: req.body.full_name,
      birth_place: req.body.birth_place,
      birth_date: req.body.birth_date,
      address: req.body.address,
      phone_number: req.body.phone_number,
      email: req.body.email,
      gender: req.body.gender,
      avatar: req.body.avatar
    };

    const profile = await createProfile(userId, profileData);

    res.status(201).json({
      status: 'success',
      message: 'Profile created successfully',
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message || 'Error creating profile'
    });
  }
};

const updatedProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Mengubah dari req.user.userId menjadi req.user.id
    const profileData = {
      full_name: req.body.full_name,
      birth_place: req.body.birth_place,
      birth_date: req.body.birth_date,
      address: req.body.address,
      phone_number: req.body.phone_number,
      email: req.body.email,
      gender: req.body.gender,
      avatar: req.body.avatar
    };

    const updatedProfile = await updateProfile(userId, profileData);

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update profile'
    });
  }
};

export { getProfile, createuserProfile, updatedProfile };
