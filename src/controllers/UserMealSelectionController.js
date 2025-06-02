import {
  createUserMealSelection,
  getUserMealSelections,
  getLatestMealSelection,
  getMealSelectionsByDate,
  getCurrentDayCalories
} from '../models/UserMealSelectionModel.js';
import { getFoodDetails } from '../models/FoodModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMealSelection = async (req, res) => {
  try {
    const { userId, tdeeId, selectedFoods, date } = req.body;

    if (!userId || !tdeeId || !selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({
        message:
          'Invalid input data. Required: userId, tdeeId, and selectedFoods array'
      });
    }

    // Get TDEE calculation to get the goal
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: tdeeId }
    });

    if (!tdeeCalculation) {
      return res.status(404).json({
        message: 'TDEE calculation not found'
      });
    }

    // Get food details with correct portions based on goal
    const foodsWithDetails = selectedFoods
      .map((food) => {
        const foodFromDatabase = getFoodDetails(
          food.name,
          tdeeCalculation.goal
        );

        // If food is found in the database, use those details
        if (foodFromDatabase) {
          return { ...food, details: foodFromDatabase };
        } else {
          // If not found in database, assume it's a custom food and use provided details
          // Ensure necessary fields are present, assuming frontend sends them
          if (
            !food.name ||
            food.calories === undefined ||
            food.unit === undefined ||
            food.quantity === undefined
          ) {
            console.error('Missing details for custom food:', food);
            // Depending on desired behavior, you might skip this food, return a default, or throw an error
            return null; // Or handle as needed
          }
          // Store custom food details as they are, perhaps in a 'details' sub-object for consistency
          return {
            ...food,
            details: {
              name: food.name,
              calories: food.calories / food.quantity, // Store calories per unit if total calories for quantity is sent
              unit: food.unit
              // Add other custom fields if needed
            }
          };
        }
      })
      .filter((food) => food !== null); // Filter out any foods that couldn't be processed

    // Calculate total calories based on the potentially modified foodsWithDetails array
    // This calculation needs to handle both database foods (using details.calories) and custom foods (using the provided food.calories or recalculating from details if stored per unit)
    const totalCalories = foodsWithDetails.reduce((total, food) => {
      if (
        food.details &&
        food.details.calories !== undefined &&
        food.quantity !== undefined
      ) {
        // If details are available (either from DB or custom stored in details), use them
        // Assuming details.calories is calories per unit
        return total + food.details.calories * food.quantity;
      } else if (food.calories !== undefined && food.quantity !== undefined) {
        // Fallback: if details not structured as expected but food.calories is present (maybe total calories for quantity was sent directly)
        console.warn('Using direct food.calories for total calculation:', food);
        return total + food.calories;
      }
      console.error('Could not calculate calories for food:', food);
      return total; // Skip if calories or quantity are missing
    }, 0);

    const mealSelection = await createUserMealSelection({
      userId,
      tdeeId,
      selectedFoods: foodsWithDetails,
      date: date ? new Date(date) : new Date()
    });

    res.status(201).json({
      message: 'Meal selection saved successfully',
      data: mealSelection
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error saving meal selection',
      error: error.message
    });
  }
};

export const getCurrentDayCaloriesController = async (req, res) => {
  try {
    const { userId, tdeeId } = req.query;

    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: 'userId and tdeeId are required'
      });
    }

    const calories = await getCurrentDayCalories(
      Number(userId),
      Number(tdeeId)
    );
    res.json(calories);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching current day calories',
      error: error.message
    });
  }
};

export const getMealSelections = async (req, res) => {
  try {
    const { userId, tdeeId, date } = req.query;

    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: 'userId and tdeeId are required'
      });
    }

    let selections;
    if (date) {
      // Get selections for specific date
      selections = await getMealSelectionsByDate(
        Number(userId),
        Number(tdeeId),
        new Date(date)
      );
    } else {
      // Get all selections
      selections = await getUserMealSelections(Number(userId), Number(tdeeId));
    }

    res.json(selections);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching meal selections',
      error: error.message
    });
  }
};

