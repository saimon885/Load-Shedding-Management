import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { notificationService } from "./notification.service";

const getMyNotificationsService = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await notificationService.getMyNotificationsService(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      message: "notification retrive Successfull",
      statusCode: httpstatus.OK,
      data: result,
    });
  },
);
const markAsReadService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await notificationService.markAsReadService(
    req.params.id as string,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    message: "mark as read Successfull",
    statusCode: httpstatus.OK,
    data: result,
  });
});
const markAllAsReadService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await notificationService.markAllAsReadService(
    userId as string,
  );
  sendResponse(res, {
    success: true,
    message: "notification retrive Successfull",
    statusCode: httpstatus.OK,
    data: result,
  });
});

export const notificationController = {
  getMyNotificationsService,
  markAsReadService,
  markAllAsReadService,
};
