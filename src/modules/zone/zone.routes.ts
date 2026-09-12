import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { zoneController } from "./zone.controller";
import { validatonRequest } from "../../middleware/validationRequest";
import { zoneValidation } from "./zone.validation";

const router = Router();
router.post(
	"/create",
	auth(UserRole.ADMIN),
	validatonRequest(zoneValidation.zodCrateZoneSchema),
	zoneController.createZone,
);
router.get(
	"/",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.CUSTOMER,
		UserRole.POWER_OPERATOR,
		UserRole.TECHNICIAN,
	),
	zoneController.getAllZone,
);
router.patch(
	"/update",
	auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
	validatonRequest(zoneValidation.zodUpdateZoneSchema),
	zoneController.updateZone,
);

router.get(
	"/:id",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.CUSTOMER,
		UserRole.POWER_OPERATOR,
		UserRole.TECHNICIAN,
	),
	zoneController.getSingleZone,
);

export const zoneRoutes = router;
