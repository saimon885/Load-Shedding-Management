-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- CreateTable
CREATE TABLE "outage_schedules" (
    "id" TEXT NOT NULL,
    "feederId" TEXT NOT NULL,
    "areaId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "reason" TEXT DEFAULT 'Routine Load Shedding',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outage_schedules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "outage_schedules" ADD CONSTRAINT "outage_schedules_feederId_fkey" FOREIGN KEY ("feederId") REFERENCES "feeders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outage_schedules" ADD CONSTRAINT "outage_schedules_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
