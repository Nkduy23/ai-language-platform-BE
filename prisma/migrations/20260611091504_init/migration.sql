-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NULL,
    `role` ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_profiles` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `avatar_url` VARCHAR(191) NULL,
    `learning_lang` ENUM('EN', 'ZH', 'JA') NOT NULL DEFAULT 'EN',
    `current_level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL DEFAULT 'A1',
    `daily_goal_min` INTEGER NOT NULL DEFAULT 15,
    `timezone` VARCHAR(191) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    `streak_days` INTEGER NOT NULL DEFAULT 0,
    `total_xp` INTEGER NOT NULL DEFAULT 0,
    `last_active_at` DATETIME(3) NULL,

    UNIQUE INDEX `user_profiles_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `plan` ENUM('FREE', 'PREMIUM', 'PRO') NOT NULL DEFAULT 'FREE',
    `status` ENUM('ACTIVE', 'CANCELLED', 'EXPIRED') NOT NULL DEFAULT 'ACTIVE',
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires_at` DATETIME(3) NULL,
    `stripe_customer_id` VARCHAR(191) NULL,
    `stripe_sub_id` VARCHAR(191) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subscriptions_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `languages` (
    `id` VARCHAR(191) NOT NULL,
    `code` ENUM('EN', 'ZH', 'JA') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `flag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `languages_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vocabulary_cards` (
    `id` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `word` VARCHAR(191) NOT NULL,
    `pronunciation` VARCHAR(191) NULL,
    `meaning_vi` TEXT NOT NULL,
    `meaning_en` TEXT NULL,
    `example_sentence` TEXT NULL,
    `image_url` VARCHAR(191) NULL,
    `audio_url` VARCHAR(191) NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL DEFAULT 'A1',
    `topic_tags` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vocabulary_favorites` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `card_id` VARCHAR(191) NOT NULL,
    `saved_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `vocabulary_favorites_user_id_card_id_key`(`user_id`, `card_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grammar_lessons` (
    `id` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL DEFAULT 'A1',
    `order_index` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_questions` (
    `id` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `type` ENUM('MULTIPLE_CHOICE', 'FILL_BLANK', 'ARRANGE', 'LISTENING') NOT NULL DEFAULT 'MULTIPLE_CHOICE',
    `question` TEXT NOT NULL,
    `options` JSON NULL,
    `correct_ans` TEXT NOT NULL,
    `explanation` TEXT NULL,
    `audio_url` VARCHAR(191) NULL,
    `level` ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') NOT NULL DEFAULT 'A1',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finished_at` DATETIME(3) NULL,
    `score` DECIMAL(5, 2) NULL,
    `xp_earned` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `quiz_answers` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `question_id` VARCHAR(191) NOT NULL,
    `answer` TEXT NOT NULL,
    `is_correct` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `topic` ENUM('DAILY', 'TRAVEL', 'BUSINESS', 'INTERVIEW') NOT NULL DEFAULT 'DAILY',
    `started_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ended_at` DATETIME(3) NULL,
    `msg_count` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `role` ENUM('USER', 'ASSISTANT') NOT NULL,
    `content` TEXT NOT NULL,
    `grammar_note` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `speaking_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `original_text` TEXT NULL,
    `user_audio_url` VARCHAR(191) NOT NULL,
    `transcribed` TEXT NULL,
    `score_pronun` DECIMAL(5, 2) NULL,
    `score_grammar` DECIMAL(5, 2) NULL,
    `score_fluency` DECIMAL(5, 2) NULL,
    `score_vocab` DECIMAL(5, 2) NULL,
    `feedback` JSON NULL,
    `model_audio_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_progress` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `resource_id` VARCHAR(191) NOT NULL,
    `type` ENUM('VOCABULARY', 'GRAMMAR', 'QUIZ', 'SPEAKING', 'CHAT') NOT NULL,
    `status` ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') NOT NULL DEFAULT 'NOT_STARTED',
    `score` DECIMAL(5, 2) NULL,
    `xp_earned` INTEGER NOT NULL DEFAULT 0,
    `completed_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_progress_user_id_resource_id_type_key`(`user_id`, `resource_id`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vocabulary_cards` ADD CONSTRAINT `vocabulary_cards_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vocabulary_favorites` ADD CONSTRAINT `vocabulary_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vocabulary_favorites` ADD CONSTRAINT `vocabulary_favorites_card_id_fkey` FOREIGN KEY (`card_id`) REFERENCES `vocabulary_cards`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grammar_lessons` ADD CONSTRAINT `grammar_lessons_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_questions` ADD CONSTRAINT `quiz_questions_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_sessions` ADD CONSTRAINT `quiz_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `quiz_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quiz_answers` ADD CONSTRAINT `quiz_answers_question_id_fkey` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_sessions` ADD CONSTRAINT `chat_sessions_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_sessions` ADD CONSTRAINT `speaking_sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `speaking_sessions` ADD CONSTRAINT `speaking_sessions_language_id_fkey` FOREIGN KEY (`language_id`) REFERENCES `languages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_progress` ADD CONSTRAINT `user_progress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
