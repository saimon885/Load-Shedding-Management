import { Request, Response } from "express";
import httpstatus from "http-status";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
const createArea = catchAsync(async (req: Request, res: Response) => {
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "Feeders Created successfull!",
    data: null,
  });
});

export const AreaController = {
  createArea,
};
