-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- AlterTable
ALTER TABLE "areas" ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'LOW';
