"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        if (!env_1.env.databaseUrl) {
            console.warn("DATABASE_URL not found. Running with mock data services.");
            return false;
        }
        await mongoose_1.default.connect(env_1.env.databaseUrl, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log(`MongoDB connected: ${mongoose_1.default.connection.name}`);
        return true;
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
