"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminPassword = exports.deleteAdmin = exports.updateAdminStatus = exports.createAdmin = exports.getAllAdmins = exports.updateSettings = exports.getSettings = exports.getAllTransactions = exports.updateCardStatus = exports.getAllCards = exports.rejectDeposit = exports.approveDeposit = exports.getPendingDeposits = exports.getAllDeposits = exports.updateUserBalance = exports.updateUserStatus = exports.getUserById = exports.getAllUsers = exports.getDashboardStats = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Deposit_1 = require("../../models/Deposit");
const User_1 = require("../../models/User");
const Card_1 = require("../../models/Card");
const Transaction_1 = require("../../models/Transaction");
const AdminSettings_1 = require("../../models/AdminSettings");
const errors_1 = require("../../utils/errors");
const getDashboardStats = async (req, res) => {
    try {
        // Get platform statistics
        const totalUsers = await User_1.User.countDocuments({ role: 'user' });
        const activeUsers = await User_1.User.countDocuments({ role: 'user', isActive: true });
        const totalCards = await Card_1.Card.countDocuments({ status: 'active' });
        const pendingDeposits = await Deposit_1.Deposit.countDocuments({ status: 'pending' });
        // Calculate total platform balance
        const balanceResult = await User_1.User.aggregate([
            { $match: { role: 'user' } },
            { $group: { _id: null, total: { $sum: '$balance' } } },
        ]);
        // Get recent users
        const recentUsers = await User_1.User.find({ role: 'user' })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('email fullName balance isActive createdAt');
        // Get pending deposits list
        const pendingDepositsList = await Deposit_1.Deposit.find({ status: 'pending' })
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'email fullName');
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                totalCards,
                pendingDeposits,
                totalPlatformBalance: balanceResult[0]?.total || 0,
                recentUsers,
                pendingDepositsList,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllUsers = async (req, res) => {
    try {
        const { search = '', status = 'all', limit = 50, skip = 0, } = req.query;
        const query = { role: 'user' };
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
            ];
        }
        if (status === 'active') {
            query.isActive = true;
        }
        else if (status === 'inactive') {
            query.isActive = false;
        }
        const users = await User_1.User.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .select('-password');
        const total = await User_1.User.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                users,
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
exports.getAllUsers = getAllUsers;
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.User.findOne({ _id: id, role: 'user' }).select('-password');
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // Get user's cards
        const cards = await Card_1.Card.find({ userId: id }).sort({ createdAt: -1 });
        // Get user's recent transactions
        const transactions = await Transaction_1.Transaction.find({ userId: id })
            .sort({ createdAt: -1 })
            .limit(10);
        // Get user's deposits
        const deposits = await Deposit_1.Deposit.find({ userId: id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.status(200).json({
            success: true,
            data: {
                user,
                cards,
                transactions,
                deposits,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getUserById = getUserById;
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const user = await User_1.User.findOne({ _id: id, role: 'user' });
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        user.isActive = isActive;
        await user.save();
        res.status(200).json({
            success: true,
            message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: user,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateUserStatus = updateUserStatus;
const updateUserBalance = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, reason } = req.body;
        if (typeof amount !== 'number') {
            throw new errors_1.AppError('Amount must be a number', 400);
        }
        const user = await User_1.User.findOne({ _id: id, role: 'user' });
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        const oldBalance = user.balance;
        user.balance += amount;
        if (user.balance < 0) {
            throw new errors_1.AppError('Insufficient balance', 400);
        }
        await user.save();
        // Create transaction record
        await Transaction_1.Transaction.create({
            userId: user._id,
            type: amount > 0 ? 'deposit' : 'withdrawal',
            amount: Math.abs(amount),
            balance: user.balance,
            status: 'completed',
            description: reason || `Balance adjustment by admin`,
            metadata: {
                adminAction: true,
                oldBalance,
                newBalance: user.balance,
            },
        });
        res.status(200).json({
            success: true,
            message: 'User balance updated successfully',
            data: {
                userId: user._id,
                oldBalance,
                newBalance: user.balance,
                adjustment: amount,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateUserBalance = updateUserBalance;
const getAllDeposits = async (req, res) => {
    try {
        const { limit = 50, skip = 0, currency, status } = req.query;
        const query = {};
        // Filter by status if provided (pending, approved, rejected, or all)
        if (status && status !== 'all') {
            query.status = status;
        }
        if (currency) {
            query.currency = currency;
        }
        const deposits = await Deposit_1.Deposit.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('userId', 'email fullName');
        const total = await Deposit_1.Deposit.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                deposits,
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
exports.getAllDeposits = getAllDeposits;
const getPendingDeposits = async (req, res) => {
    try {
        const { limit = 50, skip = 0, currency } = req.query;
        const query = { status: 'pending' };
        if (currency) {
            query.currency = currency;
        }
        const deposits = await Deposit_1.Deposit.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('userId', 'email fullName');
        const total = await Deposit_1.Deposit.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                deposits,
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
exports.getPendingDeposits = getPendingDeposits;
const approveDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { usdAmount } = req.body;
        if (!usdAmount || usdAmount <= 0) {
            throw new errors_1.AppError('Please provide the USD amount', 400);
        }
        const deposit = await Deposit_1.Deposit.findById(id);
        if (!deposit) {
            throw new errors_1.AppError('Deposit not found', 404);
        }
        if (deposit.status !== 'pending') {
            throw new errors_1.AppError('Deposit has already been processed', 400);
        }
        // Update deposit status
        deposit.status = 'approved';
        await deposit.save();
        // Update user balance
        const user = await User_1.User.findById(deposit.userId);
        if (user) {
            const oldBalance = user.balance;
            user.balance += usdAmount;
            await user.save();
            // Create transaction record
            await Transaction_1.Transaction.create({
                userId: user._id,
                type: 'deposit',
                amount: usdAmount,
                balance: user.balance,
                status: 'completed',
                description: `Crypto deposit: ${deposit.currency}`,
                metadata: {
                    depositId: deposit._id,
                    cryptoAmount: deposit.amount,
                    cryptoCurrency: deposit.currency,
                    txHash: deposit.txHash,
                    usdAmount: usdAmount,
                },
            });
        }
        res.status(200).json({
            success: true,
            message: 'Deposit approved successfully',
            data: deposit,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.approveDeposit = approveDeposit;
const rejectDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const deposit = await Deposit_1.Deposit.findById(id);
        if (!deposit) {
            throw new errors_1.AppError('Deposit not found', 404);
        }
        if (deposit.status !== 'pending') {
            throw new errors_1.AppError('Deposit has already been processed', 400);
        }
        // Update deposit status
        deposit.status = 'rejected';
        deposit.rejectionReason = reason || 'Deposit rejected';
        await deposit.save();
        res.status(200).json({
            success: true,
            message: 'Deposit rejected successfully',
            data: deposit,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.rejectDeposit = rejectDeposit;
const getAllCards = async (req, res) => {
    try {
        const { status = 'all', limit = 50, skip = 0 } = req.query;
        const query = {};
        if (status !== 'all') {
            query.status = status;
        }
        const cards = await Card_1.Card.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('userId', 'email fullName');
        const total = await Card_1.Card.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                cards,
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
exports.getAllCards = getAllCards;
const updateCardStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['active', 'frozen', 'terminated'].includes(status)) {
            throw new errors_1.AppError('Invalid status', 400);
        }
        const card = await Card_1.Card.findById(id);
        if (!card) {
            throw new errors_1.AppError('Card not found', 404);
        }
        // If terminating, refund balance
        if (status === 'terminated' && card.balance > 0) {
            const user = await User_1.User.findById(card.userId);
            if (user) {
                user.balance += card.balance;
                await user.save();
                await Transaction_1.Transaction.create({
                    userId: user._id,
                    cardId: card._id,
                    type: 'withdrawal',
                    amount: card.balance,
                    balance: user.balance,
                    status: 'completed',
                    description: `Refund from terminated card (admin action)`,
                });
            }
            card.balance = 0;
        }
        card.status = status;
        await card.save();
        res.status(200).json({
            success: true,
            message: `Card ${status} successfully`,
            data: card,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateCardStatus = updateCardStatus;
const getAllTransactions = async (req, res) => {
    try {
        const { type, status, limit = 50, skip = 0, } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        const transactions = await Transaction_1.Transaction.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .populate('userId', 'email fullName')
            .populate('cardId', 'cardNumber');
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
exports.getAllTransactions = getAllTransactions;
const getSettings = async (req, res) => {
    try {
        let settings = await AdminSettings_1.AdminSettings.findOne({});
        if (!settings) {
            settings = await AdminSettings_1.AdminSettings.create({
                cryptoAddresses: {
                    btc: '',
                    eth: '',
                    usdtErc20: '',
                    usdtTrc20: '',
                    usdcErc20: '',
                    xmr: '',
                },
                minimumDeposit: 10,
                cardIssuanceFee: 5,
                isActive: true,
            });
        }
        res.status(200).json({
            success: true,
            data: settings,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getSettings = getSettings;
const updateSettings = async (req, res) => {
    try {
        const { cryptoAddresses, minimumDeposit, cardIssuanceFee, isActive, } = req.body;
        let settings = await AdminSettings_1.AdminSettings.findOne({});
        if (!settings) {
            settings = new AdminSettings_1.AdminSettings({});
        }
        if (cryptoAddresses) {
            settings.cryptoAddresses = {
                ...settings.cryptoAddresses,
                ...cryptoAddresses,
            };
        }
        if (typeof minimumDeposit === 'number') {
            settings.minimumDeposit = minimumDeposit;
        }
        if (typeof cardIssuanceFee === 'number') {
            settings.cardIssuanceFee = cardIssuanceFee;
        }
        if (typeof isActive === 'boolean') {
            settings.isActive = isActive;
        }
        await settings.save();
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully',
            data: settings,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateSettings = updateSettings;
// ==================== Admin Management Functions ====================
const getAllAdmins = async (req, res) => {
    try {
        const { limit = 50, skip = 0, search = '' } = req.query;
        const query = { role: 'admin' };
        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { fullName: { $regex: search, $options: 'i' } },
            ];
        }
        const admins = await User_1.User.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip))
            .select('-password');
        const total = await User_1.User.countDocuments(query);
        res.status(200).json({
            success: true,
            data: {
                admins,
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
exports.getAllAdmins = getAllAdmins;
const createAdmin = async (req, res) => {
    try {
        const { email, password, fullName } = req.body;
        // Validate input
        if (!email || !password || !fullName) {
            throw new errors_1.AppError('Email, password, and full name are required', 400);
        }
        // Check if email already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            throw new errors_1.AppError('Email already exists', 400);
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create admin
        const admin = await User_1.User.create({
            email,
            password: hashedPassword,
            fullName,
            role: 'admin',
            balance: 0,
            isActive: true,
            isEmailVerified: true,
        });
        // Return admin without password using destructuring
        const { password: _, ...adminResponse } = admin.toObject();
        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: adminResponse,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.createAdmin = createAdmin;
const updateAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const currentAdminId = req.user?.userId;
        // Prevent admin from deactivating themselves
        if (id === currentAdminId) {
            throw new errors_1.AppError('You cannot deactivate yourself', 400);
        }
        const admin = await User_1.User.findOne({ _id: id, role: 'admin' });
        if (!admin) {
            throw new errors_1.AppError('Admin not found', 404);
        }
        admin.isActive = isActive;
        await admin.save();
        // Return admin without password using destructuring
        const { password: _, ...adminResponse } = admin.toObject();
        res.status(200).json({
            success: true,
            message: `Admin ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: adminResponse,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateAdminStatus = updateAdminStatus;
const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const currentAdminId = req.user?.userId;
        // Prevent admin from deleting themselves
        if (id === currentAdminId) {
            throw new errors_1.AppError('You cannot delete yourself', 400);
        }
        const admin = await User_1.User.findOne({ _id: id, role: 'admin' });
        if (!admin) {
            throw new errors_1.AppError('Admin not found', 404);
        }
        await User_1.User.deleteOne({ _id: id });
        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
        });
    }
    catch (error) {
        throw error;
    }
};
exports.deleteAdmin = deleteAdmin;
const updateAdminPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { newPassword } = req.body;
        if (!newPassword || newPassword.length < 6) {
            throw new errors_1.AppError('New password must be at least 6 characters long', 400);
        }
        const admin = await User_1.User.findOne({ _id: id, role: 'admin' });
        if (!admin) {
            throw new errors_1.AppError('Admin not found', 404);
        }
        // Hash new password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, salt);
        admin.password = hashedPassword;
        await admin.save();
        res.status(200).json({
            success: true,
            message: 'Admin password updated successfully',
        });
    }
    catch (error) {
        throw error;
    }
};
exports.updateAdminPassword = updateAdminPassword;
