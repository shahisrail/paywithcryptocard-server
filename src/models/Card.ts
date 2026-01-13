import mongoose, { Schema } from 'mongoose';

const cardSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    expiryDate: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
      select: false,
    },
    cardHolder: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'frozen', 'terminated'],
      default: 'active',
    },
    spendingLimit: {
      type: Number,
      default: 10000,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret: any) {
        delete ret.cvv;
        delete ret.__v;
        return ret;
      },
    },
  }
);

cardSchema.index({ userId: 1, status: 1 });
cardSchema.index({ cardNumber: 1 });

export const Card = mongoose.model('Card', cardSchema);
