import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { redisClient } from "../../lib/redis";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";
import { jwtUtils } from "../../utility/jwt";
import ejs from "ejs";
import path from "path";
import type {
	LoginPayload,
	RegisterPayload,
	resetPassPayload,
	verifyEmailPayload,
} from "./auth.interface";
import { type JwtPayload, SignOptions } from "jsonwebtoken";

const RegisterUser = async (payload: RegisterPayload) => {
	const userExists = await prisma.user.findUnique({
		where: { email: payload.email },
	});
	if (userExists) {
		throw new Error("User already exists");
	}
	const hashPassword = await bcrypt.hash(
		payload.password,
		config.bcrypt_salt_rounds,
	);
	const OTP = crypto.randomInt(100000, 1000000).toString();
	const OTPKEY = `customer-registration-otp:${payload.email}`;
	await redisClient.set(OTPKEY, OTP, {
		expiration: { type: "EX", value: 5 * 60 },
	});
	const customarRegistrationKey = `customer-registration:${payload.email}`;
	const customarPayload = {
		name: payload.name,
		email: payload.email,
		password: hashPassword,
		phone: payload.phone || "",
		address: payload.address || "",
		profileImage: payload.profileImage || "",
	};
	await redisClient.set(
		customarRegistrationKey,
		JSON.stringify(customarPayload),
		{ expiration: { type: "EX", value: 5 * 60 } },
	);
	const tampletPath = path.join(
		process.cwd(),
		"/src/templates/register.tamplete.ejs",
	);
	const html = await ejs.renderFile(tampletPath, {
		name: payload.name,
		OTP,
		expiryMinutes: 5,
		year: new Date().getFullYear(),
	});
	await transporter.sendMail({
		from: config.email_sender,
		to: payload.email,
		subject: "Verify your email - Load Shedding Management",
		html,
	});
	return { message: "OTP sent to your email for verification" };
};

const loginUser = async (payload: LoginPayload) => {
	const { email, password } = payload;
	const userExist = await prisma.user.findUnique({ where: { email } });
	if (!userExist) {
		throw new Error("User not found");
	}
	if (userExist.status === "BLOCKED") {
		throw new Error("Your account is blocked. Please contact support.");
	}
	const isMatch = await bcrypt.compare(password, userExist.password);
	if (!isMatch) {
		throw new Error("Invalid credentials");
	}
	const OTP = crypto.randomInt(100000, 1000000).toString();
	const LOGIN_OTP_KEY = `customer-login-otp:${email}`;
	await redisClient.set(LOGIN_OTP_KEY, OTP, {
		expiration: { type: "EX", value: 5 * 60 },
	});
	const tampletPath = path.join(
		process.cwd(),
		"/src/templates/login.tamplete.ejs",
	);
	const html = await ejs.renderFile(tampletPath, {
		name: userExist.name,
		OTP,
		expiryMinutes: 5,
		year: new Date().getFullYear(),
	});
	await transporter.sendMail({
		from: config.email_sender,
		to: email,
		subject: "Login verification - Load Shedding Management",
		html,
	});
	return { message: "Login OTP sent to your email" };
};

const verifyEmail = async (payload: verifyEmailPayload) => {
	const { email, otp, type } = payload;
	if (type === "LOGIN") {
		const LOGIN_OTP_KEY = `customer-login-otp:${email}`;
		const storedOTP = await redisClient.get(LOGIN_OTP_KEY);
		if (!storedOTP) {
			throw new Error("OTP not found or expired");
		}
		if (storedOTP !== otp) {
			throw new Error("OTP does not match!");
		}
		await redisClient.del(LOGIN_OTP_KEY);
		const user = await prisma.user.findUnique({
			where: { email },
			omit: { password: true },
		});
		if (!user) {
			throw new Error("User not found");
		}
		if (user.status === "BLOCKED") {
			throw new Error("Account is blocked.");
		}
		const jwtPayload = {
			userId: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		};
		const successTemplatePath = path.join(
			process.cwd(),
			"/src/templates/verification.success.tamplete.ejs",
		);

		const successHtml = await ejs.renderFile(successTemplatePath, {
			name: user.name,
			email: user.email,
			year: new Date().getFullYear(),
		});

		await transporter.sendMail({
			from: config.email_sender,
			to: user.email,
			subject: "Welcome to Load Shedding Management",
			html: successHtml,
		});
		const accessToken = jwtUtils.createToken(
			jwtPayload,
			config.jwt_access_secret,
			config.jwt_access_expire_in || "15m",
		);
		const refreshToken = jwtUtils.createToken(
			jwtPayload,
			config.jwt_refresh_secret,
			config.jwt_refresh_expire_in || "7d",
		);
		return { accessToken, refreshToken, user };
	}

	const OTPKEY = `customer-registration-otp:${email}`;
	const storedOTP = await redisClient.get(OTPKEY);
	if (!storedOTP) {
		throw new Error("OTP not found or expired");
	}
	if (storedOTP !== otp) {
		throw new Error("OTP does not match!");
	}
	const customarRegistrationKey = `customer-registration:${email}`;
	const customarPayload = await redisClient.get(customarRegistrationKey);
	if (!customarPayload) {
		throw new Error("Registration data not found or expired");
	}
	const parsedPayload = JSON.parse(customarPayload);
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) {
		throw new Error("User already exists");
	}
	const result = await prisma.user.create({
		data: {
			name: parsedPayload.name,
			email: parsedPayload.email,
			password: parsedPayload.password,
			role: "CUSTOMER",
			profile: {
				create: {
					phone: parsedPayload.phone || "",
					address: parsedPayload.address || "",
					profileImage: parsedPayload.profileImage || "",
				},
			},
		},
		omit: { password: true },
	});
	const successTemplatePath = path.join(
		process.cwd(),
		"/src/templates/verification.success.tamplete.ejs",
	);

	const successHtml = await ejs.renderFile(successTemplatePath, {
		name: result.name,
		email: result.email,
		year: new Date().getFullYear(),
	});

	await transporter.sendMail({
		from: config.email_sender,
		to: result.email,
		subject: "Welcome to Load Shedding Management",
		html: successHtml,
	});

	await redisClient.del(OTPKEY);
	await redisClient.del(customarRegistrationKey);
	const jwtPayload = {
		userId: result.id,
		name: result.name,
		email: result.email,
		role: result.role,
	};
	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expire_in || "15m",
	);
	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expire_in || "7d",
	);
	return { accessToken, refreshToken, user: result };
};

