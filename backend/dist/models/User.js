"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: ["ADMIN", "STUDENT", "TEACHER"],
        default: "STUDENT",
    },
    country: {
        type: String,
        required: true,
        default: "Unknown",
    },
    region: {
        type: String,
        enum: ["LOCAL", "INTERNATIONAL"],
        required: true,
        default: "INTERNATIONAL",
    },
    subscription: {
        type: String,
        enum: ["FREE", "PAID"],
        required: true,
        default: "FREE",
    },
    subscriptionPlan: {
        type: String,
    },
    subscriptionExpiry: {
        type: Date,
    },
    status: {
        type: String,
        enum: ["ACTIVE", "SUSPENDED"],
        required: true,
        default: "ACTIVE",
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    targetScore: { type: Number, default: 1400 },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },
    dailyGoal: { type: Number, default: 10 },
    dailyPracticeProgress: { type: Number, default: 0 },
    leaderboardPoints: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = mongoose_1.default.model("User", UserSchema);
