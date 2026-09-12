import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { zoneService } from "./zone.service";

const createZone = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const userId = user?.userId;
  const result = await zoneService.createZone(req.body, userId as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "Zone Created successfull!",
    data: result,
  });
});

const getAllZone = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.getAllZone();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Zone retrive successfull!",
    data: result,
  });
});

const updateZone = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "user Update successfull!",
    data: null,
  });
});

const getSingleZone = catchAsync(async (req: Request, res: Response) => {
  const result = await zoneService.getSingleZone(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Zone retrive successfull!",
    data: result,
  });
});

export const zoneController = {
  createZone,
  updateZone,
  getAllZone,
  getSingleZone,
};
