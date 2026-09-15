import express, { type Request, type Response } from "express";
import cookieparser from "cookie-parser";

import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandller";
import { notFound } from "./middleware/not-found";
import { userRoutes } from "./modules/user/user.routes";
import { zoneRoutes } from "./modules/zone/zone.routes";
import { substationRoutes } from "./modules/substation/substation.routes";
import { feederRoutes } from "./modules/Feeders/feeders.routes";
import { areaRoutes } from "./modules/area/area.routes";
import { outageRoutes } from "./modules/outage/outage.routes";
import { outageReportRoutes } from "./modules/outageReport/outageReport.routes";
import { AssignmentRoutes } from "./modules/technician_Assignment/assignment.routes";
import { NotificationRoutes } from "./modules/notification/notification.routes";
import { ScheduleRoutes } from "./modules/schedules/schedules.routes";
import { ServiceRoutes } from "./modules/Services/servieces.routes";
import { getBkashIdToken } from "./lib/bkash";
import { paymentRoutes } from "./modules/payments/payments.routes";
import { stateRoutes } from "./modules/states/states.routes";
export const app = express();
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieparser());

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to load-shedding management system!🔃🪫");
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/zones", zoneRoutes);
app.use("/api/v1/substations", substationRoutes);
app.use("/api/v1/feeders", feederRoutes);
app.use("/api/v1/areas", areaRoutes);
app.use("/api/v1/outages", outageRoutes);
app.use("/api/v1/outage-reports", outageReportRoutes);
app.use("/api/v1/assignments", AssignmentRoutes);
app.use("/api/v1/notifications", NotificationRoutes);
app.use("/api/v1/schedules", ScheduleRoutes);
app.use("/api/v1/service", ServiceRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/states", stateRoutes);
// app.get("/test", async (req, res, next) => {
// 	try {
// 		const bkash = await getBkashIdToken();
// 		console.log("bKash Token Result:", bkash);

// 		res.status(200).json({
// 			success: true,
// 			message: "bKash ID token fetched successfully!",
// 			data: bkash,
// 		});
// 	} catch (error) {
// 		console.error("bKash Token Error:", error);

// 		res.status(500).json({
// 			success: false,
// 			message: "Failed to fetch bKash ID token",
// 			error: error instanceof Error ? error.message : error,
// 		});
// 	}
// });

app.use(globalErrorHandler);
app.use(notFound);
