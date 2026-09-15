import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

export const paymentRoutes = router;
