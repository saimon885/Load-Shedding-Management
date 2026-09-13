import type { OutageStatus, OutageType } from "../../generated/prisma/enums";

export interface OutageCreatePayload {
  type: OutageType;
  reason: string;
  feederId: string;
  areaId: string;
  startTime: string;
  estimatedRestorationTime: string;
}
export interface outageQuery {
  status?: OutageStatus;
  type?: OutageType;
  reason?: string;
  startTime?: string;
  estimatedRestorationTime?: string;
  actualRestorationTime?: string;
  limit?: string;
  page?: string;
}
