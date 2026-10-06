import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { substationController } from "./substation.controller";

import { substationValidation } from "./substation.validation";
import { validatonRequest } from "../../middleware/validationRequest";

const router = Router();
router.post(
  "/create",
  auth(UserRole.ADMIN, UserRole.ZONE_MANAGER),
  validatonRequest(substationValidation.zodcreateSubstationSchema),
  substationController.createSubstation,
);
router.get("/zoneId", auth(), substationController.zoneWiseSubstation);
router.get("/get/:id", auth(), substationController.getAllSubstation);

export const substationRoutes = router;
