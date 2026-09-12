import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
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
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  const result = await userService.updateMyProfile(req.body, userId as string);
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
};
