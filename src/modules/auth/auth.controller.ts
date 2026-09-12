import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
const RegisterUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  await authService.RegisterUser(body);
  sendResponse(res, {
    statusCode: httpstatus.CREATED,
    success: true,
    message: "check your email for otp",
    data: null,
  });
});
const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  const { accessToken, refreshToken, user } =
    await authService.verifyEmail(body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Email verified successfully",
    data: { user, accessToken, refreshToken },
  });
});
const LoginUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  await authService.loginUser(body);
  sendResponse(res, {
    statusCode: httpstatus.CREATED,
    success: true,
    message: "check your email for otp",
    data: null,
  });
});
const ForgotPassword = catchAsync(async (req: Request, res: Response) => {});
const ResetPassword = catchAsync(async (req: Request, res: Response) => {});

export const authController = {
  RegisterUser,
  verifyEmail,
  LoginUser,
  ForgotPassword,
  ResetPassword,
};
