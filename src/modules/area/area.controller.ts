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
  const { meta, data } = await AreaServices.getArea(
    req.query,
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Area retrive successfull!",
    data,
    meta,
  });
});
const getSingleArea = catchAsync(async (req: Request, res: Response) => {
  const data = await AreaServices.getSingleArea(req.params.id as string);
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Area retrive successfull!",
    data,
  });
});

export const AreaController = {
  createArea,
  getArea,
  getSingleArea,
};
