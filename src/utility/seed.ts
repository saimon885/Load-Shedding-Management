import config from "../config";
import httpStatus from "http-status";
import { UserRole } from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { AppError } from "./AppError";

export const seedAdmin = async () => {
	try {
		const AdminExist = await prisma.user.findFirst({
			where: {
				role: UserRole.ADMIN,
			},
		});

		if (AdminExist) {
			console.log(" admin already exist");
			return;
		}
		const name = config.admin_name;
		const email = config.admin_email;
		const password = config.admin_password;
		const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				" admin credentials are not provided in the environment variables",
			);
		}
		const Admin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				role: UserRole.ADMIN,
			},
		});
		console.log("admin created", Admin);
	} catch (error) {
		console.log(error);
	}
};
export const seedOperator = async () => {
	try {
		const PowerOperatorExist = await prisma.user.findFirst({
			where: {
				role: UserRole.POWER_OPERATOR,
			},
		});

		if (PowerOperatorExist) {
			console.log(" PowerOperator already exist");
			return;
		}
		const name = config.admin_name;
		const email = config.admin_email;
		const password = config.admin_password;
		const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				" PowerOperator credentials are not provided in the environment variables",
			);
		}
		const operator = await prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				role: UserRole.POWER_OPERATOR,
			},
		});
		console.log("PowerOperator created", operator);
	} catch (error) {
		console.log(error);
	}
};
export const seedTechnician = async () => {
	try {
		const TechnicianExist = await prisma.user.findFirst({
			where: {
				role: UserRole.TECHNICIAN,
			},
		});

		if (TechnicianExist) {
			console.log(" Technician already exist");
			return;
		}
		const name = config.technician_name;
		const email = config.technician_email;
		const password = config.technician_password;
		const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				" Technician credentials are not provided in the environment variables",
			);
		}
		const Technician = await prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				role: UserRole.TECHNICIAN,
			},
		});
		console.log("Technician created", Technician);
	} catch (error) {
		console.log(error);
	}
};
export const seedZoneManager = async () => {
	try {
		const TechnicianExist = await prisma.user.findFirst({
			where: {
				role: UserRole.ZONE_MANAGER,
			},
		});

		if (TechnicianExist) {
			console.log(" ZoneManager already exist");
			return;
		}
		const name = config.zoneManager_name;
		const email = config.zoneManager_email;
		const password = config.zoneManager_password;
		const hashPassword = await bcrypt.hash(password, config.bcrypt_salt_rounds);
		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				" ZoneManager credentials are not provided in the environment variables",
			);
		}
		const ZoneManager = await prisma.user.create({
			data: {
				name,
				email,
				password: hashPassword,
				role: UserRole.ZONE_MANAGER,
			},
		});
		console.log("ZoneManager created", ZoneManager);
	} catch (error) {
		console.log(error);
	}
};
