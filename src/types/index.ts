import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'admin';
  balance: number;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface IDeposit extends Document {
  userId: string;
  currency: 'BTC' | 'ETH' | 'USDT_ERC20' | 'USDT_TRC20' | 'XMR';
  amount: number;
  txHash?: string;
  walletAddress: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICard extends Document {
  userId: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolder: string;
  balance: number;
  status: 'active' | 'frozen' | 'terminated';
  spendingLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction extends Document {
  userId: string;
  cardId?: string;
  type: 'deposit' | 'card_create' | 'card_load' | 'purchase' | 'withdrawal';
  amount: number;
  balance: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface IAdminSettings extends Document {
  cryptoAddresses: {
    btc: string;
    eth: string;
    usdtErc20: string;
    usdtTrc20: string;
    xmr: string;
  };
  minimumDeposit: number;
  cardIssuanceFee: number;
  isActive: boolean;
  updatedAt: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    balance: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
