import type { Prisma } from "../../generated/prisma/client";
import httpStatus from "http-status";
import {
	NotificationType,
	OutageStatus,
	OutageType,
	UserRole,
} from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utility/AppError";
import type {
	EmergencyPayload,
	OutageCreatePayload,
	outageQuery,
} from "./outage.interface";
import { createBulkNotifications } from "../notification/notificaton.helper";
import path from "path";
import { sendOutageAlertEmail } from "../../utility/sendEmailOutage";

const createOutage = async (payload: OutageCreatePayload, userId: string) => {
	const {
		type,
		reason,
		feederId,
		areaId,
		startTime,
		estimatedRestorationTime,
	} = payload;

	const outageStartTime = new Date(startTime);

	if (type === "SCHEDULED" && outageStartTime <= new Date()) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"Scheduled outage start time must be in the future!",
		);
	}

	if (areaId) {
		const isAreaValid = await prisma.area.findFirst({
			where: { id: areaId, feederId: feederId },
		});
		if (!isAreaValid) {
			throw new AppError(
				httpStatus.BAD_REQUEST,
				"This Area does not belong to the selected Feeder!",
			);
		}
	}
	const status: OutageStatus =
		type === OutageType.SCHEDULED
			? OutageStatus.SCHEDULED
			: OutageStatus.ONGOING;

	const result = await prisma.outage.create({
		data: {
			type,
			status,
			reason,
			feederId,
			areaId: areaId || null,
			startTime: outageStartTime,
			estimatedRestorationTime: estimatedRestorationTime
				? new Date(estimatedRestorationTime)
				: null,
			createdBy: userId,
		},
		include: {
			feeder: true,
			area: true,
		},
	});
	if (result?.areaId) {
		const areaCustomers = await prisma.user.findMany({
			where: {
				areaId: result.areaId,
			},
			select: { id: true, email: true },
		});

		const customerIds = areaCustomers.map((user) => user.id);
		const customerEmails = areaCustomers
			.map((user) => user.email)
			.filter(Boolean);
		console.log("Found Customer IDs for Notification:", customerIds);
		const message =
			result.type === "SCHEDULED"
				? `Power outage is scheduled in your area from ${result.startTime}.`
				: `Unexpected power outage detected in your area due to: ${result.reason}.`;

		await createBulkNotifications(
			customerIds,
			message,
			NotificationType.OUTAGE_ALERT,
		);

		if (customerEmails.length > 0) {
			const area = await prisma.area.findUnique({
				where: { id: result.areaId },
				select: { name: true },
			});

			await sendOutageAlertEmail({
				emails: customerEmails,
				areaName: area?.name || "Your Area",
				type: result.type,
				reason: result.reason,
				startTime: result.startTime.toString(),
				estimatedRestorationTime: result.estimatedRestorationTime?.toString(),
			});
		}
	}

	return result;
};