export const getLatestSelection = async (req, res) => {
  try {
    const { userId, tdeeId } = req.query;

    if (!userId || !tdeeId) {
      return res.status(400).json({
        message: 'userId and tdeeId are required'
      });
    }

    const selection = await getLatestMealSelection(
      Number(userId),
      Number(tdeeId)
    );

    if (!selection) {
      return res.status(404).json({
        message: 'No meal selection found'
      });
    }

    res.json(selection);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching latest meal selection',
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
        message: 'userId and tdeeId are required'
      });
    }

    // Set default date range if not provided (last 7 days)
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate
      ? new Date(startDate)
      : new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get TDEE calculation
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: Number(tdeeId) }
    });

    if (!tdeeCalculation) {
      return res.status(404).json({
        message: 'TDEE calculation not found'
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
    const formattedHistory = selections.map((selection) => ({
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
      message: 'Error fetching meal plan history',
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
        message: 'Invalid selected foods data'
      });
    }

    // Get the meal selection to update
    const existingSelection = await prisma.userMealSelection.findUnique({
      where: { id: Number(id) }
    });

    if (!existingSelection) {
      return res.status(404).json({
        message: 'Meal selection not found'
      });
    }

    // Get TDEE calculation
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: existingSelection.tdeeId }
    });

    if (!tdeeCalculation) {
      return res.status(404).json({
        message: 'TDEE calculation not found'
      });
    }

    // === Start of modified logic for processing selectedFoods ===
    const foodsWithDetails = selectedFoods
      .map((food) => {
        const foodFromDatabase = getFoodDetails(
          food.name,
          tdeeCalculation.goal
        ); // This call already applies the nasi/lose weight logic for DB foods

        // If food is found in the database, use those details
        if (foodFromDatabase) {
          return { ...food, details: foodFromDatabase }; // foodFromDatabase already has correct calories/unit for nasi LW
        } else {
          // If not found in database, assume it's a custom food and use provided details
          // Ensure necessary fields are present, assuming frontend sends them
          if (
            !food.name ||
            food.calories === undefined ||
            food.unit === undefined ||
            food.quantity === undefined
          ) {
            console.error('Missing details for custom food in update:', food);
            // Depending on desired behavior, you might skip this food, return a default, or throw an error
            return null; // Or handle as needed
          }
          // Store custom food details as they are, perhaps in a 'details' sub-object for consistency
          return {
            ...food,
            details: {
              name: food.name,
              calories: food.calories / food.quantity, // Store calories per unit if total calories for quantity is sent
              unit: food.unit
              // Add other custom fields if needed
            }
          };
        }
      })
      .filter((food) => food !== null); // Filter out any foods that couldn't be processed

    // Calculate new total calories based on the potentially modified foodsWithDetails array
    const totalCalories = foodsWithDetails.reduce((total, food) => {
      if (
        food.details &&
        food.details.calories !== undefined &&
        food.quantity !== undefined
      ) {
        // If details are available (either from DB or custom stored in details), use them
        // Assuming details.calories is calories per unit
        return total + food.details.calories * food.quantity;
      } else if (food.calories !== undefined && food.quantity !== undefined) {
        // Fallback: if details not structured as expected but food.calories is present (maybe total calories for quantity was sent directly)
        console.warn(
          'Using direct food.calories for total calculation in update:',
          food
        );
        return total + food.calories;
      }
      console.error('Could not calculate calories for food in update:', food);
      return total; // Skip if calories or quantity are missing
    }, 0);
    // === End of modified logic ===

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
      message: 'Meal selection updated successfully',
      data: {
        ...updatedSelection,
        selectedFoods: JSON.parse(updatedSelection.selectedFoods)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating meal selection',
      error: error.message
    });
  }
};

// Endpoint baru: GET /user/v1/meal-plans/summary?userId=...&tdeeId=...
export const getMealPlanSummary = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'tdeeId is required' });
    }
    const mealPlan = await prisma.mealPlan.findFirst({
      where: { userId: Number(userId) },
      include: {
        tdeeCalculation: true
      }
    });
    console.log('Meal Plan:', mealPlan);

    if (!mealPlan || !mealPlan.tdeeCalculation) {
      return res.status(404).json({ message: 'Meal plan or TDEE not found' });
    }

    return res.json({
      goal: mealPlan.goal,
      tdee: mealPlan.tdeeCalculation.tdee_result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching meal plan summary',
      error: error.message
    });
  }
};

export const getMealPlanByTdeeId = async (req, res) => {
  try {
    const { tdeeId } = req.query;
    if (!tdeeId) {
      return res.status(400).json({ message: 'tdeeId is required' });
    }
    const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
      where: { tdeeId: Number(tdeeId) }
    });
    if (!tdeeCalculation) {
      return res.status(404).json({ message: 'TDEE calculation not found' });
    }
    return res.json({
      goal: tdeeCalculation.goal,
      tdee: tdeeCalculation.tdee_result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching meal plan summary',
      error: error.message
    });
  }
};
