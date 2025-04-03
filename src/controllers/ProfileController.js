import { getProfileByUserId, createProfile } from "../models/ProfileModel.js";

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

export { getProfile, createuserProfile };
