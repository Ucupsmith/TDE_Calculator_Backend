import {
  getAllFoods,
  getFoodByName,
  calculateTotalCalories,
  calculateRemainingCalories
} from "../models/FoodModel.js";

// Get all available foods
export const getAllFoodsController = (req, res) => {
  try {
    const goal = req.query.goal; // 'lose' atau 'gain'
    let foods = getAllFoods();
    if (goal === 'lose' || goal === 'gain' || goal === 'maintain') {
      foods = foods.map(food => {
        if (food.name === 'nasi' || food.name === 'nasi merah') {
          if (goal === 'lose') {
            return {
              ...food,
              unit: '1/2 porsi',
              calories: Math.round(food.calories / 2)
            };
          } else if (goal === 'gain' || goal === 'maintain') {
            return {
              ...food,
              unit: '1 porsi',
              calories: food.calories
            };
          }
        }
        return food;
      });
    }
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching foods", error: error.message });
  }
};

// Get food by name
export const getFoodByNameController = (req, res) => {
  try {
    const { name } = req.params;
    const food = getFoodByName(name);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: "Error fetching food", error: error.message });
  }
};

// Calculate total calories for selected foods
export const calculateTotalCaloriesController = (req, res) => {
  try {
    const { selectedFoods } = req.body;
    if (!selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({ message: "Invalid selected foods data" });
    }
    const totalCalories = calculateTotalCalories(selectedFoods);
    res.json({ totalCalories });
  } catch (error) {
    res.status(500).json({ message: "Error calculating calories", error: error.message });
  }
};

// Calculate remaining calories based on TDEE and selected foods
export const calculateRemainingCaloriesController = (req, res) => {
  try {
    const { tdee, selectedFoods } = req.body;
    if (!tdee || !selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({ message: "Invalid input data" });
    }
    const remainingCalories = calculateRemainingCalories(tdee, selectedFoods);
    res.json({ remainingCalories });
  } catch (error) {
    res.status(500).json({ message: "Error calculating remaining calories", error: error.message });
  }
}; 