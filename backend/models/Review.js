import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: { type: String },
  body: { type: String },
  approved: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent duplicate review by same user for same course
reviewSchema.index({ course: 1, user: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);