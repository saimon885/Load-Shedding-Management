import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { outageController } from "./outage.controller";
import { UserRole } from "../../generated/prisma/enums";
import { validatonRequest } from "../../middleware/validationRequest";
import { outage } from "./outage.validation";

const router = Router();
router.post(
	"/create",
	auth(UserRole.ADMIN, UserRole.ZONE_MANAGER, UserRole.POWER_OPERATOR),
	validatonRequest(outage.outageCreateSchema),
	outageController.createOutage,
);

router.get(
	"/get",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.POWER_OPERATOR,
		UserRole.CUSTOMER,
		UserRole.TECHNICIAN,
	),
	outageController.getOutage,
);
router.get(
	"/analytics/outage-stats",
	auth(UserRole.ADMIN, UserRole.ZONE_MANAGER, UserRole.POWER_OPERATOR),
	outageController.getOutageStates,
);
router.post(
	"/emergency",
	auth(UserRole.ADMIN, UserRole.POWER_OPERATOR),
	outageController.createEmergencyOutage,
);

router.get(
	"/get/:id",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.POWER_OPERATOR,
		UserRole.CUSTOMER,
		UserRole.TECHNICIAN,
	),
	outageController.getSingleOutage,
);

router.patch(
	"/status/:id",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.POWER_OPERATOR,
		UserRole.TECHNICIAN,
	),
	outageController.updateOutageStatus,
);

router.delete(
	"/del/:id",
	auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
	outageController.deleteOutage,
);

export const outageRoutes = router;
