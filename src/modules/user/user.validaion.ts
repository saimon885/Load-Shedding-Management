import z from "zod";

const zodUserUpdateSchema = z.object({
  data: z.object({
    name: z.string("name is required"),
    address: z.string("address is required"),
    phone: z.string("phone is required"),
  }),
});
export const userValidation = {
  zodUserUpdateSchema,
};
