import z from "zod";

const zodPaitentRegisterSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  phone: z.string().optional(),
  address: z.string().optional(),
  profileImage: z.string().optional(),
});
const zodPaitentLoginSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});
const zodPaitentVerifySchema = z.object({
  email: z.email("Email is required"),
  otp: z.string("OTP is required").min(6),
  type: z.string("Type is required"),
});

export const authValidation = {
  zodPaitentRegisterSchema,
  zodPaitentLoginSchema,
  zodPaitentVerifySchema,
};
