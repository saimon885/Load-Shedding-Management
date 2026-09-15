import { catchAsync } from "../../utility/catchAsync";
import httpstatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import { Request, Response } from "express";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "payement created Successfull!",
    data: null,
  });
});
const getPayment = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "payment created Successfull!",
    data: null,
  });
});

export const paymentController = {
  createPayment,
  getPayment,
};
