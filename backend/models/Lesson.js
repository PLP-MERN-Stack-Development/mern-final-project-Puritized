import mongoose from 'mongoose';

const videoProviderEnum = ['s3','mux','vimeo','youtube','external'];

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true },
  slug: { type: String, index: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
  durationSeconds: { type: Number, default: 0 },

  // Video hosting fields (MVP accepts signed URLs)
  video: {
    provider: { type: String, enum: videoProviderEnum, default: 's3' },
    url: { type: String },             // public or signed URL
    s3Key: { type: String },           // optional S3 key if using server uploads
    muxPlaybackId: { type: String },   // mux-specific ids
    vimeoId: { type: String },         // vimeo id
    transcodingStatus: { type: String } // optional: pending/processing/ready/failed
  },

  resources: [
    {
      label: { type: String },
      url: { type: String }
    }
  ],

  isPreview: { type: Boolean, default: false }, // free preview lesson
  contentType: { type: String, enum: ['video','article','quiz','live'], default: 'video' },

  // Live session support (optional)
  live: {
    isLive: { type: Boolean, default: false },
    scheduledAt: { type: Date },
    durationMinutes: { type: Number }
  }
}, { timestamps: true });

lessonSchema.index({ course: 1, order: 1 });

export default mongoose.model('Lesson', lessonSchema);