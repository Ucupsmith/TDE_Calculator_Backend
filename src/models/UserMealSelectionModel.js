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
      date: {
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
      date: currentDate
    }
  });

  return {
    ...mealSelection,
    selectedFoods: JSON.parse(mealSelection.selectedFoods)
  };
};

export const getCurrentDayCalories = async (userId, tdeeId) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  // Get TDEE calculation
  const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
    where: { tdeeId: tdeeId }
  });

  if (!tdeeCalculation) {
    throw new Error('TDEE calculation not found');
  }

  // Get today's selections
  const todaySelections = await prisma.userMealSelection.findMany({
    where: {
      userId,
      tdeeId,
      date: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    orderBy: {
      date: 'desc'
    }
  });

  // If no selections today, return full TDEE
  if (todaySelections.length === 0) {
    return {
      totalCalories: 0,
      remainingCalories: tdeeCalculation.tdee_result,
      isNewDay: true
    };
  }

  // Return the latest selection's data
  const latestSelection = todaySelections[0];
  return {
    totalCalories: latestSelection.totalCalories,
    remainingCalories: latestSelection.remainingCalories,
    isNewDay: false
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
