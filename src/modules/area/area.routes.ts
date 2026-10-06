import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { AreaController } from "./area.controller";
import { validatonRequest } from "../../middleware/validationRequest";
import { areaValidation } from "./area.validation";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
  validatonRequest(areaValidation.areaCreateSchema),
  AreaController.createArea,
);
router.get("/get/:id", auth(), AreaController.getArea);
router.get("/single/:id", auth(), AreaController.getSingleArea);
export const areaRoutes = router;
