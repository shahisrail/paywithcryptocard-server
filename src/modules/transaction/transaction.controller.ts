import { Response } from 'express';
import { Transaction } from '../../models/Transaction';
import { AuthRequest } from '../../types';
import { AppError } from '../../utils/errors';

export const getMyTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId!;
    const { type, status, limit = 50, skip = 0 } = req.query;

    const query: any = { userId };
    if (type) query.type = type;
    if (status) query.status = status;

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(skip))
      .populate('cardId', 'cardNumber status');

    const total = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        transactions,
        total,
        limit: Number(limit),
        skip: Number(skip),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const getTransactionById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId!;

    const transaction = await Transaction.findOne({ _id: id, userId })
      .populate('cardId', 'cardNumber status');

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    throw error;
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId!;

    // Get transaction statistics
    const totalTransactions = await Transaction.countDocuments({ userId });
    const totalDeposits = await Transaction.aggregate([
      { $match: { userId, type: 'deposit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const totalCardSpend = await Transaction.aggregate([
      { $match: { userId, type: 'purchase', status: 'completed' } },
      { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('cardId', 'cardNumber');

    // Get pending deposits count
    const pendingDeposits = await Transaction.countDocuments({
      userId,
      type: 'deposit',
      status: 'pending',
    });

    res.status(200).json({
      success: true,
      data: {
        totalTransactions,
        totalDeposits: totalDeposits[0]?.total || 0,
        totalCardSpend: totalCardSpend[0]?.total || 0,
        pendingDeposits,
        recentTransactions,
      },
    });
  } catch (error) {
    throw error;
  }
};
