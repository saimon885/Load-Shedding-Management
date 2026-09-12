import { Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import { AreaServices } from "./area.service";
const createArea = catchAsync(async (req: Request, res: Response) => {
  const result = await AreaServices.createArea(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.CREATED,
    message: "Area Created successfull!",
    data: result,
  });
});
const getArea = catchAsync(async (req: Request, res: Response) => {
  const result = await AreaServices.getArea();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Area retrive successfull!",
    data: result,
  });
});

export const AreaController = {
  createArea,
  getArea,
};
