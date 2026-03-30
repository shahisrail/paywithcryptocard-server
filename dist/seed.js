"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const seedAdmin_1 = require("./utils/seedAdmin");
const seed = async () => {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🌱 Starting database seed...');
        await (0, seedAdmin_1.seedAdmin)();
        await (0, seedAdmin_1.seedSettings)();
        console.log('✅ Database seed completed');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};
seed();
