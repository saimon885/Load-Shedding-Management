import config from "../config";
import { AppError } from "../utility/AppError";
import httpstatus from "http-status";
import { redisClient } from "./redis";

export const getBkashIdToken = async () => {
	try {
		const IdTokenKey = "bkash:idToken";
		const refreshTokenKey = "bkash:refreshToken";

		const bkashIdtoken = await redisClient.get(IdTokenKey);
		const bkashIdTokenTTL = await redisClient.ttl(IdTokenKey);
		const bkashrefreshToken = await redisClient.get(refreshTokenKey);
		const bkashrefreshTokenTTL = await redisClient.ttl(refreshTokenKey);

		if (
			(bkashIdTokenTTL <= 600 || !bkashIdtoken) &&
			bkashrefreshToken &&
			bkashrefreshTokenTTL > 600
		) {
			const response = await fetch(
				`${config.bkash_base_url}/tokenized/checkout/token/refresh`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						username: config.bkash_username,
						password: config.bkash_password,
					},
					body: JSON.stringify({
						app_key: config.bkash_app_key,
						app_secret: config.bkash_app_secret,
						refresh_token: bkashrefreshToken,
					}),
				},
			);

			if (!response.ok) {
				throw new AppError(
					httpstatus.UNAUTHORIZED,
					"bKash token refresh failed!",
				);
			}

			const result = await response.json();

			if (result.id_token) {
				await redisClient.set(IdTokenKey, result.id_token, { EX: 60 * 55 });
				return result.id_token;
			}
		}

		if (bkashIdTokenTTL > 600) {
			return bkashIdtoken;
		}

		const response = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/token/grant`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					username: config.bkash_username,
					password: config.bkash_password,
				},
				body: JSON.stringify({
					app_key: config.bkash_app_key,
					app_secret: config.bkash_app_secret,
				}),
			},
		);

		if (!response.ok) {
			throw new AppError(
				httpstatus.BAD_REQUEST,
				"bKash access token grant failed!",
			);
		}

		const result = await response.json();

		if (result.statusCode && result.statusCode !== "0000") {
			throw new AppError(
				httpstatus.BAD_REQUEST,
				result.statusMessage || "bKash Auth Error",
			);
		}

		await redisClient.set(IdTokenKey, result.id_token, { EX: 60 * 55 });
		await redisClient.set(refreshTokenKey, result.refresh_token, {
			EX: 60 * 60 * 24 * 28,
		});

		return result.id_token;
	} catch (error: any) {
		throw new AppError(
			error.statusCode || httpstatus.INTERNAL_SERVER_ERROR,
			error.message || "Something went wrong with bKash Authentication",
		);
	}
};
