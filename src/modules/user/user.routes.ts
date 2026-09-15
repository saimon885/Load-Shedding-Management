import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../generated/prisma/enums";
import { userController } from "./user.controller";
import { validatonRequest } from "../../middleware/validationRequest";
import { userValidation } from "./user.validaion";
import { upload } from "../../lib/multer";

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
router.get("/all-users", auth(UserRole.ADMIN), userController.getAllUser);
router.patch(
  "/update/me",
  auth(
    UserRole.ADMIN,
    UserRole.CUSTOMER,
    UserRole.POWER_OPERATOR,
    UserRole.TECHNICIAN,
    UserRole.ZONE_MANAGER,
  ),
  upload.single("profileImage"),
  //   validatonRequest(userValidation.zodUserUpdateSchema),
  userController.updateMyProfile,
);

export const userRoutes = router;
