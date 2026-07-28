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
const SATModuleAttemptSchema = new mongoose_1.Schema({
    moduleIndex: { type: Number, required: true },
    answers: [
        {
            question: { type: mongoose_1.Schema.Types.ObjectId, ref: "Question" },
            selectedAnswer: { type: String, default: null },
            isCorrect: { type: Boolean, default: false },
            markedForReview: { type: Boolean, default: false },
            timeSpent: { type: Number, default: 0 },
        },
    ],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
}, { _id: false });
const SATTestAttemptSchema = new mongoose_1.Schema({
    student: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: mongoose_1.Schema.Types.ObjectId, ref: "SATTest", required: true },
    moduleAttempts: { type: [SATModuleAttemptSchema], default: [] },
    currentModuleIndex: { type: Number, default: 0 },
    breakStartedAt: { type: Date, default: null },
    breakCompletedAt: { type: Date, default: null },
    totalScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    totalTimeTaken: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["IN_PROGRESS", "ON_BREAK", "COMPLETED", "ABANDONED", "TIMED_OUT"],
        default: "IN_PROGRESS",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
}, { timestamps: true });
SATTestAttemptSchema.index({ student: 1, createdAt: -1 });
SATTestAttemptSchema.index({ student: 1, test: 1 });
exports.default = mongoose_1.default.model("SATTestAttempt", SATTestAttemptSchema);
