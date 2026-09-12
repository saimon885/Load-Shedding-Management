import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { zoneController } from "./zone.controller";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
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
