-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'INVESTIGATING', 'VERIFIED', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "outageReport" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "outageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outageReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outageReport" ADD CONSTRAINT "outageReport_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outageReport" ADD CONSTRAINT "outageReport_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outageReport" ADD CONSTRAINT "outageReport_outageId_fkey" FOREIGN KEY ("outageId") REFERENCES "outages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technicianAssigns" ADD CONSTRAINT "technicianAssigns_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
