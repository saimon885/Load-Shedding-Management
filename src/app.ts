import express, { Request, Response } from "express";
import cookieparser from "cookie-parser";

import { authRoutes } from "./modules/auth/auth.routes";
export const app = express();
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieparser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/v1/auth", authRoutes);
