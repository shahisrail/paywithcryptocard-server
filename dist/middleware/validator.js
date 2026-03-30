"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardValidation = exports.depositValidation = exports.loginValidation = exports.registerValidation = exports.handleValidationErrors = void 0;
const express_validator_1 = require("express-validator");
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.type,
                message: err.msg
            }))
        });
        return;
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.registerValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (0, express_validator_1.body)('fullName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Full name must be between 2 and 50 characters'),
];
exports.loginValidation = [
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage('Password is required'),
];
exports.depositValidation = [
    (0, express_validator_1.body)('currency')
        .isIn(['BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'XMR'])
        .withMessage('Invalid cryptocurrency'),
    (0, express_validator_1.body)('amount')
        .isFloat({ min: 0.00000001 })
        .withMessage('Amount must be greater than 0'),
    (0, express_validator_1.body)('txHash')
        .optional()
        .isLength({ min: 10 })
        .withMessage('Invalid transaction hash'),
];
exports.cardValidation = [
    (0, express_validator_1.body)('spendingLimit')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Spending limit must be greater than 0'),
];
