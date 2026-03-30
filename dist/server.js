"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = require("./config/database");
const config_1 = require("./config");
const swagger_1 = require("./config/swagger");
const errors_1 = require("./utils/errors");
const seedAdmin_1 = require("./utils/seedAdmin");
const jwt_1 = require("./utils/jwt");
// Import routes
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const deposit_routes_1 = __importDefault(require("./modules/deposit/deposit.routes"));
const card_routes_1 = __importDefault(require("./modules/card/card.routes"));
const transaction_routes_1 = __importDefault(require("./modules/transaction/transaction.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const app = (0, express_1.default)();
// Trust proxy for rate limiting
app.set('trust proxy', 1);
// Security middleware
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.config.frontendUrl,
    credentials: true,
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Rate limiting - skip for admin users
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.config.rateLimit.windowMs,
    max: config_1.config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
        try {
            // Extract token from cookies or authorization header
            const token = req.cookies?.token || req.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                // No token, apply rate limit
                return false;
            }
            // Verify token and check if user is admin
            const decoded = (0, jwt_1.verifyToken)(token);
            // Skip rate limiting for admin users
            return decoded.role === 'admin';
        }
        catch (error) {
            // Invalid token, apply rate limit
            return false;
        }
    },
});
app.use('/api', limiter);
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});
// Swagger API Documentation
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec, {
    customSiteTitle: 'PayWithCryptoCard API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
    },
}));
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/deposits', deposit_routes_1.default);
app.use('/api/cards', card_routes_1.default);
app.use('/api/transactions', transaction_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});
// Error handling middleware
app.use(errors_1.errorHandler);
// Start server only if not running in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const startServer = async () => {
        try {
            // Connect to database
            await (0, database_1.connectDatabase)();
            // Seed admin user and settings if they don't exist
            console.log('🌱 Seeding database...');
            await (0, seedAdmin_1.seedAdmin)();
            await (0, seedAdmin_1.seedSettings)();
            // Start listening
            app.listen(config_1.config.port, () => {
                console.log(`🚀 Server running on port ${config_1.config.port}`);
                console.log(`📝 Environment: ${config_1.config.nodeEnv}`);
                console.log(`🌐 Frontend URL: ${config_1.config.frontendUrl}`);
                console.log(`📚 API Documentation: http://localhost:${config_1.config.port}/api-docs`);
                console.log(`💚 Health Check: http://localhost:${config_1.config.port}/health`);
                console.log(`👤 Admin Email: ${config_1.config.admin.email}`);
                console.log(`🔑 Admin Password: ${config_1.config.admin.password}`);
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
            process.exit(1);
        }
    };
    startServer();
}
else {
    // In Vercel, connect to database and seed when the module loads
    const initializeVercel = async () => {
        try {
            await (0, database_1.connectDatabase)();
            console.log('🌱 Seeding database for Vercel...');
            await (0, seedAdmin_1.seedAdmin)();
            await (0, seedAdmin_1.seedSettings)();
            console.log('✅ Database seeded successfully');
        }
        catch (err) {
            console.error('Failed to initialize database:', err);
        }
    };
    initializeVercel();
}
exports.default = app;
