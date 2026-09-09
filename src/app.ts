import express, { Request, Response } from "express";
import cookieparser from "cookie-parser";
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieparser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});
