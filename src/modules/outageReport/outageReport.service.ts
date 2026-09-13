import { ReportStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { outageReportSS, ReportCreatePayload } from "./outageReport.interface";

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
		throw new Error("Customar not Found!");
	}
	const AreaCheck = await prisma.area.findUnique({
		where: {
			id: payload.areaId,
		},
	});
	if (!AreaCheck) {
		throw new Error("Area not Found!");
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

const getReport = async () => {
	const result = await prisma.outageReport.findMany();
	if (!result) {
		throw new Error("Report not Found");
	}
	return result;
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
		throw new Error("Report not Found");
	}

	if (payload.outageId) {
		const outage = await prisma.outage.findUnique({
			where: {
				id: payload.outageId,
			},
		});

		if (!outage) {
			throw new Error("Outage not Found");
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
