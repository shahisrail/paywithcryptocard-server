import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from './config/database';
import { Deposit } from './models/Deposit';

const clearDeposits = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('🗑️  Clearing all deposit records...');

    const result = await Deposit.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} deposit records`);

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to clear deposits:', error);
    process.exit(1);
  }
};

clearDeposits();