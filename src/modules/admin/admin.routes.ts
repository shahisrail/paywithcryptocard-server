import { Router } from 'express';
import * as adminController from './admin.controller';
import { authenticate, authorizeAdmin } from '../../middleware/auth';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorizeAdmin);

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                     activeUsers:
 *                       type: integer
 *                     totalCards:
 *                       type: integer
 *                     pendingDeposits:
 *                       type: integer
 *                     totalPlatformBalance:
 *                       type: number
 *                     recentUsers:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     pendingDepositsList:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Deposit'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 */
router.get('/dashboard', adminController.getDashboardStats);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users (paginated)
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email or full name
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive]
 *           default: all
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/User'
 *                     total:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     skip:
 *                       type: integer
 */
router.get('/users', adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user by ID with full details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:id', adminController.getUserById);

/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   patch:
 *     summary: Update user active status
 *     tags: [Admin]
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
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User status updated successfully
 */
router.patch('/users/:id/status', adminController.updateUserStatus);

/**
 * @swagger
 * /api/admin/users/{id}/balance:
 *   post:
 *     summary: Manually adjust user balance
 *     tags: [Admin]
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
 *               - reason
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Positive to add, negative to deduct
 *               reason:
 *                 type: string
 *                 example: "Bonus deposit"
 *     responses:
 *       200:
 *         description: Balance adjusted successfully
 */
router.post('/users/:id/balance', adminController.updateUserBalance);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', adminController.deleteUser);

/**
 * @swagger
 * /api/admin/deposits:
 *   get:
 *     summary: Get all deposits with optional filters
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, all]
 *           default: all
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [BTC, ETH, USDT_ERC20, USDT_TRC20, XMR]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Deposits retrieved successfully
 */
router.get('/deposits', adminController.getAllDeposits);

/**
 * @swagger
 * /api/admin/deposits/pending:
 *   get:
 *     summary: Get pending deposits
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: currency
 *         schema:
 *           type: string
 *           enum: [BTC, ETH, USDT_ERC20, USDT_TRC20, XMR]
 *     responses:
 *       200:
 *         description: Pending deposits retrieved successfully
 */
router.get('/deposits/pending', adminController.getPendingDeposits);

/**
 * @swagger
 * /api/admin/deposits/{id}/approve:
 *   patch:
 *     summary: Approve a deposit
 *     tags: [Admin]
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
 *               - usdAmount
 *             properties:
 *               usdAmount:
 *                 type: number
 *                 example: 100
 *                 description: USD amount to credit to user
 *     responses:
 *       200:
 *         description: Deposit approved successfully
 */
router.patch('/deposits/:id/approve', adminController.approveDeposit);

/**
 * @swagger
 * /api/admin/deposits/{id}/reject:
 *   patch:
 *     summary: Reject a deposit
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Transaction not found on blockchain"
 *     responses:
 *       200:
 *         description: Deposit rejected successfully
 */
router.patch('/deposits/:id/reject', adminController.rejectDeposit);

/**
 * @swagger
 * /api/admin/cards:
 *   get:
 *     summary: Get all cards
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, frozen, terminated]
 *           default: all
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Cards retrieved successfully
 */
router.get('/cards', adminController.getAllCards);

/**
 * @swagger
 * /api/admin/cards/{id}/status:
 *   patch:
 *     summary: Update card status
 *     tags: [Admin]
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, frozen, terminated]
 *     responses:
 *       200:
 *         description: Card status updated successfully
 */
router.patch('/cards/:id/status', adminController.updateCardStatus);

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, card_create, card_load, purchase, withdrawal]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, completed, failed]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 */
router.get('/transactions', adminController.getAllTransactions);

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Get platform settings
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     cryptoAddresses:
 *                       type: object
 *                       properties:
 *                         btc:
 *                           type: string
 *                         eth:
 *                           type: string
 *                         usdtErc20:
 *                           type: string
 *                         usdtTrc20:
 *                           type: string
 *                         xmr:
 *                           type: string
 *                     minimumDeposit:
 *                       type: number
 *                     cardIssuanceFee:
 *                       type: number
 *                     isActive:
 *                       type: boolean
 */
router.get('/settings', adminController.getSettings);

/**
 * @swagger
 * /api/admin/settings:
 *   put:
 *     summary: Update platform settings
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cryptoAddresses:
 *                 type: object
 *                 properties:
 *                   btc:
 *                     type: string
 *                   eth:
 *                     type: string
 *                   usdtErc20:
 *                     type: string
 *                   usdtTrc20:
 *                     type: string
 *                   xmr:
 *                     type: string
 *               minimumDeposit:
 *                 type: number
 *               cardIssuanceFee:
 *                 type: number
 *     responses:
 *       200:
 *         description: Settings updated successfully
 */
router.put('/settings', adminController.updateSettings);

/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admin]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by email or full name
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *           default: 0
 *     responses:
 *       200:
 *         description: Admins retrieved successfully
 */
router.get('/admins', adminController.getAllAdmins);

/**
 * @swagger
 * /api/admin/admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               fullName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Validation error or email already exists
 */
router.post('/admins', adminController.createAdmin);

/**
 * @swagger
 * /api/admin/admins/{id}/status:
 *   patch:
 *     summary: Update admin active status
 *     tags: [Admin]
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
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Admin status updated successfully
 */
router.patch('/admins/:id/status', adminController.updateAdminStatus);

/**
 * @swagger
 * /api/admin/admins/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 */
router.delete('/admins/:id', adminController.deleteAdmin);

/**
 * @swagger
 * /api/admin/admins/{id}/password:
 *   patch:
 *     summary: Update admin password
 *     tags: [Admin]
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
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Admin password updated successfully
 */
router.patch('/admins/:id/password', adminController.updateAdminPassword);

export default router;
