import { Router } from "express";
import { validatonRequest } from "../../middleware/validationRequest";
import { authValidation } from "./auth.validation";
import { authController } from "./auth.controller";

const router = Router();
router.post(
  "/register",
  validatonRequest(authValidation.zodRegisterSchema),
  authController.RegisterUser,
);
router.post(
  "/login",
  validatonRequest(authValidation.zodLoginSchema),
  authController.LoginUser,
);
router.post(
  "/verify-email",
  validatonRequest(authValidation.zodtVerifySchema),
  authController.verifyEmail,
);
router.post(
  "/forgot-password",
  validatonRequest(authValidation.zodForgotSchema),
  authController.ForgotPassword,
);
router.post(
  "/reset-password",
  validatonRequest(authValidation.zodresetPasswordSchema),
  authController.ResetPassword,
);
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
