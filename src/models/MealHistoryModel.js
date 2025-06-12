import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fetches meal history for a specific user from the database.
 * Includes associated food entries and TDEE calculation result.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} A promise that resolves to an array of meal history entries.
 */
const getMealHistoryForUser = async (userId) => {
  try {
    const mealHistory = await prisma.dailyMealHistory.findMany({
      where: {
        userId: userId,
      },
      include: {
        foods: {
          // Include specific fields from DailyMealFoodEntry and the related food
          select: {
            id: true, // ID of the entry in DailyMealFoodEntry
            quantity: true,
            isCustom: true,
            customName: true,
            customCalories: true,
            food: { // Include the related food details if not custom
              select: {
                id: true,
                name: true,
                calories: true,
                unit: true,
                imageUrl: true,
              },
            }
          },
        },
        tdee: { // Include the related TDEE calculation
          select: {
            tdee_result: true,
          },
        }
      },
      orderBy: {
        date: 'desc', // Order by date descending (most recent first)
      },
    });

    // Map the data to match the frontend's expected structure (optional but good practice)
    const formattedHistory = mealHistory.map(entry => {
      console.log('Debug - raw entry.totalCalories:', entry.totalCalories);
      console.log('Debug - raw entry.calorieRemaining:', entry.calorieRemaining);
      console.log('Debug - raw entry.tdee?.tdee_result:', entry.tdee?.tdee_result);

      return ({
        id: entry.id,
        date: entry.date, // Keep as Date object or format as needed by frontend
        totalCalories: Math.ceil(entry.totalCalories.toNumber()),
        calorieRemaining: Math.ceil(entry.calorieRemaining.toNumber()),
        tdeeResult: Math.ceil(entry.tdee ? entry.tdee.tdee_result.toNumber() : 0),
        foods: entry.foods.map(foodEntry => ({
          // Structure matching the frontend's MealHistoryFood interface
          id: foodEntry.food ? foodEntry.food.id : null, // Use food ID if available
          name: foodEntry.isCustom ? foodEntry.customName : foodEntry.food.name,
          calories: Math.ceil(foodEntry.isCustom ? (foodEntry.customCalories?.toNumber() ?? 0) : (foodEntry.food?.calories?.toNumber() ?? 0)),
          unit: foodEntry.isCustom ? null : foodEntry.food.unit, // Unit only for non-custom food
          imageUrl: foodEntry.isCustom ? null : foodEntry.food.imageUrl, // Image only for non-custom food
          quantity: foodEntry.quantity,
          isCustom: foodEntry.isCustom, // Include isCustom flag
        })),
      });
    });

    return formattedHistory;
  } catch (error) {
    console.error('Error fetching meal history:', error);
    throw new Error('Could not fetch meal history');
  }
};

export { getMealHistoryForUser }; 