import type { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpStatus from "http-status";
import { assignmentService } from "./assignment.service";

const createAssignment = catchAsync(async (req: Request, res: Response) => {
  const result = await assignmentService.createAssignment(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "assginment created Successfully.",
    data: result,
  });
});
const updateAssignmentStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const currentUserId = req.user?.userId;
    const currentUserRole = req.user?.role;
    const result = await assignmentService.updateAssignmentStatus(
      id as string,
      status,
      currentUserId as string,
      currentUserRole as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "assginment created Successfully.",
      data: result,
    });
  },
);

export const assignmentController = {
  createAssignment,
  updateAssignmentStatus,
};
