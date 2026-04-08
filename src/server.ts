import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database';
import { config } from './config';
import { swaggerSpec } from './config/swagger';
import { errorHandler } from './utils/errors';
import { seedAdmin, seedSettings } from './utils/seedAdmin';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import depositRoutes from './modules/deposit/deposit.routes';
import cardRoutes from './modules/card/card.routes';
import transactionRoutes from './modules/transaction/transaction.routes';
import adminRoutes from './modules/admin/admin.routes';

const app: Application = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
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
app.use('/api/auth', authRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server only if not running in Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  const startServer = async (): Promise<void> => {
    try {
      // Connect to database
      await connectDatabase();

      // Seed admin user and settings if they don't exist
      console.log('🌱 Seeding database...');
      await seedAdmin();
      await seedSettings();

      // Start listening
      app.listen(config.port, () => {
        console.log(`🚀 Server running on port ${config.port}`);
        console.log(`📝 Environment: ${config.nodeEnv}`);
        console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
        console.log(`📚 API Documentation: http://localhost:${config.port}/api-docs`);
        console.log(`💚 Health Check: http://localhost:${config.port}/health`);
        console.log(`👤 Admin Email: ${config.admin.email}`);
        console.log(`🔑 Admin Password: ${config.admin.password}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
} else {
  // In Vercel, connect to database and seed when the module loads
  const initializeVercel = async (): Promise<void> => {
    try {
      await connectDatabase();
      console.log('🌱 Seeding database for Vercel...');
      await seedAdmin();
      await seedSettings();
      console.log('✅ Database seeded successfully');
    } catch (err) {
      console.error('Failed to initialize database:', err);
    }
  };

  initializeVercel();
}

export default app;
