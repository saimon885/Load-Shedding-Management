import z from "zod";

const outageCreateSchema = z.object({
	type: z.string("type is required"),
	reason: z.string("reason is required"),
	feederId: z.string("feederId is required"),
	areaId: z.string("areaId is required"),
	startTime: z.string("startTime is required"),
	estimatedRestorationTime: z.string("estimatedRestorationTime is required"),
});

export const outage = {
	outageCreateSchema,
};
