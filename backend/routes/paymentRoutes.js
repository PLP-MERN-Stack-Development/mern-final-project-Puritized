import express from "express";
import {
  initPayment,
  paystackWebhook,
  stripeWebhook
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// User initiates payment
router.post("/init", protect, initPayment);

// PAYSTACK WEBHOOK
router.post("/paystack/webhook", express.raw({ type: "*/*" }), paystackWebhook);

// STRIPE WEBHOOK
router.post("/stripe/webhook", express.raw({ type: "*/*" }), stripeWebhook);

export default router;