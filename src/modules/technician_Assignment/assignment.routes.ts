import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { assignmentController } from "./assignment.controller";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.POWER_OPERATOR),
  assignmentController.createAssignment,
);

router.get(
  "/all-technician",
  auth(UserRole.ADMIN, UserRole.POWER_OPERATOR),
  assignmentController.getAllTechnician,
);
router.get(
  "/technician-assignment",
  auth(UserRole.TECHNICIAN),
  assignmentController.getTechnicianAssignment,
);

router.patch(
  "/status/:id",
  auth(UserRole.ADMIN, UserRole.TECHNICIAN),
  assignmentController.updateAssignmentStatus,
);

export const AssignmentRoutes = router;
