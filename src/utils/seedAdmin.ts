import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { AdminSettings } from '../models/AdminSettings';
import { config } from '../config';

export const seedAdmin = async (): Promise<void> => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: config.admin.email });
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.admin.password, salt);

    await User.create({
      email: config.admin.email,
      password: hashedPassword,
      fullName: 'System Administrator',
      role: 'admin',
      balance: 0,
      isActive: true,
      isEmailVerified: true,
    });

    console.log('✅ Admin user created successfully');
    console.log(`📧 Email: ${config.admin.email}`);
    console.log(`🔑 Password: ${config.admin.password}`);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

export const seedSettings = async (): Promise<void> => {
  try {
    const existingSettings = await AdminSettings.findOne({});
    if (existingSettings) {
      console.log('✅ Admin settings already exist');
      return;
    }

    await AdminSettings.create({
      cryptoAddresses: config.crypto,
      minimumDeposit: 10,
      cardIssuanceFee: 5,
      isActive: true,
    });

    console.log('✅ Admin settings created successfully');
  } catch (error) {
    console.error('❌ Error creating admin settings:', error);
  }
};
