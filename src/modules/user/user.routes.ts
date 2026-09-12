import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { userController } from "./user.controller";

const router = Router();
router.get(
  "/me",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.ZONE_MANAGER,
  ),
  userController.getMyProfile,
);
router.patch(
  "/update/me",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.ZONE_MANAGER,
  ),
  userController.updateMyProfile,
);

export const userRoutes = router;
