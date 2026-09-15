import { Prisma } from "../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type {
  createSubstations,
  substationQuery,
} from "./substation.interface";

const createSubstation = async (payload: createSubstations) => {
  const existingZone = await prisma.zone.findUnique({
    where: {
      id: payload.zoneId,
    },
  });
  if (!existingZone) {
    throw new AppError(httpStatus.NOT_FOUND, "zone not found!");
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

const getAllSubstation = async (query: substationQuery) => {
  const limit = query.limit ? Number(query.limit) : 6;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.SubstationWhereInput[] = [];

  if (query?.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query?.location) {
    andConditions.push({
      location: { contains: query.location, mode: "insensitive" },
    });
  }

  if (query?.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  if (query?.zoneId) {
    andConditions.push({
      zoneId: query.zoneId,
    });
  }

  const whereConditions: Prisma.SubstationWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.substation.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: {
      zone: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const total = await prisma.substation.count({
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

const zoneWiseSubstation = async (zoneId: string) => {
  console.log(zoneId);
  const result = await prisma.substation.findMany({
    where: {
      zoneId,
    },
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Result not Found!");
  }
  return result;
};

export const substationService = {
  createSubstation,
  getAllSubstation,
  zoneWiseSubstation,
};
