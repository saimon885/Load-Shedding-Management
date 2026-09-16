import z from "zod";

const zodcreateSubstationSchema = z.object({
  zoneId: z.string("ZoneId is required"),
  name: z.string("name is required"),
  code: z.string("code is required"),
  location: z.string("location is required"),
});

export const substationValidation = {
  zodcreateSubstationSchema,
};
