import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional for group chat
  content: { type: String, default: '' },
  type: { type: String, enum: ['text','image','file','system','reaction','videoLink'], default: 'text' },
  attachments: [
    {
      url: { type: String },
      filename: { type: String },
      size: { type: Number }
    }
  ],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  meta: {
    delivered: { type: Boolean, default: false },
    deliveredAt: { type: Date }
  }
}, { timestamps: true });

messageSchema.index({ conversation: 1, createdAt: -1 });

export default mongoose.model('Message', messageSchema);
