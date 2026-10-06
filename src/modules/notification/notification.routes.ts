import { Router } from "express";
import { notificationController } from "./notification.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.get("/", auth(), notificationController.getMyNotificationsService);
router.patch("/:id/read", auth(), notificationController.markAsReadService);
router.patch("/read-all", auth(), notificationController.markAllAsReadService);

export const NotificationRoutes = router;
