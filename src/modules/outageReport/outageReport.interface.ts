import type { ReportStatus } from "../../generated/prisma/enums";

export interface ReportCreatePayload {
	areaId: string;
	description: string;
}

export interface outageReportSS {
	status: ReportStatus;
	outageId: string;
}
export interface queryOutageReport {
	description?: string;
	status?: outageReportSS;
	page?: string;
	limit?: string;
}
