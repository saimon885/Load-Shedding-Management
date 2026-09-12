import express, { Request, Response } from "express";
import cookieparser from "cookie-parser";

import { authRoutes } from "./modules/auth/auth.routes";
import { globalErrorHandler } from "./middleware/globalErrorHandller";
import { notFound } from "./middleware/not-found";
import { userRoutes } from "./modules/user/user.routes";
import { zoneRoutes } from "./modules/zone/zone.routes";
import { substationRoutes } from "./modules/substation/substation.routes";
import { feederRoutes } from "./modules/Feeders/feeders.routes";
import { areaRoutes } from "./modules/area/area.routes";
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

app.use(globalErrorHandler);
app.use(notFound);
