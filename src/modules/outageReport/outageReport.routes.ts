import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { outageReportController } from "./outageReport.controller";

const router = Router();
router.post(
  "/create-report",
  auth(UserRole.CUSTOMER),
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
  outageReportController.updateReportStatus,
);

export const outageReportRoutes = router;
