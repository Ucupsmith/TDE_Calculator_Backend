import {
  getMealPlanById,
  getMealPlansByUserId,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
} from "../models/MealPlanModel.js";

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
