import type { Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { AppError } from "../../utility/AppError";
import { authService } from "./auth.service";
import { sendResponse } from "../../utility/sendResponse";

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
  // await authService.loginUser(body);
  const { accessToken, refreshToken, user } = await authService.loginUser(body);
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
    statusCode: httpstatus.CREATED,
    success: true,
    // message: "check your email for otp",
    message: "Login successfull",
    data: { user, accessToken, refreshToken },
  });
});
const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const result = await authService.googleLogin(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken,
    },
  });
});

const ForgotPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.forgotPassword(req.body);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Password reset link sent to your email",
    data: null,
  });
});

const ResetPassword = catchAsync(async (req: Request, res: Response) => {
  await authService.resetPassword(req.body);

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "Password reset successfully.",
    data: null,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  if (!req.cookies.refreshToken) {
    throw new AppError(httpstatus.UNAUTHORIZED, "Refresh token is missing");
  }
  const result = await authService.refreshToken(req.cookies.refreshToken);
  const { accessToken, refreshToken: newRefreshToken } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  sendResponse(res, {
    statusCode: httpstatus.OK,
    success: true,
    message: "New tokens generated successfully",
    data: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  });
});

export const authController = {
  RegisterUser,
  verifyEmail,
  LoginUser,
  googleLogin,
  ForgotPassword,
  ResetPassword,
  refreshToken,
};
