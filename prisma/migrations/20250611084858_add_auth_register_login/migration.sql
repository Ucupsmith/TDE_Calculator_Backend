/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `dailymealhistory` DROP FOREIGN KEY `DailyMealHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `google_id` VARCHAR(191) NULL,
    MODIFY `password` VARCHAR(255) NULL,
    MODIFY `number_phone` VARCHAR(20) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_google_id_key` ON `users`(`google_id`);

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
