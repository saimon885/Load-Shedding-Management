import { Request, Response } from "express";
import { catchAsync } from "../../utility/catchAsync";
import { sendResponse } from "../../utility/sendResponse";
import httpstatus from "http-status";
import { stateService } from "./states.service";

const getAllAdminStates = catchAsync(async (req: Request, res: Response) => {
  const result = await stateService.adminStates();
  sendResponse(res, {
    success: true,
    statusCode: httpstatus.OK,
    message: "all admin states retrive successfull!",
    data: result,
  });
});

const getAllStatesOperatorAndZoneManager = catchAsync(
  async (req: Request, res: Response) => {
    const result = await stateService.zoneAndOperatorStates();
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "all operator and zonManager states retrive successfull!",
      data: result,
    });
  },
);
// const getAllStatesOfCustomer = catchAsync(
//   async (req: Request, res: Response) => {
//     sendResponse(res, {
//       success: true,
//       statusCode: httpstatus.OK,
//       message: "all admin states retrive successfull!",
//       data: "result",
//     });
//   },
// );
// const getAllStatesTechnician = catchAsync(
//   async (req: Request, res: Response) => {
//     sendResponse(res, {
//       success: true,
//       statusCode: httpstatus.OK,
//       message: "all admin states retrive successfull!",
//       data: "result",
//     });
//   },
// );

export const statesController = {
  getAllAdminStates,
  getAllStatesOperatorAndZoneManager,
};
