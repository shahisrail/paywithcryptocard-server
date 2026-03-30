"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepositById = exports.getMyDeposits = exports.createDeposit = exports.getDepositAddresses = void 0;
const Deposit_1 = require("../../models/Deposit");
const AdminSettings_1 = require("../../models/AdminSettings");
const errors_1 = require("../../utils/errors");
const config_1 = require("../../config");
const coingecko_1 = require("../../utils/coingecko");
const getDepositAddresses = async (req, res) => {
    try {
        // Get crypto addresses from admin settings
        let settings = await AdminSettings_1.AdminSettings.findOne({});
        // If no settings exist, use defaults from config
        if (!settings) {
            settings = await AdminSettings_1.AdminSettings.create({
                cryptoAddresses: config_1.config.crypto,
            });
        }
        const addresses = settings.cryptoAddresses || config_1.config.crypto;
        res.status(200).json({
            success: true,
            data: {
                BTC: addresses.btc || config_1.config.crypto.btc,
                ETH: addresses.eth || config_1.config.crypto.eth,
                USDT_ERC20: addresses.usdtErc20 || config_1.config.crypto.usdtErc20,
                USDT_TRC20: addresses.usdtTrc20 || config_1.config.crypto.usdtTrc20,
                USDC_ERC20: addresses.usdcErc20 || config_1.config.crypto.usdcErc20,
                XMR: addresses.xmr || config_1.config.crypto.xmr,
                minimumDeposit: settings.minimumDeposit || 10,
            },
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getDepositAddresses = getDepositAddresses;
const createDeposit = async (req, res) => {
    try {
        const { currency, amount, txHash, usdAmount: frontendUsdAmount } = req.body;
        const userId = req.user?.userId;
        // Get the appropriate wallet address
        let settings = await AdminSettings_1.AdminSettings.findOne({});
        if (!settings) {
            settings = await AdminSettings_1.AdminSettings.create({
                cryptoAddresses: config_1.config.crypto,
            });
        }
        const addresses = settings.cryptoAddresses || config_1.config.crypto;
        const addressMap = {
            BTC: addresses.btc || config_1.config.crypto.btc,
            ETH: addresses.eth || config_1.config.crypto.eth,
            USDT_ERC20: addresses.usdtErc20 || config_1.config.crypto.usdtErc20,
            USDT_TRC20: addresses.usdtTrc20 || config_1.config.crypto.usdtTrc20,
            USDC_ERC20: addresses.usdcErc20 || config_1.config.crypto.usdcErc20,
            XMR: addresses.xmr || config_1.config.crypto.xmr,
        };
        const walletAddress = addressMap[currency];
        if (!walletAddress) {
            throw new errors_1.AppError('Deposit address not configured for this currency', 400);
        }
        // Use USD amount from frontend if provided, otherwise convert
        let usdAmount = 0;
        if (frontendUsdAmount && frontendUsdAmount > 0) {
            // Use the USD amount calculated by frontend
            usdAmount = frontendUsdAmount;
        }
        else {
            // Fallback: Auto-convert using CoinGecko API
            try {
                usdAmount = await (0, coingecko_1.convertToUSD)(currency, amount);
            }
            catch (error) {
                console.error('Error converting to USD:', error);
                // Continue with zero USD amount if conversion fails
            }
        }
        // Create deposit record
        const deposit = await Deposit_1.Deposit.create({
            userId,
            currency,
            amount,
            txHash,
            walletAddress,
            status: 'pending',
            usdAmount, // Store the USD amount
        });
        res.status(201).json({
            success: true,
            message: 'Deposit submitted successfully. Awaiting admin approval.',
            data: deposit,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.createDeposit = createDeposit;
const getMyDeposits = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { status, limit = 20, skip = 0 } = req.query;
        const query = { userId };
        if (status) {
            query.status = status;
        }
        const deposits = await Deposit_1.Deposit.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(Number(skip));
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
exports.getMyDeposits = getMyDeposits;
const getDepositById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const deposit = await Deposit_1.Deposit.findOne({ _id: id, userId });
        if (!deposit) {
            throw new errors_1.AppError('Deposit not found', 404);
        }
        res.status(200).json({
            success: true,
            data: deposit,
        });
    }
    catch (error) {
        throw error;
    }
};
exports.getDepositById = getDepositById;
