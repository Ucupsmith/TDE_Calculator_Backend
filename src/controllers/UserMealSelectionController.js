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

// Get meal plan history with formatted data
export const getMealPlanHistory = async (req, res) => {
  try {
    const { userId, tdeeId, startDate, endDate } = req.query;
    
    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: "userId and tdeeId are required"
      });
    }

    // Set default date range if not provided (last 7 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate ? new Date(startDate) : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Get TDEE calculation
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: Number(tdeeId) }
    });

    if (!tdeeCalculation) {
      return res.status(404).json({
        message: "TDEE calculation not found"
      });
    }

    // Get meal selections within date range
    const selections = await prisma.userMealSelection.findMany({
      where: {
        userId: Number(userId),
        tdeeId: Number(tdeeId),
        date: {
          gte: start,
          lte: end
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Format the data for frontend
    const formattedHistory = selections.map(selection => ({
      id: selection.id,
      date: selection.date,
      selectedFoods: JSON.parse(selection.selectedFoods),
      totalCalories: selection.totalCalories,
      remainingCalories: selection.remainingCalories,
      goal: tdeeCalculation.goal
    }));

    res.json({
      history: formattedHistory,
      goal: tdeeCalculation.goal,
      tdee: tdeeCalculation.tdee_result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching meal plan history",
      error: error.message
    });
  }
};

// Update meal selection
export const updateMealSelection = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedFoods } = req.body;

    if (!selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({
        message: "Invalid selected foods data"
      });
    }

    // Get the meal selection to update
    const existingSelection = await prisma.userMealSelection.findUnique({
      where: { id: Number(id) }
    });

    if (!existingSelection) {
      return res.status(404).json({
        message: "Meal selection not found"
      });
    }

    // Get TDEE calculation
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: existingSelection.tdeeId }
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

    // Calculate new total calories
    const totalCalories = calculateTotalCalories(foodsWithDetails, tdeeCalculation.goal);

    // Get all selections for the same day
    const startOfDay = new Date(existingSelection.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(existingSelection.date);
    endOfDay.setHours(23, 59, 59, 999);

    const daySelections = await prisma.userMealSelection.findMany({
      where: {
        userId: existingSelection.userId,
        tdeeId: existingSelection.tdeeId,
        date: {
          gte: startOfDay,
          lte: endOfDay
        },
        id: {
          not: Number(id) // Exclude current selection
        }
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Calculate remaining calories
    let remainingCalories;
    if (daySelections.length === 0) {
      remainingCalories = tdeeCalculation.tdee_result - totalCalories;
    } else {
      const lastSelection = daySelections[daySelections.length - 1];
      remainingCalories = lastSelection.remainingCalories - totalCalories;
    }

    // Update the meal selection
    const updatedSelection = await prisma.userMealSelection.update({
      where: { id: Number(id) },
      data: {
        selectedFoods: JSON.stringify(foodsWithDetails),
        totalCalories,
        remainingCalories
      }
    });

    res.json({
      message: "Meal selection updated successfully",
      data: {
        ...updatedSelection,
        selectedFoods: JSON.parse(updatedSelection.selectedFoods)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating meal selection",
      error: error.message
    });
  }
}; 