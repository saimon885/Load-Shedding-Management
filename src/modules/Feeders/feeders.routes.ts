import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { feedersController } from "./feeders.controller";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
  feedersController.createFeeders,
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
  feedersController.getAllFeeders,
);

export const feederRoutes = router;