const forgotPassword = async (payload: { email: string }) => {
	const { email } = payload;
	const isUserExist = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (!isUserExist) {
		throw new Error("User does not exist");
	}
	if (isUserExist.status === "BLOCKED") {
		throw new Error("User is blocked");
	}
	if (isUserExist.status === "DELETED") {
		throw new Error("User is deleted");
	}
	const OTP = crypto.randomInt(100000, 1000000).toString();
	const key = `forgot-password-otp:${isUserExist.email}`;
	await redisClient.set(key, OTP, {
		expiration: {
			type: "EX",
			value: 5 * 60,
		},
	});
	const tampletPath = path.join(
		process.cwd(),
		"/src/templates/forgot.password.ejs",
	);
	const html = await ejs.renderFile(tampletPath, {
		name: isUserExist.name,
		OTP,
		expiryMinutes: 5,
		year: new Date().getFullYear(),
	});

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		html,
		subject: "Password Reset Request",
	});
};

const resetPassword = async (payload: resetPassPayload) => {
	const { email, newPassword, otp } = payload;
	const isUserExist = await prisma.user.findUnique({
		where: {
			email,
		},
	});
	if (!isUserExist) {
		throw new Error("User does not exist");
	}

	if (isUserExist.status === "BLOCKED") {
		throw new Error("User is blocked");
	}
	if (isUserExist.status === "DELETED") {
		throw new Error("User is deleted");
	}

	const key = `forgot-password-otp:${isUserExist.email}`;
	const redisOtp = await redisClient.get(key);
	if (!redisOtp) {
		throw new Error("OTP not found");
	}
	if (redisOtp !== otp) {
		throw new Error("OTP does not matched!");
	}
	const hashedPassword = await bcrypt.hash(
		newPassword,
		config.bcrypt_salt_rounds,
	);
	await prisma.user.update({
		where: {
			email: isUserExist.email,
		},
		data: {
			password: hashedPassword,
		},
	});
	await redisClient.del([key]);
	const templatePath = path.join(
		process.cwd(),
		"/src/templates/password.reset.success.ejs",
	);
	const html = await ejs.renderFile(templatePath, {
		name: isUserExist.name,
		year: new Date().getFullYear(),
	});

	await transporter.sendMail({
		from: config.email_sender,
		to: isUserExist.email,
		html,
		subject: "Password Reset Successful - Load Shedding Management",
	});
};

const refreshToken = async (token: string) => {
	const verifiedRefreshToken = jwtUtils.verifyToken(
		token,
		config.jwt_refresh_secret,
	);

	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
		throw new Error(
			config.node_env === "development"
				? verifiedRefreshToken.error
				: "Invalid refresh token",
		);
	}

	const data = verifiedRefreshToken.data as JwtPayload;

	const user = await prisma.user.findUnique({
		where: { id: data.userId },
	});

	if (!user) {
		throw new Error("Usernot found");
	}

	const jwtPayload = {
		userId: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expire_in,
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expire_in,
	);

	return {
		accessToken,
		refreshToken,
	};
};

export const authService = {
	RegisterUser,
	loginUser,
	verifyEmail,
	forgotPassword,
	resetPassword,
	refreshToken,
};
