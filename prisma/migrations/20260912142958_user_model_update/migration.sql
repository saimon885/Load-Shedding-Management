/*
  Warnings:

  - Made the column `profileImage` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "imagePublishedID" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "profileImage" SET NOT NULL,
ALTER COLUMN "profileImage" SET DEFAULT '';
