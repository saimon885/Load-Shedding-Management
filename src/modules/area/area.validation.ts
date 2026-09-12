import z from "zod";

const areaCreateSchema = z.object({
	feederId: z.string("feederId is required"),
	name: z.string("name is required"),
	code: z.string("code is required"),
	description: z.string("description is required"),
});

export const areaValidation = {
	areaCreateSchema,
};
