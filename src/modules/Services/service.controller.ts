import { catchAsync } from "../../utility/catchAsync";
import httpstatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import { Request, Response } from "express";
import { ServicesService } from "./services.service";

const createService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await ServicesService.createServiceRequest(
    req.body,
    userId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "Service created Successfull!",
    data: result,
  });
});
const getService = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await ServicesService.getMyService(userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Service retrive Successfull!",
    data: result,
  });
});
const getAllService = catchAsync(async (req: Request, res: Response) => {
  const result = await ServicesService.getAllService();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Service retrive Successfull!",
    data: result,
  });
});

export const ServicesController = {
  createService,
  getService,
  getAllService,
};
