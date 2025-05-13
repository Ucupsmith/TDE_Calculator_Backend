import {
  getProfileByUserId,
  createProfile,
  updateProfile,
} from "../models/ProfileModel.js";

const getProfile = async (req, res) => {
  try {
    const profile = await getProfileByUserId(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving profile" });
  }
};

const createuserProfile = async (req, res) => {
  try {
    const { user_id, gender, weight, height, activity_level } = req.body;
    const profileId = await createProfile(
      user_id,
      gender,
      weight,
      height,
      activity_level
    );
    res.status(201).json({ message: "Profile created", profileId });
  } catch (error) {
    res.status(500).json({ message: "Error creating profile" });
  }
};

const updatedProfile = async (req, res) => {
  const userId = parseInt(req.params.userId);
  const {
    full_name,
    birth_place,
    birth_date,
    address,
    phone_number,
    email,
    gender,
    avatar_url,
  } = req.body;
  try {
    const updatesProfile = await updateProfile(userId, {
      full_name,
      birth_place,
      birth_date,
      address,
      phone_number,
      email,
      gender,
      avatar_url,
    });
    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatesProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

export { getProfile, createuserProfile, updatedProfile };
