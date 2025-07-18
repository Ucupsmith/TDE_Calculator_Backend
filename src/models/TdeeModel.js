import prisma from '../../prisma/prismaClient.js';

// BMI calculation
export function calculateBMI(weight, height) {
  const heightM = height / 100;
  return weight / (heightM * heightM);
}

// BMI Category
export function getBMICategory(bmi, region = 'asia') {
  if (region === 'asia') {
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 22.9) return 'Normal';
    if (bmi <= 24.9) return 'Obesity level 1';
    if (bmi <= 29.9) return 'Obesity level 2';
    return 'Obesity level 3';
  } else {
    if (bmi < 18.5) return 'Underweight';
    if (bmi <= 24.9) return 'Normal';
    if (bmi <= 29.9) return 'Obesity level 1';
    if (bmi <= 34.9) return 'Obesity level 2';
    if (bmi <= 39.9) return 'Obesity level 3';
    return 'Obesity level 4';
  }
}

// BMR calculation (Harris-Benedict)
export function calculateBMR(gender, weight, height, age) {
  let bmrResult;
  if (gender.toLowerCase() === 'male') {
    const term1 = 88.362;
    const term2 = 13.397 * weight;
    const term3 = 4.799 * height;
    const term4 = 5.677 * age;
    bmrResult = term1 + term2 + term3 - term4;
  } else {
    const term1 = 447.593;
    const term2 = 9.247 * weight;
    const term3 = 3.098 * height;
    const term4 = 4.33 * age;
    bmrResult = term1 + term2 + term3 - term4;
  }
  return bmrResult;
}

// BMR calculation (Mifflin-St Jeor)
export function calculateBMRMifflinStJeor(gender, weight, height, age) {
  if (gender.toLowerCase() === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// TDEE calculation (Katch-McArdle)
export function calculateTDEE(bmr, activityLevel, goal) {
  const factors = {
    Sedentary: 1.2,
    'Lightly Active': 1.375,
    'Moderately Active': 1.55,
    'Very Active': 1.725,
    'Extra Active': 1.9
  };

  let baseTDEE = bmr * (factors[activityLevel] || 1.2);

  // Adjust TDEE based on goal
  switch (goal) {
    case 'LoseWeight':
      return baseTDEE - 500; // Deficit of 500 calories for weight loss
    case 'GainWeight':
      return baseTDEE + 500; // Surplus of 500 calories for weight gain
    case 'MaintainWeight':
    default:
      return baseTDEE; // No adjustment for maintenance
  }
}

export const saveTdeeCalculation = async (data) => {
  return await prisma.tdeeCalculation.create({
    data: {
      userId: data.userId,
      gender: data.gender,
      weight: data.weight,
      height: data.height,
      age: data.age,
      activity_level: data.activity_level,
      goal: data.goal,
      tdee_result: data.tdee_result,
      saved_id: data.saved_id ?? 0
    }
  });
};

export const getLastTdeeCalculation = async (userId) => {
  return await prisma.tdeeCalculation.findFirst({
    where: { userId: Number(userId) },
    orderBy: { tdeeId: 'desc' } // paling terbaru
  });
};

export const getTdeeByProfileId = async (profileId) => {
  return await prisma.tdeeCalculation.findMany({
    where: { profileId: profileId }
  });
};

export const getTdeeHistoryForHome = async (userId) => {
  // ... existing code ...
};

export const deleteTdeeCalculation = async (tdeeId, userId) => {
  try {
    const deletedTdee = await prisma.tdeeCalculation.delete({
      where: {
        tdeeId: tdeeId, // Delete by TDEE ID
        userId: userId // Ensure the user owns this TDEE calculation
      }
    });
    return deletedTdee;
  } catch (error) {
    // Handle case where TDEE calculation is not found or doesn't belong to the user
    if (error.code === 'P2025') {
      // P2025: An operation failed because it depends on one or more records that were required but not found.
      throw new Error(
        'TDEE calculation not found or does not belong to the user.'
      );
    }
    throw new Error(`Error deleting TDEE calculation: ${error.message}`);
  }
};
