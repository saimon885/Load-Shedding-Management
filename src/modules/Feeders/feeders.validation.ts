import z from "zod";
const FeedersCreateSchema = z.object({
	substationId: z.string("substationId is required"),
	name: z.string("name is required"),
	code: z.string("code is required"),
	capacity: z.number("capacity is required"),
});

export const feederValidation = {
	FeedersCreateSchema,
};
