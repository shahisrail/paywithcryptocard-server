import mongoose, { Schema } from 'mongoose';

const adminSettingsSchema = new Schema(
  {
    cryptoAddresses: {
      btc: { type: String, default: '' },
      eth: { type: String, default: '' },
      usdtErc20: { type: String, default: '' },
      usdtTrc20: { type: String, default: '' },
      xmr: { type: String, default: '' },
    },
    qrCodeImages: {
      btc: { type: String, default: '' },
      eth: { type: String, default: '' },
      usdtErc20: { type: String, default: '' },
      usdtTrc20: { type: String, default: '' },
      xmr: { type: String, default: '' },
    },
    minimumDeposit: {
      type: Number,
      default: 10,
    },
    cardIssuanceFee: {
      type: Number,
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AdminSettings = mongoose.model('AdminSettings', adminSettingsSchema);
