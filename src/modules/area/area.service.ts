import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { areaQuery, CreateArea } from "./area.interface";

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

const getArea = async (query: areaQuery) => {
  const limit = query.limit ? Number(query.limit) : 6;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.AreaWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { description: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query.feederId) {
    andConditions.push({ feederId: query.feederId });
  }

  const whereConditions: Prisma.AreaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.area.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      feeder: true,
    },
  });

  const total = await prisma.area.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    data: result,
  };
};
export const AreaServices = {
  createArea,
  getArea,
};
