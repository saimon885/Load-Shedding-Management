import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { substationController } from "./substation.controller";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
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
