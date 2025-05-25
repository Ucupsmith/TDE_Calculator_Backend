import {
  createUserMealSelection,
  getUserMealSelections,
  getLatestMealSelection,
  getMealSelectionsByDate,
  getCurrentDayCalories
} from "../models/UserMealSelectionModel.js";
import { getFoodDetails } from "../models/FoodModel.js";

export const createMealSelection = async (req, res) => {
  try {
    const { userId, tdeeId, selectedFoods, date } = req.body;
    
    if (!userId || !tdeeId || !selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({
        message: "Invalid input data. Required: userId, tdeeId, and selectedFoods array"
      });
    }

    // Get TDEE calculation to get the goal
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: tdeeId }
    });

    if (!tdeeCalculation) {
      return res.status(404).json({
        message: "TDEE calculation not found"
      });
    }

    // Get food details with correct portions based on goal
    const foodsWithDetails = selectedFoods.map(food => ({
      ...food,
      details: getFoodDetails(food.name, tdeeCalculation.goal)
    }));
    
    const mealSelection = await createUserMealSelection({
      userId,
      tdeeId,
      selectedFoods: foodsWithDetails,
      date: date ? new Date(date) : new Date()
    });
    
    res.status(201).json({
      message: "Meal selection saved successfully",
      data: mealSelection
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving meal selection",
      error: error.message
    });
  }
};

export const getCurrentDayCaloriesController = async (req, res) => {
  try {
    const { userId, tdeeId } = req.query;
    
    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: "userId and tdeeId are required"
      });
    }
    
    const calories = await getCurrentDayCalories(Number(userId), Number(tdeeId));
    res.json(calories);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching current day calories",
      error: error.message
    });
  }
};

export const getMealSelections = async (req, res) => {
  try {
    const { userId, tdeeId, date } = req.query;
    
    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: "userId and tdeeId are required"
      });
    }
    
    let selections;
    if (date) {
      // Get selections for specific date
      selections = await getMealSelectionsByDate(Number(userId), Number(tdeeId), new Date(date));
    } else {
      // Get all selections
      selections = await getUserMealSelections(Number(userId), Number(tdeeId));
    }
    
    res.json(selections);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching meal selections",
      error: error.message
    });
  }
};

export const getLatestSelection = async (req, res) => {
  try {
    const { userId, tdeeId } = req.query;
    
    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: "userId and tdeeId are required"
      });
    }
    
    const selection = await getLatestMealSelection(Number(userId), Number(tdeeId));
    
    if (!selection) {
      return res.status(404).json({
        message: "No meal selection found"
      });
    }
    
    res.json(selection);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching latest meal selection",
      error: error.message
    });
  }
}; 