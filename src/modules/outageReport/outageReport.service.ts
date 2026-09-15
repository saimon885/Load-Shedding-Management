import { Prisma } from "../../generated/prisma/client";
import httpStatus from "http-status";
import { ReportStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type {
  outageReportSS,
  queryOutageReport,
  ReportCreatePayload,
} from "./outageReport.interface";

const createReport = async (
  payload: ReportCreatePayload,
  customarId: string,
) => {
  const customarCheck = await prisma.user.findUnique({
    where: {
      id: customarId,
    },
  });
  if (!customarCheck) {
    throw new AppError(httpStatus.NOT_FOUND, "Customar not Found!");
  }
  const AreaCheck = await prisma.area.findUnique({
    where: {
      id: payload.areaId,
    },
  });
  if (!AreaCheck) {
    throw new AppError(httpStatus.NOT_FOUND, "Area not Found!");
  }
  const result = await prisma.outageReport.create({
    data: {
      areaId: payload.areaId,
      description: payload.description,
      customerId: customarId,
    },
  });
  return result;
};

const getReport = async (query: queryOutageReport) => {
  const limit = query.limit ? Number(query.limit) : 6;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const andConditions: Prisma.OutageReportWhereInput[] = [];

  if (query?.description) {
    andConditions.push({
      description: { contains: query.description, mode: "insensitive" },
    });
  }

  if (query?.status) {
    andConditions.push({
      status: query.status as any,
    });
  }

  const whereConditions: Prisma.OutageReportWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.outageReport.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      area: true,
      outage: true,
    },
  });

  const total = await prisma.outageReport.count({
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
const updateReportStatus = async (
  payload: outageReportSS,
  outageReportId: string,
) => {
  const report = await prisma.outageReport.findUnique({
    where: {
      id: outageReportId,
    },
  });

  if (!report) {
    throw new AppError(httpStatus.NOT_FOUND, "Report not Found");
  }

  if (payload.outageId) {
    const outage = await prisma.outage.findUnique({
      where: {
        id: payload.outageId,
      },
    });

    if (!outage) {
      throw new AppError(httpStatus.NOT_FOUND, "Outage not Found");
    }
  }

  const result = await prisma.outageReport.update({
    where: {
      id: outageReportId,
    },
    data: {
      status: payload.status,
      outageId: payload.outageId || null,
    },
  });

  return result;
};
export const outageReportService = {
  createReport,
  getReport,
  updateReportStatus,
};
