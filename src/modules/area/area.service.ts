import { prisma } from "../../lib/prisma";
import { CreateArea } from "./area.interface";

const createArea = async (payload: CreateArea) => {
  const feedrs = await prisma.feeder.findUnique({
    where: {
      id: payload.feederId,
    },
  });
  if (!feedrs) {
    throw new Error("Feeders not found!");
  }
  const areaResult = await prisma.area.create({
    data: {
      name: payload.name,
      code: payload.code,
      feederId: payload.feederId,
      description: payload.description,
    },
  });
  return areaResult;
};

const getArea = async () => {
  const result = await prisma.area.findMany();
  if (!result) {
    throw new Error("Area not found!");
  }
  return result;
};

export const AreaServices = {
  createArea,
  getArea,
};
