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
    await (0, db_1.connectDB)();
    console.log("Connected to MongoDB.");
    const total = await Question_1.default.countDocuments({});
    console.log(`Total questions in database: ${total}`);
    const bySource = await Question_1.default.aggregate([
        { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);
    console.log("Questions by source:", bySource);
    const byTag = await Question_1.default.aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    console.log("Top tags in database:", byTag.slice(0, 10));
    await mongoose_1.default.disconnect();
}
main().catch(console.error);
