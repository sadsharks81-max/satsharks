"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportedIssue = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reportedIssueSchema = new mongoose_1.default.Schema({
    question: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    reportedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    testContext: {
        type: String, // Can be "PRACTICE" or a test attempt ID
    },
    reason: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["OPEN", "RESOLVED"],
        default: "OPEN",
    },
    resolvedAt: {
        type: Date,
    },
    resolvedBy: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });
exports.ReportedIssue = mongoose_1.default.model("ReportedIssue", reportedIssueSchema);
