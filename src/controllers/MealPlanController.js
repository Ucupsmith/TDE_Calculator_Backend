import {
  getMealPlanById,
  getMealPlansByUserId,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "../models/MealPlanModel.js";
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getMealPlan = async (req, res) => {
  try {
    const mealPlan = await getMealPlanById(req.params.id);
    if (!mealPlan)
      return res.status(404).json({ message: "Meal plan not found" });
    res.json(mealPlan);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meal plan" });
  }
};

export const getUserMealPlans = async (req, res) => {
  try {
    const mealPlans = await getMealPlansByUserId(req.params.userId);
    res.json(mealPlans);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meal plans" });
  }
};

export const createUserMealPlan = async (req, res) => {
  try {
    const { user_id, admin_id, goal, meal_details } = req.body;

    if (!user_id || !goal) {
      return res.status(400).json({ message: "User ID and goal are required" });
    }

    const mealPlanId = await createMealPlan(
      user_id,
      admin_id,
      goal,
      meal_details
    );

    res.status(201).json({ message: "Meal plan created", mealPlanId });
  } catch (error) {
    res.status(500).json({ message: "Error creating meal plan" });
  }
};

export const updateUserMealPlan = async (req, res) => {
  try {
    const { goal, meal_details } = req.body;
    const mealPlanId = req.params.id;

    const success = await updateMealPlan(mealPlanId, goal, meal_details);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Meal plan not found or no changes made" });
    }

    res.json({ message: "Meal plan updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating meal plan" });
  }
};

export const deleteUserMealPlan = async (req, res) => {
  try {
    const success = await deleteMealPlan(req.params.id);

    if (!success) {
      return res.status(404).json({ message: "Meal plan not found" });
    }

    res.json({ message: "Meal plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting meal plan" });
  }
};

// Get all menus
export const getAllMenus = async (req, res) => {
    try {
        const menus = await prisma.menu.findMany();
        res.json(menus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get user's meal selections for today
export const getUserMealSelections = async (req, res) => {
    try {
        const { userId, tdeeId } = req.params;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selections = await prisma.userMealSelection.findMany({
            where: {
                userId: parseInt(userId),
                tdeeId: parseInt(tdeeId),
                selected_date: {
                    gte: today
                }
            },
            include: {
                menu: true
            }
        });

        // Get TDEE calculation
        const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
            where: {
                tdeeId: parseInt(tdeeId)
            }
        });

        // Calculate remaining calories
        const totalCaloriesConsumed = selections.reduce((sum, selection) => sum + selection.menu.calories, 0);
        let remainingCalories = parseFloat(tdeeCalculation.tdee_result) - totalCaloriesConsumed;

        // Adjust calories based on goal
        if (tdeeCalculation.goal === 'GainWeight') {
            remainingCalories += 500;
        } else if (tdeeCalculation.goal === 'LoseWeight') {
            remainingCalories -= 500;
        }

        res.json({
            selections,
            remainingCalories,
            tdeeResult: tdeeCalculation.tdee_result,
            goal: tdeeCalculation.goal
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add meal selection
export const addMealSelection = async (req, res) => {
    try {
        const { userId, tdeeId, menuId, mealType } = req.body;

        const selection = await prisma.userMealSelection.create({
            data: {
                userId: parseInt(userId),
                tdeeId: parseInt(tdeeId),
                menuId: parseInt(menuId),
                meal_type: mealType
            },
            include: {
                menu: true
            }
        });

        // Get updated remaining calories
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selections = await prisma.userMealSelection.findMany({
            where: {
                userId: parseInt(userId),
                tdeeId: parseInt(tdeeId),
                selected_date: {
                    gte: today
                }
            },
            include: {
                menu: true
            }
        });

        const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
            where: {
                tdeeId: parseInt(tdeeId)
            }
        });

        const totalCaloriesConsumed = selections.reduce((sum, selection) => sum + selection.menu.calories, 0);
        let remainingCalories = parseFloat(tdeeCalculation.tdee_result) - totalCaloriesConsumed;

        if (tdeeCalculation.goal === 'GainWeight') {
            remainingCalories += 500;
        } else if (tdeeCalculation.goal === 'LoseWeight') {
            remainingCalories -= 500;
        }

        res.json({
            selection,
            remainingCalories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Remove meal selection
export const removeMealSelection = async (req, res) => {
    try {
        const { selectionId } = req.params;
        const { userId, tdeeId } = req.body;

        await prisma.userMealSelection.delete({
            where: {
                selectionId: parseInt(selectionId)
            }
        });

        // Get updated remaining calories
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selections = await prisma.userMealSelection.findMany({
            where: {
                userId: parseInt(userId),
                tdeeId: parseInt(tdeeId),
                selected_date: {
                    gte: today
                }
            },
            include: {
                menu: true
            }
        });

        const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
            where: {
                tdeeId: parseInt(tdeeId)
            }
        });

        const totalCaloriesConsumed = selections.reduce((sum, selection) => sum + selection.menu.calories, 0);
        let remainingCalories = parseFloat(tdeeCalculation.tdee_result) - totalCaloriesConsumed;

        if (tdeeCalculation.goal === 'GainWeight') {
            remainingCalories += 500;
        } else if (tdeeCalculation.goal === 'LoseWeight') {
            remainingCalories -= 500;
        }

        res.json({
            message: 'Meal selection removed successfully',
            remainingCalories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tambah menu makanan (khusus admin)
export const addMenuByAdmin = async (req, res) => {
    try {
        // (Opsi: validasi admin di sini, misal req.user.role === 'admin')
        const { name, calories, description, category, image_path } = req.body;
        if (!name || !calories || !category) {
            return res.status(400).json({ message: "Name, calories, and category are required" });
        }
        const menu = await prisma.menu.create({
            data: {
                name,
                calories: parseInt(calories),
                description: description || "",
                category,
                image_path: image_path || null
            }
        });
        res.status(201).json({ message: "Menu created", menu });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
