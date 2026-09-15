import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { ServicesController } from "./service.controller";

const router = Router();
router.post(
	"/create-requests",
	auth(UserRole.CUSTOMER),
	ServicesController.createService,
);
router.get(
	"/my-requests",
	auth(UserRole.ADMIN, UserRole.CUSTOMER),
	ServicesController.getService,
);
router.get(
	"/all-requests",
	auth(UserRole.ADMIN),
	ServicesController.getAllService,
);
export const ServiceRoutes = router;
