import z from "zod";

const zodCrateZoneSchema = z.object({
  name: z.string("name is required"),
  code: z.string("code is required"),
  description: z.string("description is required"),
});

export const zoneValidation = {
  zodCrateZoneSchema,
};
