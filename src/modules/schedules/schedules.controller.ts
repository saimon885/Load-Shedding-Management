import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sheduleService } from "./schedules.service";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
	const result = await sheduleService.createScheduleService(req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.CREATED,
		message: "Outage Schedules Created successfully!",
		data: result,
	});
});
const getSchedule = catchAsync(async (req: Request, res: Response) => {
	const result = await sheduleService.getAllSchedulesService();
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "Outage Schedules retrive successfully!",
		data: result,
	});
});

export const sheduleController = {
	createSchedule,
	getSchedule,
};
