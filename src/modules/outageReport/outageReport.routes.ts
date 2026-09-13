import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { outageReportController } from "./outageReport.controller";
import { validatonRequest } from "../../middleware/validationRequest";
import { outageReport } from "./outageReport.validation";

const router = Router();
router.post(
	"/create-report",
	auth(UserRole.CUSTOMER),
	validatonRequest(outageReport.createReportSchema),
	outageReportController.createReport,
);
router.get(
	"/get-report",
	auth(UserRole.ADMIN, UserRole.POWER_OPERATOR, UserRole.ZONE_MANAGER),
	outageReportController.getReport,
);
router.patch(
	"/status/:id",
	auth(UserRole.ADMIN, UserRole.POWER_OPERATOR),
	validatonRequest(outageReport.outageReportStatusSchema),
	outageReportController.updateReportStatus,
);

export const outageReportRoutes = router;
