import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "USD",
    },

    provider: {
      type: String, // e.g. paystack, stripe, paypal
      required: true,
    },

    providerReference: {
      type: String,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    paidAt: Date,

    // Arbitrary provider payload
    metadata: {
      type: Object,
      default: {},
    },

    // useful for reconciliation
    fees: {
      type: Number,
      default: 0,
    },

    // who created the payment record (system/admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);