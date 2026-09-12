import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { substationController } from "./substation.controller";

import { substationValidation } from "./substation.validation";
import { validatonRequest } from "../../middleware/validationRequest";

const router = Router();
router.post(
	"/create",
	auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
	validatonRequest(substationValidation.zodcreateSubstationSchema),
	substationController.createSubstation,
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
	substationController.getAllSubstation,
);
router.get(
	"/zoneId",
	auth(
		UserRole.ADMIN,
		UserRole.ZONE_MANAGER,
		UserRole.CUSTOMER,
		UserRole.POWER_OPERATOR,
		UserRole.TECHNICIAN,
	),
	substationController.zoneWiseSubstation,
);

export const substationRoutes = router;
