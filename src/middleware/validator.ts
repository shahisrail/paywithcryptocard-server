import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

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

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const depositValidation = [
  body('currency')
    .isIn(['BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'XMR'])
    .withMessage('Invalid cryptocurrency'),
  body('amount')
    .isFloat({ min: 0.00000001 })
    .withMessage('Amount must be greater than 0'),
  body('txHash')
    .optional()
    .isLength({ min: 10 })
    .withMessage('Invalid transaction hash'),
];

export const cardValidation = [
  body('spendingLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Spending limit must be greater than 0'),
];
