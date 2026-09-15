import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validatonRequest } from "../../middleware/validationRequest";
import { UserRole } from "../../generated/prisma/enums";
import { createScheduleZodSchema } from "./shedules.validation";
import { sheduleController } from "./schedules.controller";

const router = Router();

router.post(
	"/create",
	auth(UserRole.ADMIN, UserRole.POWER_OPERATOR),
	validatonRequest(createScheduleZodSchema),
	sheduleController.createSchedule,
);

router.get(
	"/get",
	auth(
		UserRole.ADMIN,
		UserRole.POWER_OPERATOR,
		UserRole.TECHNICIAN,
		UserRole.CUSTOMER,
	),
	sheduleController.getSchedule,
);

export const ScheduleRoutes = router;
