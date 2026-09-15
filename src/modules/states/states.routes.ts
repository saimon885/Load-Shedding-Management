import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { statesController } from "./states.controller";

const router = Router();
router.get(
  "/admin-state",
  auth(UserRole.ADMIN),
  statesController.getAllAdminStates,
);
router.get(
  "/operator-zoneManager-state",
  auth(UserRole.POWER_OPERATOR, UserRole.ZONE_MANAGER),
  statesController.getAllStatesOperatorAndZoneManager,
);

export const stateRoutes = router;
