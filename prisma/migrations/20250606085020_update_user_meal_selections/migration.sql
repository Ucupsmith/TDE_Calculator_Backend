/*
  Warnings:

  - You are about to drop the column `remaining_calories` on the `user_meal_selections` table. All the data in the column will be lost.
  - You are about to drop the column `selected_foods` on the `user_meal_selections` table. All the data in the column will be lost.
  - You are about to drop the column `total_calories` on the `user_meal_selections` table. All the data in the column will be lost.
  - Added the required column `remainingCalories` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedFoods` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCalories` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user_meal_selections` DROP COLUMN `remaining_calories`,
    DROP COLUMN `selected_foods`,
    DROP COLUMN `total_calories`,
    ADD COLUMN `remainingCalories` DOUBLE NOT NULL,
    ADD COLUMN `selectedFoods` TEXT NOT NULL,
    ADD COLUMN `totalCalories` DOUBLE NOT NULL;
