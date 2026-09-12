import type { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utility/catchAsync";
import type z from "zod";

export const validatonRequest = (zodSchema: z.ZodObject) => {
	return catchAsync((req: Request, res: Response, next: NextFunction) => {
		const payload = req.body ?? {};
		const result = zodSchema.safeParse(payload);
		if (!result.success) {
			throw new Error(result.error.issues[0].message);
		}
		req.body = result.data;
		next();
	});
};
