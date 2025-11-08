/*
  Warnings:

  - Changed the type of `difficulty` on the `Questions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "public"."Questions" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "public"."Difficulty" NOT NULL;
