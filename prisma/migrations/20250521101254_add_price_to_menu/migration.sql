-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `reset_token` VARCHAR(25) NULL,
    `reset_token_expiry` DATETIME NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tdee_calculations` (
    `tdee_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `saved_id` INTEGER NOT NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,
    `weight` DECIMAL(8, 2) NOT NULL,
    `height` DECIMAL(8, 2) NOT NULL,
    `age` INTEGER NOT NULL,
    `activity_level` ENUM('Sedentary', 'SlightlyActive', 'ModeratelyActive', 'VeryActive') NOT NULL,
    `goal` ENUM('Lose Weight', 'Maintain Weight', 'Gain Weight') NOT NULL,
    `tdee_result` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`tdee_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profiles` (
    `profile_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `birth_date` DATETIME NOT NULL,
    `birth_place` VARCHAR(255) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `phone_number` VARCHAR(12) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `avatar` VARCHAR(191) NULL,
    `gender` ENUM('Male', 'Female') NOT NULL,

    UNIQUE INDEX `profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`profile_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SavedProfile` (
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

    PRIMARY KEY (`saved_id`)
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
    `mealplan_id` INTEGER NOT NULL AUTO_INCREMENT,
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

    PRIMARY KEY (`mealplan_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Allergy` (
    `allergy_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`allergy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomAllergy` (
    `custom_allergy_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `name_alergy` VARCHAR(255) NOT NULL,
    `approval_id` INTEGER NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',

    PRIMARY KEY (`custom_allergy_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Approval` (
    `approval_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `custom_allergy_id` INTEGER NOT NULL,
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL,

    UNIQUE INDEX `Approval_custom_allergy_id_key`(`custom_allergy_id`),
    PRIMARY KEY (`approval_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminNotification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `admin_id` INTEGER NOT NULL,
    `custom_allergy_id` INTEGER NOT NULL,
    `notification_date` DATETIME NOT NULL,
    `message` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `notification_content` VARCHAR(255) NOT NULL,
    `notification_date` DATETIME NOT NULL,

    PRIMARY KEY (`notification_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CreateNotification` (
    `create_notification_id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminId` INTEGER NOT NULL,
    `notification_content` VARCHAR(255) NOT NULL,
    `notification_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`create_notification_id`)
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
    `status` ENUM('Pending', 'Approved', 'Rejected') NOT NULL DEFAULT 'Pending',
    `views` INTEGER NOT NULL DEFAULT 0,
    `likes` INTEGER NOT NULL DEFAULT 0,

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
    `menu_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `selected_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meal_type` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`selection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `payment_id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mealplanId` INTEGER NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
    `qris_url` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`payment_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tdee_calculations` ADD CONSTRAINT `tdee_calculations_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profiles` ADD CONSTRAINT `profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedProfile` ADD CONSTRAINT `SavedProfile_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SavedProfile` ADD CONSTRAINT `SavedProfile_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_plans` ADD CONSTRAINT `meal_plans_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomAllergy` ADD CONSTRAINT `CustomAllergy_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approval` ADD CONSTRAINT `Approval_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Approval` ADD CONSTRAINT `Approval_custom_allergy_id_fkey` FOREIGN KEY (`custom_allergy_id`) REFERENCES `CustomAllergy`(`custom_allergy_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNotification` ADD CONSTRAINT `AdminNotification_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AdminNotification` ADD CONSTRAINT `AdminNotification_custom_allergy_id_fkey` FOREIGN KEY (`custom_allergy_id`) REFERENCES `CustomAllergy`(`custom_allergy_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`profile_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CreateNotification` ADD CONSTRAINT `CreateNotification_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payments` ADD CONSTRAINT `payments_mealplanId_fkey` FOREIGN KEY (`mealplanId`) REFERENCES `meal_plans`(`mealplan_id`) ON DELETE SET NULL ON UPDATE CASCADE;
