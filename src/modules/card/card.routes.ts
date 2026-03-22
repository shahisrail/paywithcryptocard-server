import { Router } from 'express';
import * as cardController from './card.controller';
import { authenticate } from '../../middleware/auth';
import { cardValidation, handleValidationErrors } from '../../middleware/validator';
import { body } from 'express-validator';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new virtual card
 *     description: Creates a new virtual card with auto-generated details. Card holder name is automatically fetched from user profile.
 *     tags: [Cards]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               spendingLimit:
 *                 type: number
 *                 default: 10000
 *                 description: Spending limit for the card
 *                 example: 10000
 *     responses:
 *       201:
 *         description: Card created successfully
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
 *                   example: Card created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     cardNumber:
 *                       type: string
 *                       example: 4532 1234 5678 9010
 *                     expiryDate:
 *                       type: string
 *                       example: 12/28
 *                     cvv:
 *                       type: string
 *                       example: 123
 *                       description: Only shown once upon creation
 *                     cardHolder:
 *                       type: string
 *                       example: John Doe
 *                       description: Auto-generated from user profile
 *                     balance:
 *                       type: number
 *                       example: 0
 *                     status:
 *                       type: string
 *                       enum: [active, frozen, terminated]
 *                       example: active
 *                     spendingLimit:
 *                       type: number
 *                       example: 10000
 *       400:
 *         description: Insufficient balance (balance must be > 0 and cover card fee) or validation error
 *       401:
 *         description: Not authenticated
 */
router.post('/', cardValidation, handleValidationErrors, cardController.createCard);

/**
 * @swagger
 * /api/cards:
 *   get:
 *     summary: Get user's cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authenticated
 */
router.get('/', cardController.getMyCards);

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get card by ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Card not found
 */
router.get('/:id', cardController.getCardById);

/**
 * @swagger
 * /api/cards/{id}/load:
 *   post:
 *     summary: Load funds onto card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 100
 *                 description: Amount to load in USD
 *     responses:
 *       200:
 *         description: Card loaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     cardBalance:
 *                       type: number
 *                     userBalance:
 *                       type: number
 *       400:
 *         description: Insufficient balance or invalid amount
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Card not found
 */
router.post(
  '/:id/load',
  [body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'), handleValidationErrors],
  cardController.loadCard
);

/**
 * @swagger
 * /api/cards/{id}/freeze:
 *   patch:
 *     summary: Freeze or unfreeze card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       400:
 *         description: Cannot freeze terminated card
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Card not found
 */
router.patch('/:id/freeze', cardController.freezeCard);

/**
 * @swagger
 * /api/cards/{id}/terminate:
 *   patch:
 *     summary: Terminate card and refund balance
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card terminated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Card'
 *       400:
 *         description: Card already terminated
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Card not found
 */
router.patch('/:id/terminate', cardController.terminateCard);

export default router;
