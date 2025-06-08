/*
  Warnings:

  - You are about to drop the `daily_meal_food_entries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `daily_meal_history` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `daily_meal_food_entries` DROP FOREIGN KEY `daily_meal_food_entries_daily_meal_history_id_fkey`;

-- DropForeignKey
ALTER TABLE `daily_meal_history` DROP FOREIGN KEY `daily_meal_history_tdee_id_fkey`;

-- DropForeignKey
ALTER TABLE `daily_meal_history` DROP FOREIGN KEY `daily_meal_history_user_id_fkey`;

-- DropTable
DROP TABLE `daily_meal_food_entries`;

-- DropTable
DROP TABLE `daily_meal_history`;

-- CreateTable
CREATE TABLE `DailyMealHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `tdeeId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalCalories` DOUBLE NOT NULL,
    `calorieRemaining` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyMealHistory_userId_date_idx`(`userId`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DailyMealFoodEntry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mealHistoryId` INTEGER NOT NULL,
    `foodId` INTEGER NULL,
    `quantity` DOUBLE NOT NULL,
    `isCustom` BOOLEAN NOT NULL DEFAULT false,
    `customName` VARCHAR(191) NULL,
    `customCalories` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DailyMealFoodEntry_mealHistoryId_idx`(`mealHistoryId`),
    INDEX `DailyMealFoodEntry_foodId_idx`(`foodId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_tdeeId_fkey` FOREIGN KEY (`tdeeId`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealFoodEntry` ADD CONSTRAINT `DailyMealFoodEntry_mealHistoryId_fkey` FOREIGN KEY (`mealHistoryId`) REFERENCES `DailyMealHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealFoodEntry` ADD CONSTRAINT `DailyMealFoodEntry_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
