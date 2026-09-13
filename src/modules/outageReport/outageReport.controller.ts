import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import httpStatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import { outageReportService } from "./outageReport.service";

const createReport = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const customarId = user?.userId;
  const result = await outageReportService.createReport(
    req.body,
    customarId as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Report Created Successfully.",
    data: result,
  });
});
const getReport = catchAsync(async (req: Request, res: Response) => {
  const { data, meta } = await outageReportService.getReport(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Report retrive Successfully.",
    data,
    meta,
  });
});
const updateReportStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await outageReportService.updateReportStatus(
    req.body,
    req.params.id as string,
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Report update Successfully.",
    data: result,
  });
});

export const outageReportController = {
  createReport,
  getReport,
  updateReportStatus,
};
