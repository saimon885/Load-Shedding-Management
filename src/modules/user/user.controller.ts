import type { Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { AppError } from "../../utility/AppError";
import { userService } from "./user.service";
import { sendResponse } from "../../utility/sendResponse";

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  const result = await userService.getMyprofile(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "user profile retrive successfull!",
    data: result,
  });
});
const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.getAllUser();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "all user successfull!",
    data: result,
  });
});
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  if (!req.file) {
    throw new AppError(
      httpstatus.BAD_REQUEST,
      "No file uploaded or file buffer is empty",
    );
  }
  let parsedBody = {};
  if (req.body.data) {
    parsedBody = JSON.parse(req.body.data);
  }
  const result = await userService.updateMyProfile(
    req.file.buffer,
    parsedBody,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "user Update successfull!",
    data: result,
  });
});

export const userController = {
  getMyProfile,
  updateMyProfile,
  getAllUser,
};
