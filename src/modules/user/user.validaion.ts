import z from "zod";
export interface UpdateProfiePayload {
	name: string;
	address: string;
	phone: string;
	profileImage: string;
}

const zodUserUpdateSchema = z.object({
	name: z.string("name is required"),
	address: z.string("address is required"),
	phone: z.string("phone is required"),
	profileImage: z.string("profileImage is required"),
});
export const userValidation = {
	zodUserUpdateSchema,
};
