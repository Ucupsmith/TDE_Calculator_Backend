-- DropForeignKey
ALTER TABLE `dailymealhistory` DROP FOREIGN KEY `DailyMealHistory_userId_fkey`;

-- AddForeignKey
ALTER TABLE `DailyMealHistory` ADD CONSTRAINT `DailyMealHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
