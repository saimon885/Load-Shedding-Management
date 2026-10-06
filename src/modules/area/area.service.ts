import type { Prisma } from "../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type { areaQuery, CreateArea } from "./area.interface";

const createArea = async (payload: CreateArea) => {
  const feedrs = await prisma.feeder.findUnique({
    where: {
      id: payload.feederId,
    },
  });
  if (!feedrs) {
    throw new AppError(httpStatus.NOT_FOUND, "Feeders not found!");
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

const getArea = async (query: areaQuery, feederId: string) => {
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

  if (feederId) {
    andConditions.push({ feederId });
  }

  const whereConditions: Prisma.AreaWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.area.findMany({
    where: whereConditions,
    skip,
    take: limit,
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
const getSingleArea = async (areaId: string) => {
  const areaCheck = await prisma.area.findUnique({
    where: {
      id: areaId,
    },
  });
  if (!areaCheck) {
    throw new AppError(httpStatus.NOT_FOUND, "area not found");
  }
  return areaCheck;
};
export const AreaServices = {
  createArea,
  getArea,
  getSingleArea,
};
