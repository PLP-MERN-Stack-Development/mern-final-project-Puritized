import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, enum: ['system','booking','message','payment','reminder','custom'], default: 'system' },
  targetUrl: { type: String, default: '' }, // where the notification links to
  read: { type: Boolean, default: false },
  meta: { type: mongoose.Schema.Types.Mixed } // extra details
}, { timestamps: true });

notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);