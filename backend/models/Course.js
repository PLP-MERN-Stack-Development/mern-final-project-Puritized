import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  slug: { type: String, unique: true, index: true },
  description: { type: String, default: '' },
  shortDescription: { type: String, default: '' },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, index: true },
  price: { type: Number, default: 0 }, // 0 => free
  level: { type: String, enum: ['beginner','intermediate','advanced'], default: 'beginner' },
  language: { type: String, default: 'English' },
  thumbnailUrl: { type: String, default: '' },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  tags: [{ type: String }],
  meta: {
    durationMinutes: { type: Number, default: 0 },
    lessonsCount: { type: Number, default: 0 }
  }
}, { timestamps: true });

// optional text index for search
courseSchema.index({ title: 'text', description: 'text', shortDescription: 'text', tags: 'text' });

export default mongoose.model('Course', courseSchema);