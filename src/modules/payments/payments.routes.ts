import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { paymentController } from "./payment.controller";
import { UserRole } from "../../generated/prisma/enums";

const router = Router();

router.post("/pay", auth(UserRole.CUSTOMER), paymentController.createPayment);
router.get(
	"/my-payment-history",
	auth(UserRole.CUSTOMER),
	paymentController.getMyPaymentHisotry,
);
router.get(
	"/all-payment-history",
	auth(UserRole.ADMIN),
	paymentController.getallPaymentHistory,
);
router.get("/service/payment/callback", paymentController.paymentCallback);

export const paymentRoutes = router;
