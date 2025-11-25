import mongoose from 'mongoose';

const WithdrawalSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['requested','paid','rejected'], default: 'requested' },
  metadata: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Withdrawal', WithdrawalSchema);