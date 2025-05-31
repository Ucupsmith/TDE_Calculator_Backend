/*
  Warnings:

  - Made the column `full_name` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_date` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birth_place` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `profiles` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `profiles` MODIFY `full_name` VARCHAR(255) NOT NULL,
    MODIFY `birth_date` DATETIME(0) NOT NULL,
    MODIFY `birth_place` VARCHAR(255) NOT NULL,
    MODIFY `address` VARCHAR(255) NOT NULL,
    MODIFY `gender` ENUM('Male', 'Female') NOT NULL;
