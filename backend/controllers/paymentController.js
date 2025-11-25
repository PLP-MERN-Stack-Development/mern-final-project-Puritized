import Payment from "../models/paymentModel.js";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";
import Transaction from "../models/transactionModel.js";
import { initializePayment, verifyPayment } from "../services/paystack.js";
import dotenv from "dotenv";
dotenv.config();

const FRONTEND_BASE = process.env.FRONTEND_BASE || "http://localhost:5173";

/**
 * Initiate payment for a course
 * POST /routes/payments/initiate
 * body: { courseId }
 */
export const initiatePayment = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const amountInKobo = Math.round(course.price * 100); // assume NGN/kobo or USD/cents accordingly

    const paymentDoc = await Payment.create({
      student: req.user._id,
      course: course._id,
      amount: course.price,
      currency: course.currency || "NGN",
      provider: "paystack",
      status: "pending",
      createdBy: req.user._id,
    });

    const metadata = { paymentId: paymentDoc._id.toString(), courseId: course._id.toString() };
    const callback = `${process.env.BACKEND_BASE || ""}/routes/payments/webhook`; // paystack webhook or callback

    const init = await initializePayment({
      email: req.user.email,
      amount: amountInKobo,
      metadata,
      callback_url: `${FRONTEND_BASE}/payments/complete?reference={reference}`, // user-facing callback
    });

    if (!init.status) {
      return res.status(500).json({ message: "Failed to initialize payment", error: init });
    }

    paymentDoc.providerReference = init.data.reference;
    await paymentDoc.save();

    return res.json({ authorization_url: init.data.authorization_url, payment: paymentDoc });
  } catch (err) {
    next(err);
  }
};

/**
 * Paystack webhook handler (or verification endpoint)
 * POST /routes/payments/webhook
 * Paystack sends an event payload — verify via signature or call verify endpoint
 */
export const paystackWebhook = async (req, res) => {
  try {
    // Optionally verify the Paystack signature header (recommended)
    // const signature = req.headers['x-paystack-signature'];

    const event = req.body;
    // Example event structure: event.data.status, event.data.reference
    const reference = event?.data?.reference || event?.reference;
    if (!reference) {
      return res.status(400).json({ message: "Missing reference" });
    }

    // Verify with Paystack to be safe
    const verified = await verifyPayment(reference);
    if (!verified?.status) {
      console.error("Paystack verification failed", verified);
      return res.status(400).json({ message: "Verification failed" });
    }

    const pdata = verified.data;
    const payment = await Payment.findOne({ providerReference: pdata.reference });
    if (!payment) {
      console.warn("Payment not found for reference", pdata.reference);
      // optionally create a payment record
      return res.status(200).json({ message: "No local payment record" });
    }

    if (pdata.status === "success") {
      payment.status = "completed";
      payment.paidAt = new Date(pdata.paid_at || Date.now());
      payment.metadata = pdata;
      await payment.save();

      // Create Enrollment if not already
      const existing = await Enrollment.findOne({ student: payment.student, course: payment.course });
      if (!existing) {
        await Enrollment.create({ student: payment.student, course: payment.course, progress: 0, payment: payment._id });
        // increment course studentsCount
        await Course.findByIdAndUpdate(payment.course, { $inc: { studentsCount: 1 } });
      }

      // Create Transaction record
      await Transaction.create({
        reference: pdata.reference,
        type: "payment",
        from: { id: payment.student, type: "student" },
        to: { id: payment.course, type: "course" },
        amount: payment.amount,
        currency: payment.currency,
        status: "success",
        payment: payment._id,
        provider: "paystack",
        providerReference: pdata.reference,
        metadata: pdata,
      });
    } else {
      payment.status = "failed";
      payment.metadata = pdata;
      await payment.save();
    }

    // respond 200 quickly
    return res.status(200).json({ message: "Processed" });
  } catch (err) {
    console.error("webhook error", err);
    return res.status(500).json({ message: "Server error" });
  }
};