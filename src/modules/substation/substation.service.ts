import { prisma } from "../../lib/prisma";

const createSubstation = async (payload: any) => {
  const existingZone = await prisma.zone.findUnique({
    where: {
      id: payload.zoneId,
    },
  });
  if (!existingZone) {
    throw new Error("zone not found!");
  }
  const substationResult = await prisma.substation.create({
    data: {
      name: payload.name,
      code: payload.code,
      location: payload.location,
      zoneId: payload.zoneId,
    },
  });
  return substationResult;
};

const getAllSubstation = async () => {
  const result = await prisma.substation.findMany({
    include: {
      zone: true,
    },
  });
  if (!result) {
    throw new Error("Result not Found!");
  }
  return result;
};

const zoneWiseSubstation = async (zoneId: string) => {
  console.log(zoneId);
  const result = await prisma.substation.findMany({
    where: {
      zoneId,
    },
  });
  if (!result) {
    throw new Error("Result not Found!");
  }
  return result;
};
export const substationService = {
  createSubstation,
  getAllSubstation,
  zoneWiseSubstation,
};
