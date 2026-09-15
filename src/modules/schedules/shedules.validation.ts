import { z } from "zod";
import { DayOfWeek } from "../../generated/prisma/enums";

export const createScheduleZodSchema = z.object({
  feederId: z.string("Feeder ID is required"),
  areaId: z.string("Area ID is required"),
  dayOfWeek: z.nativeEnum(DayOfWeek, "Day of week is required"),
  startTime: z
    .string("Start time is required")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "Start time must be in HH:MM format (e.g. 14:00)",
    }),
  endTime: z
    .string("End time is required")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: "End time must be in HH:MM format (e.g. 15:00)",
    }),
  reason: z.string().optional(),
});
