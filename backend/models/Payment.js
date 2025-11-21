import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },

  // amount stored in smallest currency unit (kobo/cents) for safety
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'NGN' },

  provider: { type: String, enum: ['paystack','stripe','manual','wallet','other'], default: 'paystack' },
  providerReference: { type: String, index: true }, // provider transaction ref
  providerPayload: { type: mongoose.Schema.Types.Mixed }, // raw webhook payload for audit

  status: { type: String, enum: ['pending','success','failed','refunded','cancelled'], default: 'pending', index: true },

  metadata: { type: mongoose.Schema.Types.Mixed } // e.g. { purpose: 'course_purchase' }
}, { timestamps: true });

// quick index to find recent payments
paymentSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Payment', paymentSchema);