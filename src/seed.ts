import mongoose from 'mongoose';
import { connectDatabase } from './config/database';
import { seedAdmin, seedSettings } from './utils/seedAdmin';

const seed = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('🌱 Starting database seed...');

    await seedAdmin();
    await seedSettings();

    console.log('✅ Database seed completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
