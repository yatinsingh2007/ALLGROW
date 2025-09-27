/*
  Warnings:

  - You are about to drop the `SolvedQuesitions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SolvedQuesitions` DROP FOREIGN KEY `SolvedQuesitions_questionId_fkey`;

-- DropForeignKey
ALTER TABLE `SolvedQuesitions` DROP FOREIGN KEY `SolvedQuesitions_userId_fkey`;

-- DropTable
DROP TABLE `SolvedQuesitions`;

-- CreateTable
CREATE TABLE `SolvedQuestions` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `questionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `SolvedQuestions_userId_questionId_key`(`userId`, `questionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolvedQuestions` ADD CONSTRAINT `SolvedQuestions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolvedQuestions` ADD CONSTRAINT `SolvedQuestions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
