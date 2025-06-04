import {
  createUserMealSelection,
  getUserMealSelections,
  getLatestMealSelection,
  getMealSelectionsByDate,
  getCurrentDayCalories
} from '../models/UserMealSelectionModel.js';
// Removed import for FoodModel as we will save food details directly
// import { getFoodDetails } from '../models/FoodModel.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get today's meal plan data
export const getCurrentDayCaloriesController = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's TDEE goal
    const userTdee = await prisma.tdeeCalculation.findFirst({
      where: {
        userId: Number(userId),
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!userTdee) {
      return res.status(404).json({ message: 'No active TDEE found for user' });
    }

    // Get today's meal history
    const todayMealHistory = await prisma.dailyMealHistory.findFirst({
      where: {
        userId: Number(userId),
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        foods: true
      }
    });

    // Calculate total calories and remaining
    const totalCalories = todayMealHistory?.totalCalories || 0;
    const calorieRemaining = userTdee.tdee - totalCalories;

    res.json({
      totalCalories,
      calorieRemaining,
      tdeeGoal: userTdee.tdee,
      goal: userTdee.goal
    });
  } catch (error) {
    console.error('Error getting current day calories:', error);
    res.status(500).json({
      message: 'Error getting current day calories',
      error: error.message
    });
  }
};

