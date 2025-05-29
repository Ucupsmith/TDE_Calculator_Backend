/*
  Warnings:

  - You are about to drop the `adminnotification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `allergy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `approval` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customallergy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `adminnotification` DROP FOREIGN KEY `AdminNotification_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `adminnotification` DROP FOREIGN KEY `AdminNotification_custom_allergy_id_fkey`;

-- DropForeignKey
ALTER TABLE `approval` DROP FOREIGN KEY `Approval_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `approval` DROP FOREIGN KEY `Approval_custom_allergy_id_fkey`;

-- DropForeignKey
ALTER TABLE `customallergy` DROP FOREIGN KEY `CustomAllergy_profile_id_fkey`;

-- DropTable
DROP TABLE `adminnotification`;

-- DropTable
DROP TABLE `allergy`;

-- DropTable
DROP TABLE `approval`;

-- DropTable
DROP TABLE `customallergy`;

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
    `menu_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `selected_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meal_type` VARCHAR(50) NOT NULL,

    INDEX `user_meal_selections_menu_id_fkey`(`menu_id`),
    INDEX `user_meal_selections_tdee_id_fkey`(`tdee_id`),
    INDEX `user_meal_selections_user_id_fkey`(`user_id`),
    PRIMARY KEY (`selection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `articles` ADD CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `admins`(`admin_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_menu_id_fkey` FOREIGN KEY (`menu_id`) REFERENCES `menus`(`menu_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
