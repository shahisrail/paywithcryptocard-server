import mongoose, { Schema } from 'mongoose';

const depositSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    currency: {
      type: String,
      enum: ['BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'XMR'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    usdAmount: {
      type: Number,
      default: 0,
    },
    txHash: {
      type: String,
      sparse: true,
    },
    walletAddress: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    rejectionReason: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

depositSchema.index({ userId: 1, status: 1 });
depositSchema.index({ createdAt: -1 });

export const Deposit = mongoose.model('Deposit', depositSchema);
