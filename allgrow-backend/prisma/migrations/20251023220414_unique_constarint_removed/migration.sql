-- DropForeignKey
ALTER TABLE `Submissions` DROP FOREIGN KEY `Submissions_userId_fkey`;

-- DropIndex
DROP INDEX `Submissions_userId_questionId_key` ON `Submissions`;

-- AddForeignKey
ALTER TABLE `Submissions` ADD CONSTRAINT `Submissions_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Questions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
