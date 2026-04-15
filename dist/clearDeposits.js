"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./config/database");
const Deposit_1 = require("./models/Deposit");
const clearDeposits = async () => {
    try {
        await (0, database_1.connectDatabase)();
        console.log('🗑️  Clearing all deposit records...');
        const result = await Deposit_1.Deposit.deleteMany({});
        console.log(`✅ Deleted ${result.deletedCount} deposit records`);
        await (0, database_1.disconnectDatabase)();
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Failed to clear deposits:', error);
        process.exit(1);
    }
};
clearDeposits();
