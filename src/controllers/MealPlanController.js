const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create new meal plan
const createMealPlan = async (req, res) => {
    try {
        const { userId, tdeeId, profileId, goal } = req.body;
        
        // Get TDEE result
        const tdeeCalculation = await prisma.tdeeCalculation.findUnique({
            where: { tdeeId: parseInt(tdeeId) }
        });

        if (!tdeeCalculation) {
            return res.status(404).json({ message: 'TDEE calculation not found' });
        }

        let totalCalories = parseInt(tdeeCalculation.tdee_result);
        let remainingCalories = totalCalories;

        // Adjust calories based on goal
        if (goal === 'LoseWeight') {
            totalCalories -= 500;
            remainingCalories = totalCalories;
        } else if (goal === 'GainWeight') {
            totalCalories += 500;
            remainingCalories = totalCalories;
        }

        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: parseInt(userId),
                tdeeId: parseInt(tdeeId),
                profileId: parseInt(profileId),
                goal,
                total_calories: totalCalories,
                remaining_calories: remainingCalories,
                selected_foods: [],
                status: 'pending'
            }
        });

        res.status(201).json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all meal plans for a user
const getUserMealPlans = async (req, res) => {
    try {
        const { userId } = req.params;
        const mealPlans = await prisma.mealPlan.findMany({
            where: {
                userId: parseInt(userId)
            },
            include: {
                tdeeCalculation: true
            }
        });
        res.json(mealPlans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a specific meal plan
const getMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const mealPlan = await prisma.mealPlan.findUnique({
            where: {
                mealplanId: parseInt(id)
            },
            include: {
                tdeeCalculation: true
            }
        });
        
        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }
        
        res.json(mealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update meal plan with selected food
const updateUserMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { food } = req.body;

        const mealPlan = await prisma.mealPlan.findUnique({
            where: {
                mealplanId: parseInt(id)
            }
        });

        if (!mealPlan) {
            return res.status(404).json({ message: 'Meal plan not found' });
        }

        // Update selected foods and remaining calories
        const selectedFoods = mealPlan.selected_foods || [];
        selectedFoods.push(food);

        const remainingCalories = mealPlan.remaining_calories - food.calories;

        const updatedMealPlan = await prisma.mealPlan.update({
            where: {
                mealplanId: parseInt(id)
            },
            data: {
                selected_foods: selectedFoods,
                remaining_calories: remainingCalories
            }
        });

        res.json(updatedMealPlan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete meal plan
const deleteUserMealPlan = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.mealPlan.delete({
            where: {
                mealplanId: parseInt(id)
            }
        });

        res.json({ message: 'Meal plan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createMealPlan,
    getUserMealPlans,
    getMealPlan,
    updateUserMealPlan,
    deleteUserMealPlan
};
