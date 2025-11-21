import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // student
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional tutor assigned
  scheduledAt: { type: Date, required: true, index: true },
  durationMinutes: { type: Number, default: 60 },
  location: { type: String, default: 'online' }, // could be link or physical
  notes: { type: String, default: '' },

  // statuses: pending, confirmed, cancelled, completed, no-show
  status: { type: String, enum: ['pending','confirmed','cancelled','completed','no-show'], default: 'pending', index: true },

  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' }, // optional link to payment
  meta: {
    timezone: { type: String, default: 'UTC' }
  }
}, { timestamps: true });

// helpful composite index
bookingSchema.index({ user: 1, scheduledAt: 1 });

export default mongoose.model('Booking', bookingSchema);