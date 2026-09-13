import { Prisma } from "../../generated/prisma/client";
import { ZoneWhereInput } from "../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type {
  createZonePayload,
  IZonequeryInterface,
  updateZonePayload,
} from "./zone.interface";

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
const getAllZone = async (query: IZonequeryInterface) => {
  const limit = query.limit ? Number(query.limit) : 6;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.ZoneWhereInput[] = [];
  if (query?.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { description: { contains: query.searchTerm, mode: "insensitive" } },
        { code: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }
  if (query?.status) {
    andConditions.push({
      status: query.status as any,
    });
  }
  const whereConditions: Prisma.ZoneWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const [result, total] = await Promise.all([
    prisma.zone.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
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
    }),
    prisma.zone.count({
      where: whereConditions,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPages,
    },
    data: result,
  };
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
