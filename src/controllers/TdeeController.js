import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE } from "../models/TdeeModel.js";

export const calculateTdee = (req, res) => {
  try {
    const { gender, weight, height, age, activity_level, region } = req.body;
    if (!gender || !weight || !height || !age || !activity_level) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const bmi = calculateBMI(weight, height);
    const bmiCategory = getBMICategory(bmi, region || 'asia');
    const bmr = calculateBMR(gender, weight, height, age);
    const tdee = calculateTDEE(bmr, activity_level);
    res.json({
      bmi: bmi.toFixed(2),
      bmiCategory,
      bmr: bmr.toFixed(2),
      tdee: tdee.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: "Error calculating TDEE" });
  }
}; 