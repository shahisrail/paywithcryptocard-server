"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedSettings = exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const AdminSettings_1 = require("../models/AdminSettings");
const config_1 = require("../config");
const seedAdmin = async () => {
    try {
        // Check if admin already exists
        const existingAdmin = await User_1.User.findOne({ email: config_1.config.admin.email });
        if (existingAdmin) {
            console.log('✅ Admin user already exists');
            return;
        }
        // Create admin user
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(config_1.config.admin.password, salt);
        await User_1.User.create({
            email: config_1.config.admin.email,
            password: hashedPassword,
            fullName: 'System Administrator',
            role: 'admin',
            balance: 0,
            isActive: true,
            isEmailVerified: true,
        });
        console.log('✅ Admin user created successfully');
        console.log(`📧 Email: ${config_1.config.admin.email}`);
        console.log(`🔑 Password: ${config_1.config.admin.password}`);
    }
    catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};
exports.seedAdmin = seedAdmin;
const seedSettings = async () => {
    try {
        const existingSettings = await AdminSettings_1.AdminSettings.findOne({});
        if (existingSettings) {
            console.log('✅ Admin settings already exist');
            return;
        }
        await AdminSettings_1.AdminSettings.create({
            cryptoAddresses: config_1.config.crypto,
            minimumDeposit: 10,
            cardIssuanceFee: 5,
            isActive: true,
        });
        console.log('✅ Admin settings created successfully');
    }
    catch (error) {
        console.error('❌ Error creating admin settings:', error);
    }
};
exports.seedSettings = seedSettings;
