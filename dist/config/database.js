"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/paywithcrypto';
        const options = {
            autoIndex: true,
        };
        await mongoose_1.default.connect(mongoUri, options);
        console.log(`✅ MongoDB Connected: ${mongoose_1.default.connection.host}`);
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`❌ MongoDB connection error: ${err}`);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });
    }
    catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log('✅ MongoDB connection closed');
    }
    catch (error) {
        console.error(`❌ Error closing MongoDB connection: ${error}`);
    }
};
exports.disconnectDatabase = disconnectDatabase;
