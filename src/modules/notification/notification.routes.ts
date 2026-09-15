import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get(
  "/",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.ZONE_MANAGER,
    UserRole.TECHNICIAN,
  ),
  notificationController.getMyNotificationsService,
);
router.patch(
  "/:id/read",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.ZONE_MANAGER,
    UserRole.TECHNICIAN,
  ),
  notificationController.markAsReadService,
);
router.patch(
  "/read-all",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.ZONE_MANAGER,
    UserRole.TECHNICIAN,
  ),
  notificationController.markAllAsReadService,
);

export const NotificationRoutes = router;
