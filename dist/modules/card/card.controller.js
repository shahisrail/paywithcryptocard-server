"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.terminateCard = exports.freezeCard = exports.loadCard = exports.getCardById = exports.getMyCards = exports.createCard = void 0;
const Card_1 = require("../../models/Card");
const User_1 = require("../../models/User");
const Transaction_1 = require("../../models/Transaction");
const AdminSettings_1 = require("../../models/AdminSettings");
const errors_1 = require("../../utils/errors");
const generateCardNumber_1 = require("../../utils/generateCardNumber");
const createCard = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { spendingLimit = 10000 } = req.body;
        // Get user
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // STRICT FLOW: Block card creation if balance is 0 or negative
        if (user.balance <= 0) {
            throw new errors_1.AppError('Please add funds to your account before creating a card. You need a minimum balance to proceed.', 400);
        }
        // Get card issuance fee
        let settings = await AdminSettings_1.AdminSettings.findOne({});
        const cardFee = settings?.cardIssuanceFee || 5;
        // Check if user has enough balance for card fee
        if (user.balance < cardFee) {
            throw new errors_1.AppError(`Your balance is insufficient to create a card. A one-time issuance fee of $${cardFee} is required. Please add more funds to continue.`, 400);
        }
        // Check if user already has an active card
        const existingActiveCard = await Card_1.Card.findOne({
            userId,
            status: 'active',
        });
        if (existingActiveCard) {
            throw new errors_1.AppError('You already have an active card. Please freeze or terminate your existing card before creating a new one, or contact support for assistance.', 400);
        }
        // Generate card details
        const cardNumber = (0, generateCardNumber_1.generateCardNumber)();
        const expiryDate = (0, generateCardNumber_1.generateExpiryDate)();
        const cvv = (0, generateCardNumber_1.generateCVV)();
        // Create card
        const card = await Card_1.Card.create({
            userId,
            cardNumber,
            expiryDate,
            cvv,
            cardHolder: user.fullName,
            balance: 0,
            status: 'active',
            spendingLimit,
        });
        // Deduct card fee from user balance
        user.balance -= cardFee;
        await user.save();
        // Create transaction record
        await Transaction_1.Transaction.create({
            userId,
            cardId: card._id,
            type: 'card_create',
            amount: -cardFee,
            balance: user.balance,
            status: 'completed',
            description: `Virtual card issuance fee`,
        });
        // Fetch card with CVV for one-time display
        const cardWithCVV = await Card_1.Card.findById(card._id).select('+cvv');
        res.status(201).json({
            success: true,
            message: 'Card created successfully',
            data: {
                ...cardWithCVV?.toObject(),
                _id: card._id.toString(),
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.createCard = createCard;
const getMyCards = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const cards = await Card_1.Card.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: cards,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getMyCards = getMyCards;
const getCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const card = await Card_1.Card.findOne({ _id: id, userId });
        if (!card) {
            throw new errors_1.AppError('Card not found', 404);
        }
        res.status(200).json({
            success: true,
            data: card,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getCardById = getCardById;
const loadCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        const userId = req.user?.userId;
        if (amount <= 0) {
            throw new errors_1.AppError('Please enter an amount greater than $0.', 400);
        }
        // Get user
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw new errors_1.AppError('User not found', 404);
        }
        // Check if user has enough balance
        if (user.balance < amount) {
            throw new errors_1.AppError(`Insufficient balance. You have $${user.balance.toFixed(2)} but trying to load $${amount.toFixed(2)}. Please add more funds.`, 400);
        }
        // Get card
        const card = await Card_1.Card.findOne({ _id: id, userId, status: 'active' });
        if (!card) {
            throw new errors_1.AppError('Card not found or inactive. Only active cards can be loaded with funds.', 404);
        }
        // Load card
        card.balance += amount;
        await card.save();
        // Deduct from user balance
        user.balance -= amount;
        await user.save();
        // Create transaction record
        await Transaction_1.Transaction.create({
            userId,
            cardId: card._id,
            type: 'card_load',
            amount: -amount,
            balance: user.balance,
            status: 'completed',
            description: `Loaded $${amount.toFixed(2)} to card ending in ${card.cardNumber.slice(-4)}`,
        });
        res.status(200).json({
            success: true,
            message: `Card loaded with $${amount.toFixed(2)} successfully`,
            data: {
                cardBalance: card.balance,
                userBalance: user.balance,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.loadCard = loadCard;
const freezeCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const card = await Card_1.Card.findOne({ _id: id, userId });
        if (!card) {
            throw new errors_1.AppError('Card not found', 404);
        }
        if (card.status === 'terminated') {
            throw new errors_1.AppError('Cannot freeze a terminated card', 400);
        }
        card.status = card.status === 'active' ? 'frozen' : 'active';
        await card.save();
        res.status(200).json({
            success: true,
            message: `Card ${card.status === 'frozen' ? 'frozen' : 'activated'} successfully`,
            data: card,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.freezeCard = freezeCard;
const terminateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const card = await Card_1.Card.findOne({ _id: id, userId });
        if (!card) {
            throw new errors_1.AppError('Card not found', 404);
        }
        if (card.status === 'terminated') {
            throw new errors_1.AppError('Card is already terminated', 400);
        }
        // Refund remaining balance to user
        const cardBalance = card.balance;
        const cardNumber = card.cardNumber;
        if (cardBalance > 0) {
            const user = await User_1.User.findById(userId);
            if (user) {
                const userBalance = user.balance;
                user.balance = userBalance + cardBalance;
                await user.save();
                await Transaction_1.Transaction.create({
                    userId,
                    cardId: card._id,
                    type: 'withdrawal',
                    amount: cardBalance,
                    balance: user.balance,
                    status: 'completed',
                    description: `Refund from terminated card ending in ${cardNumber.slice(-4)}`,
                });
            }
        }
        card.status = 'terminated';
        card.balance = 0;
        await card.save();
        res.status(200).json({
            success: true,
            message: 'Card terminated successfully',
            data: card,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.terminateCard = terminateCard;
