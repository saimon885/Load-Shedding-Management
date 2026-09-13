-- CreateEnum
CREATE TYPE "OutageType" AS ENUM ('SCHEDULED', 'UNEXPECTED');

-- CreateEnum
CREATE TYPE "OutageStatus" AS ENUM ('SCHEDULED', 'ONGOING', 'RESTORED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateTable
CREATE TABLE "outages" (
    "id" TEXT NOT NULL,
    "type" "OutageType" NOT NULL,
    "status" "OutageStatus" NOT NULL,
    "reason" TEXT NOT NULL,
    "feederId" TEXT NOT NULL,
    "areaId" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "estimatedRestorationTime" TIMESTAMP(3),
    "actualRestorationTime" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "outages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technicianAssigns" (
    "id" TEXT NOT NULL,
    "outageId" TEXT NOT NULL,
    "technicianId" TEXT NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "technicianAssigns_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outages" ADD CONSTRAINT "outages_feederId_fkey" FOREIGN KEY ("feederId") REFERENCES "feeders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outages" ADD CONSTRAINT "outages_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicianAssigns" ADD CONSTRAINT "technicianAssigns_outageId_fkey" FOREIGN KEY ("outageId") REFERENCES "outages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
