/*
  Warnings:

  - You are about to drop the column `profile_id` on the `tdee_calculations` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `tdee_calculations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `tdee_calculations` DROP FOREIGN KEY `tdee_calculations_profile_id_fkey`;

-- DropIndex
DROP INDEX `tdee_calculations_profile_id_fkey` ON `tdee_calculations`;

-- AlterTable
ALTER TABLE `tdee_calculations` DROP COLUMN `profile_id`,
    ADD COLUMN `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `tdee_calculations` ADD CONSTRAINT `tdee_calculations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
