import type { Request, Response } from "express";
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
  const { meta, data } = await AreaServices.getArea(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Area retrive successfull!",
    data,
    meta,
  });
});

export const AreaController = {
  createArea,
  getArea,
};
