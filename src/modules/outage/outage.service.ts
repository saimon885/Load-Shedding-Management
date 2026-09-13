import { OutageStatus, OutageType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { OutageCreatePayload } from "./outage.interface";

const createOutage = async (payload: OutageCreatePayload, userId: string) => {
  const {
    type,
    reason,
    feederId,
    areaId,
    startTime,
    estimatedRestorationTime,
  } = payload;

  const outageStartTime = new Date(startTime);

  if (type === "SCHEDULED" && outageStartTime <= new Date()) {
    throw new Error("Scheduled outage start time must be in the future!");
  }

  if (areaId) {
    const isAreaValid = await prisma.area.findFirst({
      where: { id: areaId, feederId: feederId },
    });
    if (!isAreaValid) {
      throw new Error("This Area does not belong to the selected Feeder!");
    }
  }
  const status: OutageStatus =
    type === OutageType.SCHEDULED
      ? OutageStatus.SCHEDULED
      : OutageStatus.ONGOING;

  const result = await prisma.outage.create({
    data: {
      type,
      status,
      reason,
      feederId,
      areaId: areaId || null,
      startTime: outageStartTime,
      estimatedRestorationTime: estimatedRestorationTime
        ? new Date(estimatedRestorationTime)
        : null,
      createdBy: userId,
    },
    include: {
      feeder: true,
      area: true,
    },
  });

  return result;
};

const getOutage = async () => {
  const result = await prisma.outage.findMany();
  if (!result) {
    throw new Error("outage not Found!");
  }
  return result;
};
const getSingleOutage = async (outageId: string) => {
  const result = await prisma.outage.findUnique({
    where: {
      id: outageId,
    },
  });
  if (!result) {
    throw new Error("outage not Found. please valid outageId!");
  }
  return result;
};
const updateOutageStatus = async (
  payload: { status: OutageStatus },
  outageId: string,
) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId,
      deletedAt: null,
    },
  });

  if (!outage) {
    throw new Error("Outage not found. Please provide a valid outageId!");
  }

  const currentStatus = outage.status;
  const newStatus = payload.status;
  if (currentStatus === OutageStatus.RESTORED) {
    throw new Error("Cannot change status. Outage is already RESTORED!");
  }

  if (currentStatus === OutageStatus.CANCELLED) {
    throw new Error("Cannot change status. Outage has been CANCELLED!");
  }
  let actualRestorationTime = outage.actualRestorationTime;

  if (newStatus === OutageStatus.RESTORED) {
    actualRestorationTime = new Date();
  }
  const result = await prisma.outage.update({
    where: {
      id: outageId,
    },
    data: {
      status: newStatus,
      actualRestorationTime: actualRestorationTime,
    },
    include: {
      area: true,
      feeder: true,
    },
  });

  return result;
};
const deleteOutage = async (outageId: string) => {
  const outage = await prisma.outage.findUnique({
    where: {
      id: outageId,
    },
  });
  if (!outage) {
    throw new Error("outage not Found. please valid outageId!");
  }
  const result = await prisma.outage.delete({
    where: {
      id: outageId,
    },
  });
  return result;
};

export const outageService = {
  createOutage,
  getOutage,
  getSingleOutage,
  updateOutageStatus,
  deleteOutage,
};
