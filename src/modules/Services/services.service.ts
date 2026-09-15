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
	});
	if (!result) {
		throw new AppError(HttpStatus.NOT_FOUND, "service not found!");
	}
	return result;
};
const getAllService = async () => {
	const result = await prisma.serviceRequest.findMany();
	if (!result) {
		throw new AppError(HttpStatus.NOT_FOUND, "service not found!");
	}
	return result;
};

export const ServicesService = {
	createServiceRequest,
	getMyService,
	getAllService,
};
