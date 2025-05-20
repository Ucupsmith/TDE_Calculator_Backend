import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  saveTdeeCalculation,
  getTdeeByProfileId,
} from "../models/TdeeModel.js";
import prisma from "../../prisma/prismaClient.js";

// Hitung TDEE tanpa save
export const calculateTdeeOnly = (req, res) => {
  const { gender, weight, height, age, activity_level, region, goal } = req.body;
  if (!gender || !weight || !height || !age || !activity_level || !goal) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi, region || "asia");
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activity_level);

  res.json({
    bmi: bmi.toFixed(2),
    bmiCategory,
    bmr: bmr.toFixed(2),
    tdee: tdee.toFixed(2),
    goal
  });
};

// Save hasil perhitungan ke database
export const saveTdeeCalculationController = async (req, res) => {
  const { profileId, gender, weight, height, age, activity_level, goal, tdee_result, saved_id } = req.body;
  if (!profileId || !gender || !weight || !height || !age || !activity_level || !goal || !tdee_result) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const saved = await prisma.tdeeCalculation.create({
      data: {
        profileId,
        gender,
        weight,
        height,
        age,
        activity_level,
        goal,
        tdee_result,
        saved_id: saved_id !== undefined ? saved_id : 0
      }
    });
    res.status(201).json({ message: "TDEE calculation saved", saved });
  } catch (error) {
    res.status(500).json({ message: "Error saving TDEE calculation", error: error.message });
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

export const getLatestTdeeResultByProfile = async (req, res) => {
  try {
    const { profileId } = req.query;
    if (!profileId) {
      return res.status(400).json({ message: "profileId is required" });
    }
    const latest = await prisma.tdeeCalculation.findFirst({
      where: { profileId: Number(profileId) },
      orderBy: { createdAt: 'desc' }
    });
    if (!latest) {
      return res.status(404).json({ message: "No TDEE result found" });
    }
    res.json({ tdee: latest.tdee_result, lastCalculated: latest.createdAt });
  } catch (error) {
    res.status(500).json({ message: "Error fetching TDEE result", error: error.message });
  }
}; 