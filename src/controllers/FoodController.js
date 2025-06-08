import {
  getAllFoods,
  getFoodByName,
  calculateTotalCalories,
  calculateRemainingCalories
} from '../models/FoodModel.js';
import prisma from '../../prisma/prismaClient.js';

// Get all available foods
export const getAllFoodsController = (req, res) => {
  try {
    const foods = getAllFoods();
    res.json(foods);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching foods', error: error.message });
  }
};

// Get food by name
export const getFoodByNameController = (req, res) => {
  try {
    const { name } = req.params;
    const food = getFoodByName(name);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching food', error: error.message });
  }
};

// Get available foods for meal plan
export const getMealPlanFoodsController = (req, res) => {
  try {
    const foods = getAllFoods();

    // Group foods by name to handle multiple portions
    const groupedFoods = foods.reduce((acc, food) => {
      if (!acc[food.name]) {
        acc[food.name] = {
          name: food.name,
          imageUrl: food.imageUrl,
          portions: []
        };
      }

      acc[food.name].portions.push({
        unit: food.unit,
        calories: food.calories
      });

      return acc;
    }, {});

    // Convert to array and sort by name
    const formattedFoods = Object.values(groupedFoods).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.json(formattedFoods);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching meal plan foods',
      error: error.message
    });
  }
};

// Calculate total calories for selected foods
export const calculateTotalCaloriesController = (req, res) => {
  try {
    const { selectedFoods } = req.body;
    if (!selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({ message: 'Invalid selected foods data' });
    }
    const totalCalories = calculateTotalCalories(selectedFoods);
    res.json({ totalCalories });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error calculating calories', error: error.message });
  }
};

// Calculate remaining calories based on TDEE and selected foods
export const calculateRemainingCaloriesController = (req, res) => {
  try {
    const { tdee, selectedFoods } = req.body;
    if (!tdee || !selectedFoods || !Array.isArray(selectedFoods)) {
      return res.status(400).json({ message: 'Invalid input data' });
    }
    const remainingCalories = calculateRemainingCalories(tdee, selectedFoods);
    res.json({ remainingCalories });
  } catch (error) {
    res.status(500).json({
      message: 'Error calculating remaining calories',
      error: error.message
    });
  }
};

// Add custom food to meal plan
export const addCustomFoodController = (req, res) => {
  try {
    const { name, calories, quantity = 1 } = req.body;

    // Validate required fields
    if (!name || calories === undefined) {
      return res.status(400).json({
        message: 'Missing required fields. Required: name, calories, unit'
      });
    }

    // Validate data types
    if (typeof name !== 'string' || typeof calories !== 'number') {
      return res.status(400).json({
        message:
          'Invalid data types. name and unit should be strings, calories should be a number'
      });
    }

    // Validate calories is positive
    if (calories < 0) {
      return res.status(400).json({
        message: 'Calories cannot be negative'
      });
    }

    // Create custom food object
    const customFood = {
      name,
      calories: calories * quantity, // Total calories based on quantity
      quantity,
      isCustom: true // Flag to identify custom foods
    };

    res.status(201).json({
      message: 'Custom food added successfully',
      data: customFood
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding custom food',
      error: error.message
    });
  }
};

// Get user's custom foods
export const getUserCustomFoodsController = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: 'userId is required' });
    }

    // Query meal selections for the user
    const mealSelections = await prisma.userMealSelection.findMany({
      where: { userId: Number(userId) },
      orderBy: { selected_date: 'desc' }
    });

    // Extract and flatten all custom foods from meal selections
    let customFoods = [];
    mealSelections.forEach((selection) => {
      const foods = JSON.parse(selection.selectedFoods || '[]');
      foods.forEach((food) => {
        if (food.isCustom) {
          customFoods.push(food);
        }
      });
    });

    // Remove duplicates by name, unit, and calories
    const uniqueCustomFoods = [];
    const seen = new Set();
    customFoods.forEach((food) => {
      const key = `${food.name}|${food.unit}|${food.calories}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueCustomFoods.push(food);
      }
    });

    // Map to desired format
    const mappedFoods = uniqueCustomFoods.map((food) => ({
      name: food.name,
      calories: food.calories,
      quantity: food.quantity,
      isCustom: true
    }));

    res.json({
      message: 'Custom foods fetched successfully',
      data: mappedFoods
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching custom foods',
      error: error.message
    });
  }
};

export const deleteUserCustomFoodController = async (req, res) => {
  try {
    const { userId, name, unit, calories } = req.body;
    if (!userId || !name || !unit || calories === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mealSelections = await prisma.userMealSelection.findMany({
      where: { userId: Number(userId) }
    });

    let updatedCount = 0;
    for (const selection of mealSelections) {
      let foods = JSON.parse(selection.selectedFoods || '[]');
      const originalLength = foods.length;
      foods = foods.filter(
        (food) =>
          !(
            food.isCustom &&
            food.name === name &&
            food.unit === unit &&
            food.calories === calories
          )
      );
      if (foods.length !== originalLength) {
        await prisma.userMealSelection.update({
          where: { id: selection.id },
          data: { selectedFoods: JSON.stringify(foods) }
        });
        updatedCount++;
      }
    }

    res.json({
      message: 'Custom food deleted successfully',
      updatedSelections: updatedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting custom food',
      error: error.message
    });
  }
};

export const updateUserCustomFoodController = async (req, res) => {
  try {
    const {
      userId,
      oldName,
      oldUnit,
      oldCalories,
      newName,
      newUnit,
      newCalories
    } = req.body;
    if (
      !userId ||
      !oldName ||
      !oldUnit ||
      oldCalories === undefined ||
      !newName ||
      !newUnit ||
      newCalories === undefined
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mealSelections = await prisma.userMealSelection.findMany({
      where: { userId: Number(userId) }
    });

    let updatedCount = 0;
    for (const selection of mealSelections) {
      let foods = JSON.parse(selection.selectedFoods || '[]');
      let changed = false;
      foods = foods.map((food) => {
        if (
          food.isCustom &&
          food.name === oldName &&
          food.unit === oldUnit &&
          food.calories === oldCalories
        ) {
          changed = true;
          return {
            ...food,
            name: newName,
            unit: newUnit,
            calories: newCalories
          };
        }
        return food;
      });
      if (changed) {
        await prisma.userMealSelection.update({
          where: { id: selection.id },
          data: { selectedFoods: JSON.stringify(foods) }
        });
        updatedCount++;
      }
    }

    res.json({
      message: 'Custom food updated successfully',
      updatedSelections: updatedCount
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating custom food',
      error: error.message
    });
  }
};
