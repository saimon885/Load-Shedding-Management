import z from "zod";

const createReportSchema = z.object({
  areaId: z.string("areaId is required"),
  description: z.string("description is required"),
});
const outageReportStatusSchema = z.object({
  status: z.string("status is required"),
});

export const outageReport = {
  createReportSchema,
  outageReportStatusSchema,
};
