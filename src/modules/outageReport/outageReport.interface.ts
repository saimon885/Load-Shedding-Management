import type { ReportStatus } from "../../generated/prisma/enums";

export interface ReportCreatePayload {
	areaId: string;
	description: string;
}

export interface outageReportSS {
	status: ReportStatus;
	outageId: string;
}
