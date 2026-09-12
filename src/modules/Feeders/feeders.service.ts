import { prisma } from "../../lib/prisma";
import { CreateFeeders } from "./feeders.interface";

const createFeeders = async (payload: CreateFeeders) => {
  const Substation = await prisma.substation.findUnique({
    where: {
      id: payload.substationId,
    },
  });
  if (!Substation) {
    throw new Error("substation not found!");
  }
  const FeedersResultResult = await prisma.feeder.create({
    data: {
      name: payload.name,
      code: payload.code,
      capacity: Number(payload.capacity),

      substationId: payload.substationId,
    },
  });
  return FeedersResultResult;
};
const getAllFeeders = async () => {
  const result = await prisma.feeder.findMany();
  if (!result) {
    throw new Error("feeders not found!");
  }
  return result;
};

export const feedersService = {
  createFeeders,
  getAllFeeders,
};
