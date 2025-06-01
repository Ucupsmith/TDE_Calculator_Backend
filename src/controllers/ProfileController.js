import {
  getProfileByUserId,
  createProfile,
  updateProfile
} from '../models/ProfileModel.js';

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Menggunakan req.user.id sesuai claim token
    console.log('Fetching profile for userId:', userId);
    const profile = await getProfileByUserId(userId);

    if (!profile) {
      console.warn('Profile not found for userId:', userId);
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    console.error('Error in getProfile controller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error retrieving profile',
      error: error.message
    });
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
