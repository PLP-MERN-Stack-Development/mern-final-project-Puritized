import mongoose from "mongoose";

/**
 * Transactions are general-purpose ledger entries used for:
 * - Payouts to teachers
 * - Refunds to students
 * - Admin fees
 * - Top-ups
 */

const TransactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["payout", "refund", "payment", "fee", "topup"],
      required: true,
      index: true,
    },

    // who is the source of funds (could be a student, system or external)
    from: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: { type: String }, // optional descriptor
    },

    // who receives funds (teacher, student, admin)
    to: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      type: { type: String },
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

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },

    // link to related business objects
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    provider: {
      type: String, // e.g. paystack, stripe, bank-transfer
    },

    providerReference: {
      type: String,
    },

    // extra information useful for reconciliation
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

TransactionSchema.index({ reference: 1, status: 1 });

export default mongoose.model("Transaction", TransactionSchema);