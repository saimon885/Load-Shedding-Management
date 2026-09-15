import type { OutageStatus, OutageType } from "../../generated/prisma/enums";

export interface OutageCreatePayload {
  type: OutageType;
  reason: string;
  feederId: string;
  areaId: string;
  startTime: Date;
  estimatedRestorationTime: Date;
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
