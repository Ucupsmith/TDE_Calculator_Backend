/*
  Warnings:

  - You are about to drop the column `menu_id` on the `user_meal_selections` table. All the data in the column will be lost.
  - Added the required column `remainingCalories` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedFoods` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalCalories` to the `user_meal_selections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_meal_selections` DROP FOREIGN KEY `user_meal_selections_menu_id_fkey`;

-- DropIndex
DROP INDEX `user_meal_selections_menu_id_fkey` ON `user_meal_selections`;

-- AlterTable
ALTER TABLE `user_meal_selections` DROP COLUMN `menu_id`,
    ADD COLUMN `menuMenuId` INTEGER NULL,
    ADD COLUMN `remainingCalories` DOUBLE NOT NULL,
    ADD COLUMN `selectedFoods` TEXT NOT NULL,
    ADD COLUMN `totalCalories` DOUBLE NOT NULL,
    MODIFY `meal_type` VARCHAR(50) NOT NULL DEFAULT 'regular';

-- AddForeignKey
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_menuMenuId_fkey` FOREIGN KEY (`menuMenuId`) REFERENCES `menus`(`menu_id`) ON DELETE SET NULL ON UPDATE CASCADE;
