import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  // Optional link to course or booking for contextual chat
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  lastMessageAt: { type: Date, default: Date.now, index: true },
  unreadCounts: { type: Map, of: Number, default: {} } // map of userId -> unread count
}, { timestamps: true });

// Ensure participant set uniqueness (combination index)
conversationSchema.index({ participants: 1 }, { unique: false });

export default mongoose.model('Conversation', conversationSchema);