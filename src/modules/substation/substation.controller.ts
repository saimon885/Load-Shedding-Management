import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { substationService } from "./substation.service";
const createSubstation = catchAsync(async (req: Request, res: Response) => {
  const result = await substationService.createSubstation(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "Substation Created successfull!",
    data: result,
  });
});
const getAllSubstation = catchAsync(async (req: Request, res: Response) => {
  const result = await substationService.getAllSubstation();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "substation retrive successfull!",
    data: result,
  });
});
const zoneWiseSubstation = catchAsync(async (req: Request, res: Response) => {
  const query = req.query.zoneId;
  const result = await substationService.zoneWiseSubstation(query as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "substation retrive successfull!",
    data: result,
  });
});

export const substationController = {
  createSubstation,
  getAllSubstation,
  zoneWiseSubstation,
};
