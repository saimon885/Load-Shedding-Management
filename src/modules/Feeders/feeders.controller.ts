import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { feedersService } from "./feeders.service";
const createFeeders = catchAsync(async (req: Request, res: Response) => {
	const result = await feedersService.createFeeders(req.body);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "Feeders Created successfull!",
		data: result,
	});
});
const getAllFeeders = catchAsync(async (req: Request, res: Response) => {
	const result = await feedersService.getAllFeeders();
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "Feeders retrive successfull!",
		data: result,
	});
});

export const feedersController = {
	createFeeders,
	getAllFeeders,
};
