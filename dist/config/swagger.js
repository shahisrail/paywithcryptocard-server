"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PayWithCryptoCard API',
            version: '1.0.0',
            description: `
        PayWithCryptoCard Backend API Documentation

        ## Features
        - User Authentication (JWT)
        - Crypto Deposits (BTC, ETH, USDT, XMR)
        - Virtual Card Management
        - Transaction History
        - Admin Panel

        ## Authentication
        Most endpoints require authentication. Include the JWT token in:
        - Cookie: \`token\`
        - Header: \`Authorization: Bearer <token>\`

        ## Phase 1 Notes
        - Crypto deposits are manually approved by admin
        - Virtual cards use simulated PAN/CVV
        - No live blockchain or card issuer integration
      `,
            contact: {
                name: 'PayWithCryptoCard Support',
                email: 'support@paywithcryptocard.com',
            },
            license: {
                name: 'PROPRIETARY',
            },
        },
        servers: [
            {
                url: 'http://localhost:4000',
                description: 'Development server',
            },
            {
                url: 'https://api.paywithcryptocard.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT token in httpOnly cookie',
                },
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT token in Authorization header',
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            example: 'Error message here',
                        },
                        error: {
                            type: 'string',
                            example: 'Detailed error (dev only)',
                        },
                    },
                },
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            example: '507f1f77bcf86cd799439011',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'user@example.com',
                        },
                        fullName: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            example: 'user',
                        },
                        balance: {
                            type: 'number',
                            example: 100.50,
                        },
                        isActive: {
                            type: 'boolean',
                            example: true,
                        },
                        isEmailVerified: {
                            type: 'boolean',
                            example: false,
                        },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: true,
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful',
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        user: {
                            $ref: '#/components/schemas/User',
                        },
                    },
                },
                Deposit: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        userId: {
                            type: 'string',
                        },
                        currency: {
                            type: 'string',
                            enum: ['BTC', 'ETH', 'USDT_ERC20', 'USDT_TRC20', 'XMR'],
                        },
                        amount: {
                            type: 'number',
                            example: 0.5,
                        },
                        txHash: {
                            type: 'string',
                            example: '0xabc123...',
                        },
                        walletAddress: {
                            type: 'string',
                            example: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'approved', 'rejected'],
                        },
                        rejectionReason: {
                            type: 'string',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Card: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        userId: {
                            type: 'string',
                        },
                        cardNumber: {
                            type: 'string',
                            example: '4532 1234 5678 9010',
                        },
                        expiryDate: {
                            type: 'string',
                            example: '12/28',
                        },
                        cardHolder: {
                            type: 'string',
                            example: 'John Doe',
                        },
                        balance: {
                            type: 'number',
                            example: 50.00,
                        },
                        status: {
                            type: 'string',
                            enum: ['active', 'frozen', 'terminated'],
                        },
                        spendingLimit: {
                            type: 'number',
                            example: 10000,
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Transaction: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                        },
                        userId: {
                            type: 'string',
                        },
                        cardId: {
                            type: 'string',
                        },
                        type: {
                            type: 'string',
                            enum: ['deposit', 'card_create', 'card_load', 'purchase', 'withdrawal'],
                        },
                        amount: {
                            type: 'number',
                            example: 100.00,
                        },
                        balance: {
                            type: 'number',
                            example: 150.00,
                        },
                        status: {
                            type: 'string',
                            enum: ['pending', 'completed', 'failed'],
                        },
                        description: {
                            type: 'string',
                            example: 'Virtual card issuance fee',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: ['./src/modules/**/*.ts', './src/modules/**/*.routes.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
