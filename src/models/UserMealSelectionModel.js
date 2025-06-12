import prisma from '../../prisma/prismaClient.js';
import { calculateTotalCalories } from './FoodModel.js';

export const createUserMealSelection = async (data) => {
  const { userId, tdeeId, selectedFoods, date } = data;

  // Get current TDEE
  const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
    where: { tdeeId: tdeeId }
  });

  if (!tdeeCalculation) {
    throw new Error('TDEE calculation not found');
  }

  // Get the start of the day for the given date
  const currentDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(currentDate);
  startOfDay.setHours(0, 0, 0, 0);

  // Get the end of the day
  const endOfDay = new Date(currentDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Check if there are any selections for today
  const todaySelections = await prisma.userMealSelection.findMany({
    where: {
      userId,
      tdeeId,
      selected_date: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });

  // Calculate total calories from selected foods
  const totalCalories = calculateTotalCalories(selectedFoods);

  // If this is the first selection of the day, use full TDEE
  // Otherwise, use remaining calories from last selection
  let remainingCalories;
  if (todaySelections.length === 0) {
    remainingCalories = tdeeCalculation.tdee_result - totalCalories;
  } else {
    const lastSelection = todaySelections[todaySelections.length - 1];
    remainingCalories = lastSelection.remainingCalories - totalCalories;
  }

  // Create meal selection record
  const mealSelection = await prisma.userMealSelection.create({
    data: {
      userId,
      tdeeId,
      selectedFoods: JSON.stringify(selectedFoods),
      totalCalories,
      remainingCalories,
      selected_date: currentDate,
      meal_type: 'regular'
    }
  });

  return {
    ...mealSelection,
    selectedFoods: JSON.parse(mealSelection.selectedFoods)
  };
};

export const getCurrentDayCalories = async (userId, tdeeId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }

  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Find the DailyMealHistory for today for the given user
  const dailyMealHistory = await prisma.dailyMealHistory.findFirst({
    where: {
      userId: Number(userId),
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      tdee: true, // Include TDEE calculation to get tdee_result
    },
  });

  if (!dailyMealHistory) {
    // If no meal history for today, fetch the latest TDEE result for this user
    const userTdee = await prisma.tdeeCalculation.findFirst({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });

    if (!userTdee) {
      return { totalCalories: 0, remainingCalories: 0, tdeeGoal: 0, goal: 'N/A', isNewDay: true };
    }

    return {
      totalCalories: 0,
      remainingCalories: Math.ceil(userTdee.tdee_result),
      tdeeGoal: Math.ceil(userTdee.tdee_result),
      goal: userTdee.goal,
      isNewDay: true,
    };
  }

  // If meal history exists, return its values
  return {
    totalCalories: dailyMealHistory.totalCalories,
    remainingCalories: dailyMealHistory.calorieRemaining,
    tdeeGoal: dailyMealHistory.tdee?.tdee_result ?? 0,
    goal: dailyMealHistory.tdee?.goal ?? 'N/A',
    isNewDay: false,
  };
};

export const getUserMealSelections = async (userId, tdeeId) => {
  const selections = await prisma.userMealSelection.findMany({
    where: {
      userId,
      tdeeId
    },
    orderBy: {
      date: 'desc'
    }
  });

  return selections.map((selection) => ({
    ...selection,
    selectedFoods: JSON.parse(selection.selectedFoods)
  }));
};

export const getMealSelectionsByDate = async (userId, tdeeId, date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);

  const selections = await prisma.userMealSelection.findMany({
    where: {
      userId,
      tdeeId,
      date: {
        gte: startDate,
        lte: endDate
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  return selections.map((selection) => ({
    ...selection,
    selectedFoods: JSON.parse(selection.selectedFoods)
  }));
};

export const getLatestMealSelection = async (userId, tdeeId) => {
  const selection = await prisma.userMealSelection.findFirst({
    where: {
      userId,
      tdeeId
    },
    orderBy: {
      date: 'desc'
    }
  });

  if (!selection) {
    return null;
  }

  return {
    ...selection,
    selectedFoods: JSON.parse(selection.selectedFoods)
  };
};
