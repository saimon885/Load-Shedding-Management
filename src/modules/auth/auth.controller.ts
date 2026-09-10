import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";

const RegisterUser = catchAsync(async (req: Request, res: Response) => {});
const verifyEmail = catchAsync(async (req: Request, res: Response) => {});
const LoginUser = catchAsync(async (req: Request, res: Response) => {});
const ForgotPassword = catchAsync(async (req: Request, res: Response) => {});
const ResetPassword = catchAsync(async (req: Request, res: Response) => {});

export const authController = {
  RegisterUser,
  verifyEmail,
  LoginUser,
  ForgotPassword,
  ResetPassword,
};
