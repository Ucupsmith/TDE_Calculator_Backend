-- AlterTable
ALTER TABLE `profiles` MODIFY `full_name` VARCHAR(255) NULL,
    MODIFY `birth_date` DATETIME(0) NULL,
    MODIFY `birth_place` VARCHAR(255) NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `gender` ENUM('Male', 'Female') NULL;
