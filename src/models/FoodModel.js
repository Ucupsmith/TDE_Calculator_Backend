import prisma from "../../prisma/prismaClient.js";

const foodData = [
  { name: "dada ayam", calories: 195, unit: "1 porsi" },
  { name: "tahu", calories: 35, unit: "1 buah" },
  { name: "ikan asin", calories: 195, unit: "1 porsi" },
  { name: "rendang", calories: 193, unit: "1 porsi" },
  { name: "tempe", calories: 175, unit: "1 porsi" },
  { name: "perkedel", calories: 21, unit: "1 buah" },
  { name: "sayur asem", calories: 80, unit: "1 porsi" },
  { name: "sayur lodeh", calories: 162, unit: "1 porsi" },
  { name: "kikil", calories: 80, unit: "1 tusuk" },
  { name: "telur", calories: 68, unit: "1 butir" },
  { name: "telur dadar", calories: 93, unit: "1 buah" },
  { name: "paha ayam", calories: 245, unit: "1 porsi" },
  { name: "daging semur", calories: 141, unit: "1 porsi" },
  { name: "cumi goreng", calories: 106, unit: "1 porsi" },
  { name: "sayur sop", calories: 60, unit: "1 porsi" },
  { name: "kangkung", calories: 106, unit: "1 porsi" },
  { name: "tauge", calories: 29, unit: "1 porsi" },
  { name: "usus", calories: 94, unit: "1 porsi" },
  { name: "ati ayam", calories: 35, unit: "1 porsi" },
  { name: "ampela", calories: 32, unit: "1 porsi" },
  { name: "jengkol", calories: 96, unit: "1 porsi" },
  { name: "kerupuk", calories: 15, unit: "1 buah" },
  { name: "teh manis", calories: 55, unit: "1 gelas" },
  { name: "teh tawar", calories: 2, unit: "1 gelas" },
  { name: "sayur Nangka", calories: 57, unit: "1 porsi" },
  { name: "soto ayam", calories: 312, unit: "1 porsi" },
  { name: "soto daging", calories: 219, unit: "1 porsi" },
  { name: "soto mie", calories: 370, unit: "1 porsi" },
  { name: "nasi", calories: 129, unit: "1 porsi", loseWeightUnit: "1/2 porsi", loseWeightCalories: 65 },
  { name: "indomie goreng", calories: 350, unit: "1 bungkus" },
  { name: "indomie rebus", calories: 300, unit: "1 bungkus" },
  { name: "indomie goreng jumbo", calories: 540, unit: "1 bungkus" },
  { name: "kentang mustofa", calories: 190, unit: "1 porsi" }
];

export const getAllFoods = () => {
  return foodData;
};

export const getFoodByName = (name) => {
  return foodData.find(food => food.name.toLowerCase() === name.toLowerCase());
};

export const calculateTotalCalories = (selectedFoods, goal) => {
  return selectedFoods.reduce((total, food) => {
    const foodData = getFoodByName(food.name);
    if (!foodData) return total;

    // Special handling for rice based on goal
    if (food.name.toLowerCase() === "nasi" && goal === "LoseWeight") {
      return total + foodData.loseWeightCalories;
    }

    return total + foodData.calories;
  }, 0);
};

export const calculateRemainingCalories = (tdee, selectedFoods, goal) => {
  const totalCalories = calculateTotalCalories(selectedFoods, goal);
  return tdee - totalCalories;
};

// Helper function to get food details with correct portion based on goal
export const getFoodDetails = (foodName, goal) => {
  const food = getFoodByName(foodName);
  if (!food) return null;

  if (foodName.toLowerCase() === "nasi" && goal === "LoseWeight") {
    return {
      ...food,
      unit: food.loseWeightUnit,
      calories: food.loseWeightCalories
    };
  }

  return food;
}; 