// Add food to today's meal plan
export const createMealSelection = async (req, res) => {
  try {
    // Accept foods array with potential custom food data
    const { userId, foods } = req.body;

    if (!userId || !foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: userId, foods (array of { foodId: number, quantity: number } OR { isCustom: true, customName: string, customCalories: number, quantity: number })'
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's TDEE goal
    const userTdee = await prisma.tdeeCalculation.findFirst({
      where: {
        userId: Number(userId),
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!userTdee) {
      return res.status(404).json({ message: 'No active TDEE found for user' });
    }

    // Get or create today's meal history
    let todayMealHistory = await prisma.dailyMealHistory.findFirst({
      where: {
        userId: Number(userId),
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      }
    });

    if (!todayMealHistory) {
      todayMealHistory = await prisma.dailyMealHistory.create({
        data: {
          userId: Number(userId),
          tdeeId: userTdee.tdeeId,
          date: today,
          totalCalories: 0,
          calorieRemaining: userTdee.tdee
        }
      });
    }

    let totalCaloriesAdded = 0;
    const foodEntriesToCreate = [];

    // Process each food item from the array
    for (const foodItem of foods) {
      // Validate required fields for both types
      if (typeof foodItem.quantity !== 'number' || foodItem.quantity <= 0) {
        console.warn(`Invalid quantity received: ${JSON.stringify(foodItem)}`);
        continue; // Skip invalid item
      }

      let caloriesForItem = 0;

      if (foodItem.isCustom) {
        // Process custom food
        if (!foodItem.customName || typeof foodItem.customCalories !== 'number' || foodItem.customCalories < 0) {
          console.warn(`Invalid custom food data received: ${JSON.stringify(foodItem)}`);
          continue; // Skip invalid custom food
        }

        caloriesForItem = foodItem.customCalories * foodItem.quantity;

        foodEntriesToCreate.push({
          mealHistoryId: todayMealHistory.id,
          isCustom: true,
          customName: foodItem.customName,
          customCalories: foodItem.customCalories,
          quantity: foodItem.quantity,
          // foodId and food relation will be null
        });

      } else {
        // Process standard food using foodId
        if (!foodItem.foodId) {
          console.warn(`Invalid standard food data (missing foodId) received: ${JSON.stringify(foodItem)}`);
          continue; // Skip invalid standard food
        }

        // Get food details to calculate calories
        const food = await prisma.food.findUnique({
          where: { id: Number(foodItem.foodId) }
        });

        if (!food) {
          console.warn(`Standard Food with ID ${foodItem.foodId} not found. Skipping.`);
          continue; // Skip this food item
        }

        caloriesForItem = food.calories * foodItem.quantity;

        foodEntriesToCreate.push({
          mealHistoryId: todayMealHistory.id,
          foodId: Number(foodItem.foodId),
          quantity: foodItem.quantity,
          isCustom: false,
          // customName and customCalories will be null
        });
      }

      totalCaloriesAdded += caloriesForItem;
    }

    // Create all valid food entries in a single batch (more efficient)
    if (foodEntriesToCreate.length > 0) {
      await prisma.dailyMealFoodEntry.createMany({ // Use createMany for efficiency
        data: foodEntriesToCreate
      });
    }

    // Update total calories and remaining ONLY if calories were added
    if (totalCaloriesAdded > 0) {
      const updatedHistory = await prisma.dailyMealHistory.update({
        where: { id: todayMealHistory.id },
        data: {
          totalCalories: {
            increment: totalCaloriesAdded
          },
          calorieRemaining: {
            decrement: totalCaloriesAdded
          }
        },
        include: {
          foods: { // Include foods to potentially return updated list if needed in the future
            orderBy: { createdAt: 'asc' }, // Order food entries for consistency
            include: { food: true } // Include relation to standard food data
          }
        }
      });

      // Simplified response as requested
      res.status(201).json({
        totalCalories: updatedHistory.totalCalories,
        calorieRemaining: updatedHistory.calorieRemaining
        // tdeeGoal and goal are not included in this simplified response
      });
    } else {
      // If no valid foods were processed, return current history data without updating
      // Still include totalCalories and calorieRemaining
      res.status(200).json({
        totalCalories: todayMealHistory.totalCalories,
        calorieRemaining: todayMealHistory.calorieRemaining
      });
    }

  } catch (error) {
    console.error('Error adding food to meal plan:', error);
    res.status(500).json({
      message: 'Error adding food to meal plan',
      error: error.message
    });
  }
};

// Get available foods for meal plan
export const getMealPlanFoods = async (req, res) => {
  try {
    const foods = await prisma.food.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    res.json(foods);
  } catch (error) {
    console.error('Error getting meal plan foods:', error);
    res.status(500).json({
      message: 'Error getting meal plan foods',
      error: error.message
    });
  }
};

// Keep other handlers for now, will need to adjust them later to use new models
export const getMealSelections = async (req, res) => {
   // This handler needs to be updated to query DailyMealHistory
  res.status(501).json({ message: 'Not Implemented - getMealSelections needs update' });
};

export const getLatestSelection = async (req, res) => {
   // This handler needs to be updated to query DailyMealHistory
  res.status(501).json({ message: 'Not Implemented - getLatestSelection needs update' });
};

// This handler needs to be updated to query DailyMealHistory
export const getMealPlanHistory = async (req, res) => {
  try {
    const { userId } = req.query; // Assuming userId is passed as a query parameter

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Fetch daily meal history for the user, ordered by date descending
    const history = await prisma.dailyMealHistory.findMany({
      where: {
        userId: Number(userId),
      },
      orderBy: {
        date: 'desc', // Show most recent history first
      },
      include: {
        // Include the food entries for each day
        foods: {
          orderBy: {
             createdAt: 'asc' // Order food entries within a day
          },
          include: {
            // For standard foods, include the food details
            food: true,
          },
        },
        // Include the related TDEE calculation for goal and TDEE result
        tdee: true, // Include the related TdeeCalculation
      },
    });

    // Format the response data
    // We will transform the Prisma result into a cleaner structure for the frontend
    const formattedHistory = history.map(day => ({
      id: day.id, // DailyHistory ID
      date: day.date, // Date of the history entry
      totalCalories: day.totalCalories,
      calorieRemaining: day.calorieRemaining,
      tdeeResult: day.tdee.tdee, // Get TDEE result from related TDEE calculation
      goal: day.tdee.goal, // Get goal from related TDEE calculation
      foods: day.foods.map(foodEntry => ({
        // Use standard food details if available, otherwise use custom food details
        id: foodEntry.id, // DailyMealFoodEntry ID
        // Include foodId only if it's a standard food
        foodId: foodEntry.foodId || undefined, // Use undefined if null
        name: foodEntry.isCustom ? foodEntry.customName : foodEntry.food?.name, // Use customName or food name
        calories: foodEntry.isCustom ? foodEntry.customCalories : foodEntry.food?.calories, // Calories per quantity unit
        unit: foodEntry.isCustom ? undefined : foodEntry.food?.unit, // Unit for standard food
        imageUrl: foodEntry.isCustom ? undefined : foodEntry.food?.imageUrl, // imageUrl for standard food
        quantity: foodEntry.quantity,
        isCustom: foodEntry.isCustom,
        // Include custom fields only if it's a custom food
        customName: foodEntry.isCustom ? foodEntry.customName : undefined,
        customCalories: foodEntry.isCustom ? foodEntry.customCalories : undefined,
      })),
      createdAt: day.createdAt,
      updatedAt: day.updatedAt,
    }));

    res.json(formattedHistory);

  } catch (error) {
    console.error('Error getting meal plan history:', error);
    res.status(500).json({
      message: 'Error getting meal plan history',
      error: error.message,
    });
  }
};

// This handler needs to be updated to update DailyMealHistory and DailyMealFoodEntry
export const updateMealSelection = async (req, res) => {
   res.status(501).json({ message: 'Not Implemented - updateMealSelection needs update' });
};

// These handlers might need adjustment or be removed/replaced
export const getMealPlanSummary = async (req, res) => {
   res.status(501).json({ message: 'Not Implemented - getMealPlanSummary needs update' });
};

export const getMealPlanByTdeeId = async (req, res) => {
   res.status(501).json({ message: 'Not Implemented - getMealPlanByTdeeId needs update' });
};
