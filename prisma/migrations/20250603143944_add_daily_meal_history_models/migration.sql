-- CreateTable
CREATE TABLE `daily_meal_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `total_calories` DECIMAL(10, 2) NOT NULL,
    `calorie_remaining` DECIMAL(10, 2) NOT NULL,
    `caption` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `daily_meal_history_user_id_idx`(`user_id`),
    INDEX `daily_meal_history_tdee_id_idx`(`tdee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_meal_food_entries` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `daily_meal_history_id` INTEGER NOT NULL,
    `food_id` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `calories_per_unit` DECIMAL(10, 2) NOT NULL,
    `unit` VARCHAR(50) NOT NULL,
    `imageUrl` VARCHAR(255) NULL,
    `mealType` VARCHAR(50) NOT NULL,
    `quantity` DECIMAL(10, 2) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `daily_meal_food_entries_daily_meal_history_id_idx`(`daily_meal_history_id`),
    INDEX `daily_meal_food_entries_food_id_idx`(`food_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `daily_meal_history` ADD CONSTRAINT `daily_meal_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_meal_history` ADD CONSTRAINT `daily_meal_history_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_meal_food_entries` ADD CONSTRAINT `daily_meal_food_entries_daily_meal_history_id_fkey` FOREIGN KEY (`daily_meal_history_id`) REFERENCES `daily_meal_history`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
