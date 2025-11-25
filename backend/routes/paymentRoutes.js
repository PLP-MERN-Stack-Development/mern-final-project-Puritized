import express from "express";
import { initiatePayment, paystackWebhook } from "../controllers/paymentController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import bodyParser from "body-parser";

const router = express.Router();

// Init payment (student must be authenticated)
router.post("/initiate", requireAuth, initiatePayment);

// Webhook - Paystack calls this. Use raw body, so mount using bodyParser.json in server with same route or use raw middleware here.
router.post("/webhook", express.json({ type: "*/*" }), paystackWebhook);

export default router;