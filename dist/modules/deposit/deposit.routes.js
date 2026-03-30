"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const depositController = __importStar(require("./deposit.controller"));
const auth_1 = require("../../middleware/auth");
const validator_1 = require("../../middleware/validator");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
/**
 * @swagger
 * /api/deposits/addresses:
 *   get:
 *     summary: Get cryptocurrency deposit addresses
 *     tags: [Deposits]
 *     description: Retrieve wallet addresses for all supported cryptocurrencies
 *     responses:
 *       200:
 *         description: Deposit addresses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     BTC:
 *                       type: string
 *                       example: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
 *                       description: Bitcoin address
 *                     ETH:
 *                       type: string
 *                       example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
 *                       description: Ethereum address
 *                     USDT_ERC20:
 *                       type: string
 *                       example: 0x71C7656EC7ab88b098defB751B7401B5f6d8976F
 *                       description: USDT (ERC20) address
 *                     USDT_TRC20:
 *                       type: string
 *                       example: TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf
 *                       description: USDT (TRC20) address
 *                     XMR:
 *                       type: string
 *                       example: 44AFFq5kSiGBoZ4NMDwYtN187rua5UdjnU8oYfYaUCSt5MVNVq2zSRf7FHBVPL7pKGFHLyKAhA8tQEyEYbkGiqz
 *                       description: Monero address
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/addresses', depositController.getDepositAddresses);
/**
 * @swagger
 * /api/deposits:
 *   post:
 *     summary: Submit a crypto deposit
 *     tags: [Deposits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *               - amount
 *             properties:
 *               currency:
 *                 type: string
 *                 enum: [BTC, ETH, USDT_ERC20, USDT_TRC20, XMR]
 *                 example: BTC
 *               amount:
 *                 type: number
 *                 example: 0.001
 *                 description: Amount in cryptocurrency
 *               txHash:
 *                 type: string
 *                 example: 0xabc123def456...
 *                 description: Transaction hash from blockchain
 *     responses:
 *       201:
 *         description: Deposit submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Deposit submitted successfully. Awaiting admin approval.
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validator_1.depositValidation, validator_1.handleValidationErrors, depositController.createDeposit);
/**
 * @swagger
 * /api/deposits/my-deposits:
 *   get:
 *     summary: Get user's deposit history
 *     tags: [Deposits]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Filter by status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of results to return
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: Deposits retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     deposits:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Deposit'
 *                     total:
 *                       type: integer
 *                       example: 5
 *                     limit:
 *                       type: integer
 *                     skip:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/my-deposits', depositController.getMyDeposits);
/**
 * @swagger
 * /api/deposits/{id}:
 *   get:
 *     summary: Get deposit by ID
 *     tags: [Deposits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deposit ID
 *     responses:
 *       200:
 *         description: Deposit retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Deposit'
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Deposit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', depositController.getDepositById);
exports.default = router;
