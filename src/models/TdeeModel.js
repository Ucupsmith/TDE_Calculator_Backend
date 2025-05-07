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
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

// TDEE calculation (Katch-McArdle)
export function calculateTDEE(bmr, activityLevel) {
  const factors = {
    sedentary: 1.2,
    slightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  return bmr * (factors[activityLevel] || 1.2);
} 