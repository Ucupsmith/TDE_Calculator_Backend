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
    // Ambil dan konversi userId & tdeeId dari query
    const { userId, tdeeId } = req.query;
    const userIdInt = Number(userId);
    const tdeeIdInt = Number(tdeeId);

    // Validasi userId
    if (isNaN(userIdInt)) {
      return res.status(400).json({ message: 'User ID must be a number' });
    }
    // Validasi tdeeId jika ada
    if (tdeeId && isNaN(tdeeIdInt)) {
      return res.status(400).json({ message: 'TDEE ID must be a number' });
    }

    // Ambil TDEE terakhir user
    const userTdee = await prisma.tdeeCalculation.findFirst({
      where: { userId: userIdInt },
      orderBy: { createdAt: 'desc' }
    });

    if (!userTdee) {
      return res.status(404).json({ message: 'No active TDEE found for user' });
    }

    // Jika tdeeId diberikan, cek validitasnya di database (opsional, bisa dihapus jika tidak perlu)
    let tdee = null;
    if (tdeeIdInt) {
      tdee = await prisma.tdeeCalculation.findUnique({
        where: { tdeeId: tdeeIdInt }
      });
      if (!tdee) {
        return res
          .status(404)
          .json({ message: 'TDEE not found for given tdeeId' });
      }
    }

    // Panggil fungsi untuk dapatkan kalori hari ini
    const result = await getCurrentDayCalories(userIdInt, tdeeIdInt);

    res.json({
      totalCalories: result.totalCalories,
      remainingCalories: result.remainingCalories,
      tdeeGoal: result.tdeeGoal,
      goal: result.goal,
      isNewDay: result.isNewDay
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
    const { userId, foods } = req.body;

    if (!userId || !foods || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({
        message: 'Missing required fields: userId and foods array'
      });
    }

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get user's TDEE goal
    const userTdee = await prisma.tdeeCalculation.findFirst({
      where: {
        userId: Number(userId)
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
          calorieRemaining: Number(userTdee.tdee_result)
        }
      });
    }

    let totalCaloriesAdded = 0;
    const foodEntriesToCreate = [];
    const processedFoods = [];

    // Process each food item from the array
    for (const foodItem of foods) {
      // Skip if no calories or invalid calories
      if (
        !foodItem.calories ||
        typeof foodItem.calories !== 'number' ||
        foodItem.calories < 0
      ) {
        console.warn(`Invalid calories for food: ${JSON.stringify(foodItem)}`);
        continue;
      }

      // Handle both custom and standard foods
      if (foodItem.isCustom) {
        // Process custom food
        const foodEntry = {
          mealHistoryId: todayMealHistory.id,
          isCustom: true,
          customName: foodItem.name,
          customCalories: foodItem.calories,
          quantity: foodItem.unit || 1
        };
        foodEntriesToCreate.push(foodEntry);
        processedFoods.push({
          id: foodEntriesToCreate.length, // Temporary ID
          name: foodItem.name,
          calories: foodItem.calories,
          unit: foodItem.unit || '1 porsi',
          imageUrl: null,
          isCustom: true
        });
        totalCaloriesAdded += foodItem.calories * (foodItem.unit || 1);
      } else {
        // Process standard food
        const existingFood = await prisma.food.findFirst({
          where: {
            name: foodItem.name,
            calories: foodItem.calories
          },
          select: {
            id: true,
            name: true,
            calories: true,
            unit: true,
            imageUrl: true // Make sure to select imageUrl
          }
        });

        if (existingFood) {
          // If food exists in database, use its ID and image
          const foodEntry = {
            mealHistoryId: todayMealHistory.id,
            foodId: existingFood.id,
            quantity: 1,
            isCustom: false
          };
          foodEntriesToCreate.push(foodEntry);
          processedFoods.push({
            id: existingFood.id,
            name: existingFood.name,
            calories: existingFood.calories,
            unit: existingFood.unit,
            imageUrl: existingFood.imageUrl, // Include the image from database
            isCustom: false
          });
        } else {
          // If food doesn't exist, treat it as custom
          const foodEntry = {
            mealHistoryId: todayMealHistory.id,
            isCustom: true,
            customName: foodItem.name,
            customCalories: foodItem.calories,
            quantity: 1
          };
          foodEntriesToCreate.push(foodEntry);
          processedFoods.push({
            id: foodEntriesToCreate.length, // Temporary ID
            name: foodItem.name,
            calories: foodItem.calories,
            unit: '1 porsi',
            imageUrl: null,
            isCustom: true
          });
        }
        totalCaloriesAdded += foodItem.calories;
      }
    }

    // Create all food entries
    if (foodEntriesToCreate.length > 0) {
      await prisma.dailyMealFoodEntry.createMany({
        data: foodEntriesToCreate
      });
    }

    // Update total calories and remaining
    const updatedHistory = await prisma.dailyMealHistory.update({
      where: { id: todayMealHistory.id },
      data: {
        totalCalories: {
          increment: totalCaloriesAdded
        },
        calorieRemaining: {
          decrement: totalCaloriesAdded
        }
      }
    });

    // Create user meal selection record
    await createUserMealSelection({
      userId: Number(userId),
      tdeeId: userTdee.tdeeId,
      selectedFoods: processedFoods,
      date: today
    });

    res.status(201).json({
      message: 'Meal selection created successfully',
      data: {
        totalCalories: updatedHistory.totalCalories,
        calorieRemaining: updatedHistory.calorieRemaining,
        foods: processedFoods
      }
    });
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
  res
    .status(501)
    .json({ message: 'Not Implemented - getMealSelections needs update' });
};

