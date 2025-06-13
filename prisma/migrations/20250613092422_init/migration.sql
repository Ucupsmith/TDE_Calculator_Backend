-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NULL,
    `email` VARCHAR(255) NOT NULL,
    `google_id` VARCHAR(191) NULL,
    `reset_token` VARCHAR(40) NULL,
    `reset_token_expiry` DATETIME(0) NULL,
    `number_phone` VARCHAR(20) NULL,

    UNIQUE INDEX `users_google_id_key`(`google_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tdee_calculations` (
    `tdee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `goal` ENUM('Lose Weight', 'Maintain Weight', 'Gain Weight') NOT NULL,
    `tdee_result` DECIMAL(65, 30) NOT NULL,
    `activity_level` ENUM('Sedentary', 'SlightlyActive', 'ModeratelyActive', 'VeryActive') NOT NULL,
    `age` INTEGER NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `height` DECIMAL(8, 2) NOT NULL,
    `saved_id` INTEGER NOT NULL,
    `weight` DECIMAL(8, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`tdee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `profile_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `full_name` VARCHAR(255) NULL,
    `birth_date` DATETIME(0) NULL,
    `birth_place` VARCHAR(255) NULL,
    `address` VARCHAR(255) NULL,
    `phone_number` VARCHAR(12) NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `gender` ENUM('Male', 'Female') NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admins` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` INTEGER NOT NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_plans` (
    `user_id` INTEGER NOT NULL,
    `admin_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `profile_id` INTEGER NOT NULL,
    `goal` ENUM('Lose Weight', 'Maintain Weight', 'Gain Weight') NOT NULL,
    `meal_details` VARCHAR(191) NULL,
    `breakfast` VARCHAR(255) NOT NULL,
    `lunch` VARCHAR(255) NOT NULL,
    `dinner` VARCHAR(255) NOT NULL,
    `vegan` VARCHAR(255) NOT NULL,
    `glutten_free` VARCHAR(255) NOT NULL,
    `low_carb` VARCHAR(255) NOT NULL,
    `meal_plans` INTEGER NOT NULL AUTO_INCREMENT,

    INDEX `meal_plans_admin_id_fkey`(`admin_id`),
    INDEX `meal_plans_profile_id_fkey`(`profile_id`),
    INDEX `meal_plans_tdee_id_fkey`(`tdee_id`),
    INDEX `meal_plans_user_id_fkey`(`user_id`),
    PRIMARY KEY (`meal_plans`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articles` (
    `article_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `image_path` VARCHAR(255) NULL,
    `category` VARCHAR(255) NOT NULL,
    `author_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `status` ENUM('Pending', 'Published', 'Rejected') NOT NULL DEFAULT 'Pending',
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,

    INDEX `articles_author_id_fkey`(`author_id`),
    PRIMARY KEY (`article_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `menus` (
    `menu_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `calories` INTEGER NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `description` TEXT NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `image_path` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`menu_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_meal_selections` (
    `selection_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `selectedFoods` TEXT NOT NULL,
    `totalCalories` DOUBLE NOT NULL,
    `remainingCalories` DOUBLE NOT NULL,
    `selected_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meal_type` VARCHAR(50) NOT NULL DEFAULT 'regular',

    INDEX `user_meal_selections_tdee_id_fkey`(`tdee_id`),
    INDEX `user_meal_selections_user_id_fkey`(`user_id`),
    PRIMARY KEY (`selection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `createnotification` (
    `create_notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `notification_content` VARCHAR(255) NOT NULL,
    `notification_date` DATETIME(3) NOT NULL,

    INDEX `CreateNotification_adminId_fkey`(`adminId`),
    PRIMARY KEY (`create_notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `notification_content` VARCHAR(255) NOT NULL,
    `notification_date` DATETIME(0) NOT NULL,

    INDEX `Notification_profile_id_fkey`(`profile_id`),
    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `savedprofile` (
    `saved_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `tdee_result` DECIMAL(65, 30) NOT NULL,
    `bmi_score` DECIMAL(8, 2) NOT NULL,
    `bmr_score` DECIMAL(8, 2) NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `weight` DECIMAL(8, 2) NOT NULL,
    `height` DECIMAL(8, 2) NOT NULL,
    `age` INTEGER NOT NULL,
    `activity_level` ENUM('Sedentary', 'SlightlyActive', 'ModeratelyActive', 'VeryActive') NOT NULL,

    INDEX `SavedProfile_profile_id_fkey`(`profile_id`),
    INDEX `SavedProfile_tdee_id_fkey`(`tdee_id`),
    PRIMARY KEY (`saved_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `calories` INTEGER NOT NULL,
    `unit` VARCHAR(191) NOT NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
ALTER TABLE `tdee_calculations` ADD CONSTRAINT `tdee_calculations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `createnotification` ADD CONSTRAINT `CreateNotification_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notification` ADD CONSTRAINT `Notification_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `savedprofile` ADD CONSTRAINT `SavedProfile_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `savedprofile` ADD CONSTRAINT `SavedProfile_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_tdeeId_fkey` FOREIGN KEY (`tdeeId`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealFoodEntry` ADD CONSTRAINT `DailyMealFoodEntry_mealHistoryId_fkey` FOREIGN KEY (`mealHistoryId`) REFERENCES `DailyMealHistory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DailyMealFoodEntry` ADD CONSTRAINT `DailyMealFoodEntry_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `food`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
