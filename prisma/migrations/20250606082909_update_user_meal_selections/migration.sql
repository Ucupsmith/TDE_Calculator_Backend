-- First, drop the existing table if it exists
DROP TABLE IF EXISTS `user_meal_selections`;

-- Create the new table with the updated schema
CREATE TABLE `user_meal_selections` (
    `selection_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tdee_id` INTEGER NOT NULL,
    `selected_foods` TEXT NOT NULL,
    `total_calories` FLOAT NOT NULL,
    `remaining_calories` FLOAT NOT NULL,
    `selected_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `meal_type` VARCHAR(50) NOT NULL DEFAULT 'regular',

    INDEX `user_meal_selections_tdee_id_fkey`(`tdee_id`),
    INDEX `user_meal_selections_user_id_fkey`(`user_id`),
    PRIMARY KEY (`selection_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_tdee_id_fkey` FOREIGN KEY (`tdee_id`) REFERENCES `tdee_calculations`(`tdee_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `user_meal_selections` ADD CONSTRAINT `user_meal_selections_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;