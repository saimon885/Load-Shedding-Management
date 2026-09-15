import { DayOfWeek } from "../../generated/prisma/enums";

export interface CreateShedulePayload {
  feederId: string;
  areaId: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  reason?: string;
}