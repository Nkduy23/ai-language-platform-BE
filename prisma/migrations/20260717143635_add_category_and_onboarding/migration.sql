-- AlterTable
ALTER TABLE `grammar_lessons` ADD COLUMN `category` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `user_profiles` ADD COLUMN `onboarding_completed_at` DATETIME(3) NULL;
