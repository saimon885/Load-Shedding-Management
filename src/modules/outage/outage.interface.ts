import { OutageType } from "../../generated/prisma/enums";

export interface OutageCreatePayload {
  type: OutageType;
  reason: string;
  feederId: string;
  areaId: string;
  startTime: string;
  estimatedRestorationTime: string;
}