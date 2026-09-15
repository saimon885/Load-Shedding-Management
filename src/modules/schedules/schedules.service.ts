import { DayOfWeek } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import httpStatus from "http-status";
import { CreateShedulePayload } from "./schedules.interface";

const createScheduleService = async (payload: CreateShedulePayload) => {
  const { feederId, areaId, dayOfWeek, startTime, endTime, reason } = payload;

  const existingSchedule = await prisma.outageSchedule.findFirst({
    where: {
      areaId,
      dayOfWeek,
      isActive: true,
      OR: [
        {
          startTime: { lte: startTime },
          endTime: { gte: startTime },
        },
        {
          startTime: { lte: endTime },
          endTime: { gte: endTime },
        },
      ],
    },
  });

  if (existingSchedule) {
    throw new AppError(
      httpStatus.CONFLICT,
      `Schedule conflict! An active schedule already exists for this area on \({dayOfWeek} between\){existingSchedule.startTime} and ${existingSchedule.endTime}.`,
    );
  }

  const result = await prisma.outageSchedule.create({
    data: {
      feederId,
      areaId,
      dayOfWeek,
      startTime,
      endTime,
      reason,
    },
    include: {
      area: true,
      feeder: true,
    },
  });

  return result;
};

const getAllSchedulesService = async () => {
  return await prisma.outageSchedule.findMany({
    include: {
      area: true,
      feeder: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const sheduleService = {
  createScheduleService,
  getAllSchedulesService,
};
