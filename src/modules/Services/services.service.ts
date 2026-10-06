import type { ServiceType } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import { SERVICE_FEES } from "../../utility/serviceFees";
import HttpStatus from "http-status";

export interface IserviceCratePayload {
  areaId: string;
  type: ServiceType;
  description: string;
}
const createServiceRequest = async (
  payload: IserviceCratePayload,
  userId: string,
) => {
  const area = await prisma.area.findUnique({
    where: {
      id: payload.areaId,
    },
  });
  if (!area) {
    throw new AppError(HttpStatus.NOT_FOUND, "area ID not found!");
  }
  const feeAmount = SERVICE_FEES[payload.type];

  const result = await prisma.serviceRequest.create({
    data: {
      userId: userId,
      areaId: payload.areaId,
      type: payload.type,
      description: payload.description,
      amount: feeAmount,
    },
  });

  return result;
};

const getMyService = async (userId: string) => {
  const result = await prisma.serviceRequest.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      areaId: true,
      type: true,
      description: true,
      amount: true,
      status: true,
      paymentStatus: true,

      createdAt: true,
      updatedAt: true,

      area: {
        select: {
          id: true,
          name: true,
          code: true,

          feeder: {
            select: {
              id: true,
              name: true,
              code: true,
              substation: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  if (!result) {
    throw new AppError(HttpStatus.NOT_FOUND, "service not found!");
  }
  return result;
};
const getAllService = async () => {
  const result = await prisma.serviceRequest.findMany({
    select: {
      id: true,
      userId: true,
      areaId: true,
      type: true,
      description: true,
      amount: true,
      status: true,
      paymentStatus: true,

      createdAt: true,
      updatedAt: true,

      area: {
        select: {
          id: true,
          name: true,
          code: true,

          feeder: {
            select: {
              id: true,
              name: true,
              code: true,
              substation: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  if (!result.length) {
    throw new AppError(HttpStatus.NOT_FOUND, "No service requests found!");
  }

  return result;
};

export const ServicesService = {
  createServiceRequest,
  getMyService,
  getAllService,
};
