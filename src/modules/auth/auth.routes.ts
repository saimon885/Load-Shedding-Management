import { Router } from "express";
import { validatonRequest } from "../../middleware/validationRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();
router.post(
  "/register",
  validatonRequest(authValidation.zodPaitentRegisterSchema),
  authController.RegisterUser,
);
router.post(
  "/login",
  validatonRequest(authValidation.zodPaitentLoginSchema),
  authController.LoginUser,
);
router.post(
  "/verify-email",
  validatonRequest(authValidation.zodPaitentVerifySchema),
  authController.verifyEmail,
);
router.post("/forgot-password", authController.ForgotPassword);
router.post("/reset-password", authController.ResetPassword);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
