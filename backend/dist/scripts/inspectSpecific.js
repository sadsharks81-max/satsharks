"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("../config/db");
const Question_1 = __importDefault(require("../models/Question"));
async function main() {
    const connected = await (0, db_1.connectDB)();
    if (!connected) {
        console.error("Database connection failed");
        return;
    }
    const questions = await Question_1.default.find({ text: /For certain altitudes/i });
    console.log(`Found ${questions.length} questions matching "For certain altitudes":`);
    for (const q of questions) {
        console.log(`- ID: ${q._id}, Text: "${q.text}"`);
        console.log(`  Options:`, q.options);
    }
    await mongoose_1.default.disconnect();
}
main().catch(console.error);
