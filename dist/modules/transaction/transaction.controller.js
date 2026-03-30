"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = exports.getTransactionById = exports.getMyTransactions = void 0;
const Transaction_1 = require("../../models/Transaction");
const errors_1 = require("../../utils/errors");
const getMyTransactions = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { type, status, limit = 50, skip = 0 } = req.query;
        const query = { userId };
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        const transactions = await Transaction_1.Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('cardId', 'cardNumber status');
        const total = await Transaction_1.Transaction.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                transactions,
                total,
                limit: Number(limit),
                skip: Number(skip),
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getMyTransactions = getMyTransactions;
const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const transaction = await Transaction_1.Transaction.findOne({ _id: id, userId })
            .populate('cardId', 'cardNumber status');
        if (!transaction) {
            throw new errors_1.AppError('Transaction not found', 404);
        }
        res.status(200).json({
            success: true,
            data: transaction,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getTransactionById = getTransactionById;
const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user?.userId;
        // Get transaction statistics
        const totalTransactions = await Transaction_1.Transaction.countDocuments({ userId });
        const totalDeposits = await Transaction_1.Transaction.aggregate([
            { $match: { userId, type: 'deposit', status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const totalCardSpend = await Transaction_1.Transaction.aggregate([
            { $match: { userId, type: 'purchase', status: 'completed' } },
            { $group: { _id: null, total: { $sum: { $abs: '$amount' } } } },
        ]);
        // Get recent transactions
        const recentTransactions = await Transaction_1.Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('cardId', 'cardNumber');
        // Get pending deposits count
        const pendingDeposits = await Transaction_1.Transaction.countDocuments({
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
    }
    catch (error) {
        throw error;
    }
};
exports.getDashboardStats = getDashboardStats;