const getOutage = async (query: outageQuery) => {
	const limit = query.limit ? Number(query.limit) : 6;
	const page = query.page ? Number(query.page) : 1;
	const skip = (page - 1) * limit;

	const andConditions: Prisma.OutageWhereInput[] = [{ deletedAt: null }];

	if (query?.type) {
		andConditions.push({ type: query.type });
	}
	if (query?.status) {
		andConditions.push({ status: query.status });
	}
	if (query?.startTime) {
		andConditions.push({ startTime: new Date(query.startTime) });
	}
	if (query?.reason) {
		andConditions.push({
			reason: { contains: query.reason, mode: "insensitive" },
		});
	}
	if (query?.actualRestorationTime) {
		andConditions.push({
			actualRestorationTime: new Date(query.actualRestorationTime),
		});
	}
	if (query?.estimatedRestorationTime) {
		andConditions.push({
			estimatedRestorationTime: new Date(query.estimatedRestorationTime),
		});
	}

	const whereConditions: Prisma.OutageWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const [data, total] = await Promise.all([
		prisma.outage.findMany({
			where: whereConditions,
			skip,
			take: limit,
			orderBy: { createdAt: "desc" },
			include: {
				feeder: true,
				area: true,
			},
		}),
		prisma.outage.count({
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
		data,
	};
};

const getOutageStates = async () => {
	const transactionResult = await prisma.$transaction(async (tx) => {
		const [
			totalOutages,
			scheduledOutages,
			unexpectedOutages,
			ongoingOutages,
			restoredOutages,
			restoredList,
		] = await Promise.all([
			tx.outage.count(),
			tx.outage.count({ where: { type: "SCHEDULED" } }),
			tx.outage.count({ where: { type: "UNEXPECTED" } }),
			tx.outage.count({ where: { status: "ONGOING" } }),
			tx.outage.count({ where: { status: "RESTORED" } }),

			tx.outage.findMany({
				where: {
					status: "RESTORED",
					actualRestorationTime: { not: null },
				},
				select: {
					startTime: true,
					actualRestorationTime: true,
				},
			}),
		]);

		let averageRestorationTime = 0;

		if (restoredList.length > 0) {
			const totalMinutes = restoredList.reduce((acc, item) => {
				const start = new Date(item.startTime).getTime();
				const end = new Date(item.actualRestorationTime!).getTime();

				const diffMs = Math.abs(end - start);
				return acc + diffMs / (1000 * 60);
			}, 0);

			averageRestorationTime = Math.round(totalMinutes / restoredList.length);
		}

		return {
			totalOutages,
			scheduledOutages,
			unexpectedOutages,
			ongoingOutages,
			restoredOutages,
			averageRestorationTime,
		};
	});

	return transactionResult;
};

const createEmergencyOutageService = async (
	payload: EmergencyPayload,
	userId: string,
) => {
	const { feederId, durationInMinutes, reason } = payload;

	const priorityOrder = {
		LOW: 1,
		MEDIUM: 2,
		HIGH: 3,
	};

	const feederWithAreas = await prisma.feeder.findUnique({
		where: { id: feederId },
		include: {
			areas: true,
		},
	});

	if (!feederWithAreas || feederWithAreas.areas.length === 0) {
		throw new AppError(httpStatus.NOT_FOUND, "No areas found for this feeder!");
	}

	const sortedAreas = feederWithAreas.areas.sort(
		(a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
	);

	const startTime = new Date();
	const estimatedRestorationTime = new Date(
		startTime.getTime() + Number(durationInMinutes) * 60 * 1000,
	);

	let selectedArea = null;

	for (const area of sortedAreas) {
		const activeOutage = await prisma.outage.findFirst({
			where: {
				areaId: area.id,
				status: {
					in: [OutageStatus.ONGOING, OutageStatus.SCHEDULED],
				},
			},
		});

		if (!activeOutage) {
			selectedArea = area;
			break;
		}
	}

	if (!selectedArea) {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"All areas under this feeder are already experiencing power outages!",
		);
	}

	const emergencyOutage = await prisma.outage.create({
		data: {
			areaId: selectedArea.id,
			feederId: feederId,
			type: "UNEXPECTED",
			status: "ONGOING",
			reason:
				reason ||
				`Emergency Load Shedding triggered (Priority: ${selectedArea.priority})`,
			startTime,
			estimatedRestorationTime,
			createdBy: userId,
		},
		include: {
			area: true,
		},
	});

	if (selectedArea.id) {
		const areaCustomers = await prisma.user.findMany({
			where: {
				areaId: selectedArea.id,
				// role: UserRole.CUSTOMER,
			},
			select: { id: true, email: true },
		});

		const customerIds = areaCustomers.map((user) => user.id);
		const customerEmails = areaCustomers
			.map((user) => user.email)
			.filter((email): email is string => Boolean(email));

		if (customerIds.length > 0) {
			await createBulkNotifications(
				customerIds,
				`Emergency power outage detected in your area due to: ${emergencyOutage.reason}.`,
				NotificationType.OUTAGE_ALERT,
			);
		}

		if (customerEmails.length > 0) {
			await sendOutageAlertEmail({
				emails: customerEmails,
				areaName: selectedArea.name,
				type: emergencyOutage.type,
				reason: emergencyOutage.reason,
				startTime: emergencyOutage.startTime.toString(),
				estimatedRestorationTime:
					emergencyOutage.estimatedRestorationTime?.toString(),
			});
		}
	}

	return emergencyOutage;
};

const getSingleOutage = async (outageId: string) => {
	const result = await prisma.outage.findUnique({
		where: {
			id: outageId,
		},
	});
	if (!result) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"outage not Found. please valid outageId!",
		);
	}
	return result;
};

const updateOutageStatus = async (
	payload: { status: OutageStatus },
	outageId: string,
) => {
	const outage = await prisma.outage.findUnique({
		where: {
			id: outageId,
			deletedAt: null,
		},
	});

	if (!outage) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"Outage not found. Please provide a valid outageId!",
		);
	}

	const currentStatus = outage.status;
	const newStatus = payload.status;
	if (currentStatus === OutageStatus.RESTORED) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Cannot change status. Outage is already RESTORED!",
		);
	}

	if (currentStatus === OutageStatus.CANCELLED) {
		throw new AppError(
			httpStatus.CONFLICT,
			"Cannot change status. Outage has been CANCELLED!",
		);
	}
	let actualRestorationTime = outage.actualRestorationTime;

	if (newStatus === OutageStatus.RESTORED) {
		actualRestorationTime = new Date();
	}
	const result = await prisma.outage.update({
		where: {
			id: outageId,
		},
		data: {
			status: newStatus,
			actualRestorationTime: actualRestorationTime,
		},
		include: {
			area: true,
			feeder: true,
		},
	});

	return result;
};

const deleteOutage = async (outageId: string) => {
	const outage = await prisma.outage.findUnique({
		where: {
			id: outageId,
		},
	});
	if (!outage) {
		throw new AppError(
			httpStatus.NOT_FOUND,
			"outage not Found. please valid outageId!",
		);
	}
	const result = await prisma.outage.delete({
		where: {
			id: outageId,
		},
	});
	return result;
};

export const outageService = {
	createOutage,
	getOutage,
	getSingleOutage,
	updateOutageStatus,
	deleteOutage,
	getOutageStates,
	createEmergencyOutageService,
};
