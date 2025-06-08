-- DropForeignKey
ALTER TABLE `dailymealfoodentry` DROP FOREIGN KEY `DailyMealFoodEntry_mealHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `dailymealhistory` DROP FOREIGN KEY `DailyMealHistory_tdeeId_fkey`;

-- DropForeignKey
ALTER TABLE `dailymealhistory` DROP FOREIGN KEY `DailyMealHistory_userId_fkey`;

-- DropForeignKey
ALTER TABLE `meal_plans` DROP FOREIGN KEY `meal_plans_tdee_id_fkey`;

-- DropForeignKey
ALTER TABLE `savedprofile` DROP FOREIGN KEY `SavedProfile_tdee_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_meal_selections` DROP FOREIGN KEY `user_meal_selections_tdee_id_fkey`;

-- DropIndex
DROP INDEX `DailyMealHistory_tdeeId_fkey` ON `dailymealhistory`;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `savedprofile` ADD CONSTRAINT `SavedProfile_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_tdeeId_fkey` FOREIGN KEY (`tdeeId`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealFoodEntry` ADD CONSTRAINT `DailyMealFoodEntry_mealHistoryId_fkey` FOREIGN KEY (`mealHistoryId`) REFERENCES `DailyMealHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
