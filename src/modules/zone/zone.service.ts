import { prisma } from "../../lib/prisma";
import { createZonePayload } from "./zone.interface";

const createZone = async (payload: createZonePayload, userId: string) => {
  const existingZone = await prisma.zone.findFirst({
    where: {
      code: payload.code,
      name: payload.name,
    },
  });

  if (existingZone) {
    throw new Error("Zone code already exists");
  }
  const result = await prisma.zone.create({
    data: {
      name: payload.name,
      code: payload.code,
      description: payload.description,
    },
  });
  await prisma.auditLog.create({
    data: {
      userId,
      action: "CREATE",
      entity: "ZONE",
      entityId: result.id,
    },
  });
  return result;
};
const getAllZone = async () => {
  const result = await prisma.zone.findMany();
  if (!result) {
    throw new Error("Zone not found!");
  }
  return result;
};
const updateZone = async () => {};

const getSingleZone = async (Zoneid: string) => {
  const result = await prisma.zone.findUnique({
    where: {
      id: Zoneid,
    },
    include: {
      substation: true,
    },
  });
  if (!result) {
    throw new Error("zone not found!");
  }
  return result;
};

export const zoneService = {
  createZone,
  updateZone,
  getAllZone,
  getSingleZone,
};