export const getLatestSelection = async (req, res) => {
  // This handler needs to be updated to query DailyMealHistory
  res
    .status(501)
    .json({ message: 'Not Implemented - getLatestSelection needs update' });
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
        userId: Number(userId)
      },
      orderBy: {
        date: 'desc' // Show most recent history first
      },
      include: {
        // Include the food entries for each day
        foods: {
          orderBy: {
            createdAt: 'asc' // Order food entries within a day
          },
          include: {
            // For standard foods, include the food details
            food: true
          }
        },
        // Include the related TDEE calculation for goal and TDEE result
        tdee: true // Include the related TdeeCalculation
      }
    });

    // Format the response data
    // We will transform the Prisma result into a cleaner structure for the frontend
    const formattedHistory = history.map((day) => ({
      id: day.id, // DailyHistory ID
      date: day.date, // Date of the history entry
      // Provide default 0 if totalCalories or calorieRemaining is null
      totalCalories: day.totalCalories ?? 0, // Provide default 0 if null
      calorieRemaining: day.calorieRemaining ?? 0, // Provide default 0 if null
      // Safely access tdeeResult and goal, provide default if tdee relation is null
      tdeeResult: day.tdee ? Math.ceil(day.tdee.tdee_result.toNumber()) : 0, // Use 0 or a suitable default if tdee is null
      goal: day.tdee ? day.tdee.goal : 'N/A', // Use 'N/A' or a suitable default if tdee is null
      foods: day.foods.map((foodEntry) => ({
        // Use standard food details if available, otherwise use custom food details
        id: foodEntry.id, // DailyMealFoodEntry ID
        // Include foodId only if it's a standard food
        foodId: foodEntry.foodId || undefined, // Use undefined if null
        name: foodEntry.isCustom ? foodEntry.customName : foodEntry.food?.name, // Use customName or food name
        calories: foodEntry.isCustom
          ? foodEntry.customCalories
          : foodEntry.food?.calories, // Calories per quantity unit
        unit: foodEntry.isCustom ? undefined : foodEntry.food?.unit, // Unit for standard food
        imageUrl: foodEntry.isCustom ? undefined : foodEntry.food?.imageUrl, // imageUrl for standard food
        quantity: foodEntry.quantity,
        isCustom: foodEntry.isCustom,
        // Include custom fields only if it's a custom food
        customName: foodEntry.isCustom ? foodEntry.customName : undefined,
        customCalories: foodEntry.isCustom
          ? foodEntry.customCalories
          : undefined
      })),
      createdAt: day.createdAt,
      updatedAt: day.updatedAt
    }));

    res.json(formattedHistory);
  } catch (error) {
    console.error('Error getting meal plan history:', error);
    res.status(500).json({
      message: 'Error getting meal plan history',
      error: error.message
    });
  }
};

// This handler needs to be updated to update DailyMealHistory and DailyMealFoodEntry
export const updateMealSelection = async (req, res) => {
  res
    .status(501)
    .json({ message: 'Not Implemented - updateMealSelection needs update' });
};

// These handlers might need adjustment or be removed/replaced
export const getMealPlanSummary = async (req, res) => {
  res
    .status(501)
    .json({ message: 'Not Implemented - getMealPlanSummary needs update' });
};

export const getMealPlanByTdeeId = async (req, res) => {
  res
    .status(501)
    .json({ message: 'Not Implemented - getMealPlanByTdeeId needs update' });
};

