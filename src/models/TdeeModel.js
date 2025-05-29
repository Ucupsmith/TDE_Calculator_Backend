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
  if (gender === 'male') {
    return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }
}

// TDEE calculation (Katch-McArdle)
export function calculateTDEE(bmr, activityLevel, goal) {
  const factors = {
    sedentary: 1.2,
    slightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9
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

export const getTdeeByProfileId = async (profileId) => {
  return await prisma.tdeeCalculation.findMany({
    where: { profileId: profileId }
  });
};
