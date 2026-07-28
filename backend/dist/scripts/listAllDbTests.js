"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const SATTest_1 = __importDefault(require("../models/SATTest"));
async function main() {
    const connected = await (0, db_1.connectDB)();
    if (!connected)
        return;
    const tests = await SATTest_1.default.find().sort({ testNumber: 1 });
    console.log("=== TESTS IN DATABASE ===");
    for (const t of tests) {
        console.log(`TestNumber: ${t.testNumber} | Title: "${t.title}" | Modules: ${t.modules.length}`);
    }
    await mongoose_1.default.disconnect();
}
main().catch(console.error);
