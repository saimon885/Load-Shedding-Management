import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";

const createOutage = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "outage created Successfull",
    statusCode: httpstatus.CREATED,
    data: null,
  });
});

const getOutage = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "outage retrive Successfull",
    statusCode: httpstatus.OK,
    data: null,
  });
});

const getSingleOutage = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "outage retrive Successfull",
    statusCode: httpstatus.OK,
    data: null,
  });
});

const updateOutageStatus = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "outage status update Successfull",
    statusCode: httpstatus.OK,
    data: null,
  });
});

const deleteOutage = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    message: "outage delete Successfull",
    statusCode: httpstatus.OK,
    data: null,
  });
});

export const outageController = {
  createOutage,
  getOutage,
  getSingleOutage,
  updateOutageStatus,
  deleteOutage,
};
