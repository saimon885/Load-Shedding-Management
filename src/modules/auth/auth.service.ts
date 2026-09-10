import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { redisClient } from "../../lib/redis";
import config from "../../config";
const RegisterUser = async (payload: any) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (userExists) {
    throw new Error("User already exists");
  }
  const hashPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds as string,
  );

  const OTP = crypto.randomInt(100000, 999999).toString();
  const OTPKEY = `customer-registration-otp:${payload.email}`;
  await redisClient.set(OTPKEY, OTP, {
    expiration: {
      type: "EX",
      value: 5 * 60,
    },
  });

  const customarRegistrationKey = `customer-registration:${payload.email}`;
  const customarPayload = {
    name: payload.name,
    email: payload.email,
    password: hashPassword,
  };
  await redisClient.set(
    customarRegistrationKey,
    JSON.stringify(customarPayload),
    { expiration: { type: "EX", value: 5 * 60 } },
  );
};
const loginUser = () => {};
const verifyEmail = () => {};
const forgotPassword = () => {};

export const authService = {
  RegisterUser,
  loginUser,
  verifyEmail,
  forgotPassword,
};
