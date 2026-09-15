import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { outageService } from "./outage.service";

const createOutage = catchAsync(async (req: Request, res: Response) => {
	const user = req.user;
	const userId = user?.userId;
	const result = await outageService.createOutage(req.body, userId as string);
	sendResponse(res, {
		success: true,
		message: "outage created Successfull",
		statusCode: httpstatus.CREATED,
		data: result,
	});
});
const getOutage = catchAsync(async (req: Request, res: Response) => {
	const { data, meta } = await outageService.getOutage(req.query);
	sendResponse(res, {
		success: true,
		message: "outage retrive Successfull",
		statusCode: httpstatus.OK,
		data,
		meta,
	});
});

const getOutageStates = catchAsync(async (req: Request, res: Response) => {
	const result = await outageService.getOutageStates();
	sendResponse(res, {
		success: true,
		message: "outage states Successfull",
		statusCode: httpstatus.OK,
		data: result,
	});
});
const createEmergencyOutage = catchAsync(
	async (req: Request, res: Response) => {
		const userId = req.user?.userId;

		const result = await outageService.createEmergencyOutageService(
			req.body,
			userId as string,
		);
		sendResponse(res, {
			success: true,
			message: "EmergencyOutage Created Successfull",
			statusCode: httpstatus.CREATED,
			data: result,
		});
	},
);

const getSingleOutage = catchAsync(async (req: Request, res: Response) => {
	const result = await outageService.getSingleOutage(req.params.id as string);
	sendResponse(res, {
		success: true,
		message: "outage retrive Successfull",
		statusCode: httpstatus.OK,
		data: result,
	});
});

const updateOutageStatus = catchAsync(async (req: Request, res: Response) => {
	const result = await outageService.updateOutageStatus(
		req.body,
		req.params.id as string,
	);
	sendResponse(res, {
		success: true,
		message: "outage status update Successfull",
		statusCode: httpstatus.OK,
		data: result,
	});
});

const deleteOutage = catchAsync(async (req: Request, res: Response) => {
	const result = await outageService.deleteOutage(req.params.id as string);
	sendResponse(res, {
		success: true,
		message: "outage delete Successfull",
		statusCode: httpstatus.OK,
		data: result,
	});
});

export const outageController = {
	createOutage,
	getOutage,
	getSingleOutage,
	updateOutageStatus,
	deleteOutage,
	getOutageStates,
	createEmergencyOutage,
};
