/*
  Warnings:

  - The primary key for the `meal_plans` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mealplan_id` on the `meal_plans` table. All the data in the column will be lost.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menus` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_meal_selections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `meal_plans` to the `meal_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `number_phone` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `articles` DROP FOREIGN KEY `articles_author_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_mealplanId_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_userId_fkey`;

-- DropForeignKey
ALTER TABLE `user_meal_selections` DROP FOREIGN KEY `user_meal_selections_menu_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_meal_selections` DROP FOREIGN KEY `user_meal_selections_tdee_id_fkey`;

-- DropForeignKey
ALTER TABLE `user_meal_selections` DROP FOREIGN KEY `user_meal_selections_user_id_fkey`;

-- AlterTable
ALTER TABLE `meal_plans` DROP PRIMARY KEY,
    DROP COLUMN `mealplan_id`,
    ADD COLUMN `meal_plans` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`meal_plans`);

-- AlterTable
ALTER TABLE `users` ADD COLUMN `number_phone` VARCHAR(20) NOT NULL;

-- DropTable
DROP TABLE `articles`;

-- DropTable
DROP TABLE `menus`;

-- DropTable
DROP TABLE `payments`;

-- DropTable
DROP TABLE `user_meal_selections`;
