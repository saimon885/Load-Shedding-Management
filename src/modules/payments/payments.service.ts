import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import type { UserPayload } from "../../middleware/checkAuth";

import httpstatus from "http-status";
import { AppError } from "../../utility/AppError";

const createPayment = async (payload: any, user: UserPayload) => {
	const bkashIdToken = await getBkashIdToken();
	if (!bkashIdToken) {
		throw new AppError(
			httpstatus.INTERNAL_SERVER_ERROR,
			"bKash Authentication Token not found!",
		);
	}

	const service = await prisma.serviceRequest.findUnique({
		where: { id: payload.serviceId },
	});

	if (!service) {
		throw new AppError(httpstatus.NOT_FOUND, "Service request not found!");
	}
	if (service.paymentStatus === "PAID") {
		throw new AppError(httpstatus.OK, "already paid!");
	}

	const bkashCreatePayment = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				agreementID: "TokenizedMerchant01L3IKB6H1565072174986",
				mode: "0011",
				payerReference: user?.email || "Customer",
				callbackURL: `${config.bkash_callback_url}/service/payment/callback`,
				amount: service.amount,
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: service.id,
			}),
		},
	);

	if (!bkashCreatePayment.ok) {
		throw new AppError(
			httpstatus.BAD_REQUEST,
			"Failed to initiate bKash payment!",
		);
	}

	const bkashPaymentResult = await bkashCreatePayment.json();

	if (
		bkashPaymentResult.statusCode &&
		bkashPaymentResult.statusCode !== "0000"
	) {
		throw new AppError(
			httpstatus.BAD_REQUEST,
			bkashPaymentResult.statusMessage || "bKash Payment Creation Failed",
		);
	}

	const transactionResult = await prisma.$transaction(async (tx) => {
		await tx.serviceRequest.update({
			where: { id: service.id },
			data: {
				status: "PENDING",
			},
		});

		await tx.payment.create({
			data: {
				merchantInvoiceNumber:
					bkashPaymentResult.merchantInvoiceNumber || service.id,
				serviceRequestId: service.id,
				amount: Number(service.amount),
				paymentID: bkashPaymentResult.paymentID,
				userId: user.userId,
			},
		});

		return {
			paymentUrl: bkashPaymentResult.bkashURL,
		};
	});

	return transactionResult;
};

const getMyPayment = async (userId: string) => {
	const result = await prisma.payment.findMany({
		where: {
			userId: userId,
		},
	});
	if (!result) {
		throw new AppError(httpstatus.NOT_FOUND, "payment history not found!");
	}
	return result;
};
const getAllPayment = async () => {
	const result = await prisma.payment.findMany();
	if (!result) {
		throw new AppError(httpstatus.NOT_FOUND, "payment history not found!");
	}
	return result;
};

const paymentCallback = async (query: Record<string, any>) => {
	const transactionResult = await prisma.$transaction(
		async (tx) => {
			const paymentID = query.paymentID;
			const status = query.status;

			if (!paymentID) {
				throw new Error("Payment ID is missing");
			}

			if (!status) {
				throw new Error("status missing");
			}

			const bkashIdToken = await getBkashIdToken();

			if (!bkashIdToken) {
				throw new Error("Bkash id not found");
			}

			const bkashExecutePayment = await fetch(
				`${config.bkash_base_url}/tokenized/checkout/execute`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: bkashIdToken,
						"X-App-Key": config.bkash_app_key,
					},
					body: JSON.stringify({
						paymentID: paymentID,
					}),
				},
			);

			const bkashExecutePaymentResult = await bkashExecutePayment.json();

			console.log("BKASH EXECUTE RESULT:", bkashExecutePaymentResult);

			if (status === "success") {
				await tx.serviceRequest.update({
					where: {
						id: bkashExecutePaymentResult.merchantInvoiceNumber,
					},
					data: {
						status: "COMPLETED",
						paymentStatus: "PAID",
					},
				});

				await tx.payment.update({
					where: {
						// appointmentId: bkashExecutePaymentResult.merchantInvoiceNumber,
						paymentID: paymentID,
					},
					data: {
						status: "PAID",

						trxID: bkashExecutePaymentResult.trxID,
						paidAt: bkashExecutePaymentResult.paymentExecuteTime,
					},
				});

				return {
					redirectUrl: `${config.app_url}/dashboard/my-appointments?status=success`,
				};
			}
			if (status === "failure") {
				await tx.payment.update({
					where: {
						paymentID: paymentID,
					},
					data: {
						status: "FAILED",
					},
				});

				return {
					bkashExecutePaymentResult,
					redirectUrl: `${config.app_url}/dashboard/my-appointments?status=failed`,
				};
			}

			if (status === "cancel") {
				await tx.payment.update({
					where: {
						paymentID: paymentID,
					},
					data: {
						status: "CANCELLED",
					},
				});

				return {
					bkashExecutePaymentResult,
					redirectUrl: `${config.app_url}/dashboard/my-appointments?status=cancel`,
				};
			}

			return {
				bkashExecutePaymentResult,
				redirectUrl: `${config.app_url}/dashboard/my-appointments?error=payment-failed`,
			};
		},
		{
			timeout: 15000,
		},
	);

	return transactionResult;
};

export const paymentService = {
	createPayment,
	paymentCallback,
	getMyPayment,
	getAllPayment,
};
