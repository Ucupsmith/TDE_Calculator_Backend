import {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  saveTdeeCalculation,
  getTdeeByProfileId,
  getLastTdeeCalculation,
  deleteTdeeCalculation,
  calculateBMRMifflinStJeor
} from '../models/TdeeModel.js';
import prisma from '../../prisma/prismaClient.js';

// Hitung TDEE tanpa save
export const calculateTdeeOnly = (req, res) => {
  const { gender, weight, height, age, activity_level, region, goal } =
    req.body;
  if (!gender || !weight || !height || !age || !activity_level || !goal) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi, region || 'asia');
  const bmr = calculateBMR(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activity_level, goal);

  console.log('--- Debug TDEE Calculation ---');
  console.log('Input Data:', { gender, weight, height, age, activity_level, goal, region });
  console.log('Calculated BMR:', bmr.toFixed(2));
  console.log('Calculated TDEE:', tdee.toFixed(2));
  console.log('------------------------------');

  res.json({
    bmi: bmi.toFixed(2),
    bmiCategory,
    bmr: bmr.toFixed(2),
    tdee: tdee.toFixed(2),
    goal
  });
};

// Hitung TDEE tanpa save menggunakan rumus Mifflin-St Jeor
export const calculateTdeeMifflinStJeorOnly = (req, res) => {
  console.log('Received body for Mifflin-St Jeor:', req.body);
  const { gender, weight, height, age, activity_level, region, goal } =
    req.body;
  if (!gender || !weight || !height || !age || !activity_level || !goal) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const bmi = calculateBMI(weight, height);
  const bmiCategory = getBMICategory(bmi, region || 'asia');
  const bmr = calculateBMRMifflinStJeor(gender, weight, height, age);
  const tdee = calculateTDEE(bmr, activity_level, goal);

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
  const {
    userId, // 🔧 ambil dari frontend, atau dari session server-side
    gender,
    weight,
    height,
    age,
    activity_level,
    goal,
    tdee_result,
    saved_id
  } = req.body;

  if (
    !userId ||
    !gender ||
    !weight ||
    !height ||
    !age ||
    !activity_level ||
    !goal ||
    !tdee_result
  ) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const profile = await prisma.profile.findFirst({
      where: { userId },
      select: { profileId: true }
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found for user' });
    }

    const saved = await prisma.tdeeCalculation.create({
      data: {
        profileId: profile.profileId,
        gender,
        weight,
        height,
        age,
        activity_level,
        goal,
        tdee_result,
        saved_id: saved_id ?? 0
      }
    });

    return res.status(201).json({ message: 'TDEE calculation saved', saved });
  } catch (error) {
    return res.status(500).json({
      message: 'Error saving TDEE calculation',
      error: error.message
    });
  }
};

export const saveTdeeToHomeController = async (req, res) => {
  const { tdee_result, goal } = req.body;
  const userId = req.user.id;

  if (!userId || !tdee_result || !goal) {
    return res.status(400).json({
      message: 'Missing required fields: userId, tdee_result, or goal'
    });
  }

  try {
    const saved = await prisma.tdeeCalculation.create({
      data: {
        userId: userId,
        tdee_result: parseFloat(tdee_result),
        goal: goal,
        activity_level: 'Sedentary',
        age: 0,
        height: 0,
        weight: 0,
        saved_id: 0,
        gender: 'Male'
      }
    });

    const responseData = {
      id: saved.tdeeId,
      tdee_result: saved.tdee_result,
      calculation_date: saved.createdAt,
      goal: saved.goal
    };

    return res.status(201).json({
      message: 'TDEE saved successfully for homepage',
      data: responseData
    });
  } catch (error) {
    console.error('Failed to save TDEE for homepage:', error);
    return res.status(500).json({
      message: 'Failed to save TDEE for homepage',
      error: error.message
    });
  }
};

export const getLastTdeeController = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const lastTdee = await getLastTdeeCalculation(userId);

    if (!lastTdee) {
      return res
        .status(404)
        .json({ message: 'No TDEE calculation found for this user' });
    }

    return res.status(200).json({
      tdeeId: lastTdee.tdeeId,
      tdee: lastTdee.tdee_result,
      createdAt: lastTdee.createdAt,
      lastCalculated: lastTdee.createdAt,
      goal: undefined
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Failed to fetch TDEE', error: error.message });
  }
};

export const getTdeeHistory = async (req, res) => {
  try {
    const { profileId } = req.params;
    const history = await getTdeeByProfileId(Number(profileId));
    res.json(history);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching TDEE history', error: error.message });
  }
};

export const getLatestTdeeResultByProfile = async (req, res) => {
  try {
    // Get userId from authenticated user
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const latest = await prisma.tdeeCalculation.findFirst({
      where: { userId: Number(userId) }, // Use userId instead of profileId
      orderBy: { createdAt: 'desc' }
    });
    if (!latest) {
      return res
        .status(404)
        .json({ message: 'No TDEE result found for this user' }); // More specific message
    }
    // Also include the goal in the response, as it's needed in the frontend
    res.json({
      tdee: latest.tdee_result,
      lastCalculated: latest.createdAt,
      goal: latest.goal
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching latest TDEE result',
      error: error.message
    });
  }
};

export const getTdeeHistoryForHome = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const history = await prisma.tdeeCalculation.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'asc'
      },
      select: {
        tdeeId: true,
        tdee_result: true,
        createdAt: true
      }
    });

    const formattedHistory = history.map((item) => ({
      tdeeId: item.tdeeId,
      tdee_result: item.tdee_result,
      calculation_date: item.createdAt,
      goal: undefined
    }));

    return res.status(200).json(formattedHistory);
  } catch (error) {
    console.error('Failed to fetch TDEE history for homepage:', error);
    return res.status(500).json({
      message: 'Failed to fetch TDEE history for homepage',
      error: error.message
    });
  }
};

export const deleteTdeeCalculationController = async (req, res) => {
  try {
    const { tdeeId } = req.params; // Ambil tdeeId dari parameter URL
    const userId = req.user.id; // Ambil userId dari token

    if (!tdeeId) {
      return res.status(400).json({ message: 'TDEE ID is required' });
    }

    // Panggil fungsi model untuk menghapus
    const deletedTdee = await deleteTdeeCalculation(Number(tdeeId), userId);

    return res.status(200).json({
      message: 'TDEE calculation deleted successfully',
      data: deletedTdee
    });
  } catch (error) {
    console.error('Failed to delete TDEE calculation:', error);
    // Kirim respons error yang sesuai
    if (error.message.includes('TDEE calculation not found')) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({
      message: 'Failed to delete TDEE calculation',
      error: error.message
    });
  }
};
