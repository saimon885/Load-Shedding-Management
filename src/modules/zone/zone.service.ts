import { prisma } from "../../lib/prisma";
import { createZonePayload, updateZonePayload } from "./zone.interface";

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
  const result = await prisma.zone.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      substation: {
        select: {
          id: true,
          name: true,
          code: true,
          location: true,
          zoneId: true,
          status: true,
          feeder: {
            select: {
              id: true,
              name: true,
              code: true,
              capacity: true,
              status: true,
              substationId: true,
              areas: {
                select: {
                  id: true,
                  name: true,
                  code: true,
                  description: true,
                  status: true,
                  feederId: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!result) {
    throw new Error("Zone not found!");
  }
  return result;
};
const updateZone = async (payload: updateZonePayload) => {
  const zone = await prisma.zone.findUnique({
    where: {
      id: payload.zoneId,
    },
  });
  if (!zone) {
    throw new Error("Zone not found!");
  }
  const updateZone = await prisma.zone.update({
    where: {
      id: payload.zoneId,
    },
    data: {
      code: payload.code,
      name: payload.name,
      description: payload.description,
    },
  });
  return updateZone;
};
const getSingleZone = async (Zoneid: string) => {
  const result = await prisma.zone.findUnique({
    where: {
      id: Zoneid,
    },
    select: {
      id: true,
      name: true,
      code: true,
      description: true,
      status: true,
      substation: {
        select: {
          id: true,
          name: true,
          code: true,
          location: true,
          zoneId: true,
          status: true,
        },
      },
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