export const deleteMealFoodEntry = async (req, res) => {
  try {
    const { foodEntryId } = req.params;
    const foodEntryIdInt = Number(foodEntryId);

    if (isNaN(foodEntryIdInt)) {
      return res
        .status(400)
        .json({ message: 'Food Entry ID must be a number' });
    }

    // Find the food entry to be deleted
    const foodEntryToDelete = await prisma.dailyMealFoodEntry.findUnique({
      where: { id: foodEntryIdInt },
      include: { mealHistory: true } // Include dailyMealHistory to update its calories
    });

    if (!foodEntryToDelete) {
      return res.status(404).json({ message: 'Food entry not found' });
    }

    const mealHistory = foodEntryToDelete.mealHistory;
    if (!mealHistory) {
      return res
        .status(500)
        .json({ message: 'Associated meal history not found' });
    }

    // Calculate calories to subtract based on whether it's a custom food or standard food
    let caloriesToSubtract = 0;
    if (foodEntryToDelete.isCustom) {
      caloriesToSubtract =
        foodEntryToDelete.customCalories * foodEntryToDelete.quantity;
    } else if (foodEntryToDelete.foodId) {
      // For standard food, fetch calories from the Food model if available
      const foodDetails = await prisma.food.findUnique({
        where: { id: foodEntryToDelete.foodId },
        select: { calories: true }
      });
      if (foodDetails) {
        caloriesToSubtract = foodDetails.calories * foodEntryToDelete.quantity;
      }
    }

    // Delete the food entry
    await prisma.dailyMealFoodEntry.delete({
      where: { id: foodEntryIdInt }
    });

    // Update total calories and remaining calories in DailyMealHistory
    const updatedHistory = await prisma.dailyMealHistory.update({
      where: { id: mealHistory.id },
      data: {
        totalCalories: { decrement: caloriesToSubtract },
        calorieRemaining: { increment: caloriesToSubtract } // Add back to remaining
      }
    });

    res.status(200).json({
      message: 'Food entry deleted successfully',
      totalCalories: updatedHistory.totalCalories,
      calorieRemaining: updatedHistory.calorieRemaining
    });
  } catch (error) {
    console.error('Error deleting meal food entry:', error);
    res.status(500).json({
      message: 'Error deleting meal food entry',
      error: error.message
    });
  }
};

export const updateMealFoodEntry = async (req, res) => {
  try {
    const { foodEntryId } = req.params;
    const { quantity } = req.body;

    const foodEntryIdInt = Number(foodEntryId);
    const quantityInt = Number(quantity);

    if (isNaN(foodEntryIdInt) || isNaN(quantityInt) || quantityInt <= 0) {
      return res
        .status(400)
        .json({ message: 'Invalid food entry ID or quantity' });
    }

    // Find the food entry to be updated
    const foodEntryToUpdate = await prisma.dailyMealFoodEntry.findUnique({
      where: { id: foodEntryIdInt },
      include: { mealHistory: true, food: true } // Include dailyMealHistory and food to update calories
    });

    if (!foodEntryToUpdate) {
      return res.status(404).json({ message: 'Food entry not found' });
    }

    const mealHistory = foodEntryToUpdate.mealHistory;
    if (!mealHistory) {
      return res
        .status(500)
        .json({ message: 'Associated meal history not found' });
    }

    // Calculate old calories for the food entry
    let oldCalories = 0;
    if (foodEntryToUpdate.isCustom) {
      oldCalories =
        foodEntryToUpdate.customCalories * foodEntryToUpdate.quantity;
    } else if (foodEntryToUpdate.food) {
      oldCalories =
        foodEntryToUpdate.food.calories * foodEntryToUpdate.quantity;
    }

    // Calculate new calories for the food entry based on the new quantity
    let newCalories = 0;
    if (foodEntryToUpdate.isCustom) {
      newCalories = foodEntryToUpdate.customCalories * quantityInt;
    } else if (foodEntryToUpdate.food) {
      newCalories = foodEntryToUpdate.food.calories * quantityInt;
    }

    // Update the food entry quantity
    const updatedFoodEntry = await prisma.dailyMealFoodEntry.update({
      where: { id: foodEntryIdInt },
      data: { quantity: quantityInt }
    });

    // Calculate the difference in calories
    const calorieDifference = newCalories - oldCalories;

    // Update total calories and remaining calories in DailyMealHistory
    const updatedHistory = await prisma.dailyMealHistory.update({
      where: { id: mealHistory.id },
      data: {
        totalCalories: { increment: calorieDifference },
        calorieRemaining: { decrement: calorieDifference } // Subtract from remaining
      }
    });

    res.status(200).json({
      message: 'Food entry updated successfully',
      data: updatedFoodEntry,
      totalCalories: updatedHistory.totalCalories,
      calorieRemaining: updatedHistory.calorieRemaining
    });
  } catch (error) {
    console.error('Error updating meal food entry:', error);
    res.status(500).json({
      message: 'Error updating meal food entry',
      error: error.message
    });
  }
};

export const deleteMealPlanHistoryByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { userId } = req.query; // userId harus disertakan dalam query

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Parse date string to Date object
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Find the meal history for the specified date
    const mealHistory = await prisma.dailyMealHistory.findFirst({
      where: {
        userId: Number(userId),
        date: {
          gte: targetDate,
          lt: nextDay
        }
      },
      include: {
        foods: true // Include all food entries to get total calories
      }
    });

    if (!mealHistory) {
      return res
        .status(404)
        .json({ message: 'No meal history found for the specified date' });
    }

    // Delete all food entries for this day
    await prisma.dailyMealFoodEntry.deleteMany({
      where: {
        mealHistoryId: mealHistory.id
      }
    });

    // Delete the meal history entry
    await prisma.dailyMealHistory.delete({
      where: {
        id: mealHistory.id
      }
    });

    res.status(200).json({
      message: 'Meal plan history deleted successfully for the specified date',
      deletedDate: targetDate
    });
  } catch (error) {
    console.error('Error deleting meal plan history:', error);
    res.status(500).json({
      message: 'Error deleting meal plan history',
      error: error.message
    });
  }
};
