import type { Prisma } from "../../generated/prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type { CreateFeeders, FeedersQuery } from "./feeders.interface";

const createFeeders = async (payload: CreateFeeders) => {
	const Substation = await prisma.substation.findUnique({
		where: {
			id: payload.substationId,
		},
	});
	if (!Substation) {
		throw new AppError(httpStatus.NOT_FOUND, "substation not found!");
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
const getAllFeeders = async (query: FeedersQuery) => {
	const limit = query.limit ? Number(query.limit) : 6;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;

	const andConditions: Prisma.FeederWhereInput[] = [];

	if (query?.searchTerm) {
		andConditions.push({
			OR: [
				{ name: { contains: query.searchTerm, mode: "insensitive" } },
				{ code: { contains: query.searchTerm, mode: "insensitive" } },
			],
		});
	}

	if (query?.status) {
		andConditions.push({
			status: query.status as any,
		});
	}

	const whereConditions: Prisma.FeederWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const result = await prisma.feeder.findMany({
		where: whereConditions,
		skip,
		take: limit,
		orderBy: {
			createdAt: "desc",
		},
		include: {
			substation: true,
			areas: true,
		},
	});

	const total = await prisma.feeder.count({
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
export const feedersService = {
	createFeeders,
	getAllFeeders,
};
