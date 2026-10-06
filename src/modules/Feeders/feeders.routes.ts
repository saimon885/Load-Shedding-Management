import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { feedersController } from "./feeders.controller";
import { validatonRequest } from "../../middleware/validationRequest";
import { feederValidation } from "./feeders.validation";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
  validatonRequest(feederValidation.FeedersCreateSchema),
  feedersController.createFeeders,
);
router.get("/get/:id", auth(), feedersController.getAllFeeders);

export const feederRoutes = router;
