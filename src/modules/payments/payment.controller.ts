import { catchAsync } from "../../utility/catchAsync";
import httpstatus from "http-status";
import { sendResponse } from "../../utility/sendResponse";
import type { Request, Response } from "express";
import { paymentService } from "./payments.service";
import type { UserPayload } from "../../middleware/checkAuth";

const createPayment = catchAsync(async (req: Request, res: Response) => {
	const { paymentUrl } = await paymentService.createPayment(
		req.body,
		req.user as UserPayload,
	);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.CREATED,
		message: "payement created Successfull!",
		data: paymentUrl,
	});
});
const paymentCallback = catchAsync(async (req: Request, res: Response) => {
	console.log(req.query, "query");
	const { redirectUrl } = await paymentService.paymentCallback(req.query);
	res.redirect(redirectUrl);
});
const getMyPaymentHisotry = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.userId;
	const result = await paymentService.getMyPayment(userId as string);
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "payment History retrive Successfull!",
		data: result,
	});
});
const getallPaymentHistory = catchAsync(async (req: Request, res: Response) => {
	const result = await paymentService.getAllPayment();
	sendResponse(res, {
		success: true,
		statusCode: httpstatus.OK,
		message: "payment History retrive Successfull!",
		data: result,
	});
});

export const paymentController = {
	createPayment,
	getMyPaymentHisotry,
	getallPaymentHistory,
	paymentCallback,
};
