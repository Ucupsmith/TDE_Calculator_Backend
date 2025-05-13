import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  saveTdeeCalculation,
  getTdeeByProfileId,
} from "../models/TdeeModel.js";

export const calculateTdee = async (req, res) => {
  try {
    const { gender, weight, height, age, activity_level, region, profileId, goal } = req.body;
    if (!gender || !weight || !height || !age || !activity_level || !profileId || !goal) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi, region || "asia");
    const bmr = calculateBMR(gender, weight, height, age);
    const tdee = calculateTDEE(bmr, activity_level);

    // Simpan ke database
    const saved = await saveTdeeCalculation({
      profileId,
      gender,
      weight,
      height,
      age,
      activity_level,
      goal,
      tdee_result: tdee,
    });

    res.json({
      bmi: bmi.toFixed(2),
      bmiCategory,
      bmr: bmr.toFixed(2),
      tdee: tdee.toFixed(2),
      saved,
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating TDEE", error: error.message });
  }
};

export const getTdeeHistory = async (req, res) => {
  try {
    const { profileId } = req.params;
    const history = await getTdeeByProfileId(Number(profileId));
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: "Error fetching TDEE history", error: error.message });
  }
}; 