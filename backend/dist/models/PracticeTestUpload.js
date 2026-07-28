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
const PracticeTestUploadSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadType: {
        type: String,
        enum: ["FULL_TEST", "PRACTICE_QUESTIONS"],
        default: "FULL_TEST",
        required: true,
    },
    uploadedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
        type: String,
        enum: ["UPLOADED", "PROCESSING", "EXTRACTED", "REVIEWED", "PUBLISHED", "FAILED"],
        default: "UPLOADED",
    },
    extractedQuestions: [
        {
            text: String,
            options: [{ label: String, text: String }],
            correctAnswer: String,
            explanation: String,
            category: String,
            difficulty: String,
            confidence: { type: Number, default: 0 },
            approved: { type: Boolean, default: false },
        },
    ],
    reviewNotes: { type: String, default: "" },
    reviewedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    errorMessage: { type: String, default: "" },
}, { timestamps: true });
PracticeTestUploadSchema.index({ status: 1 });
PracticeTestUploadSchema.index({ uploadedBy: 1 });
exports.default = mongoose_1.default.model("PracticeTestUpload", PracticeTestUploadSchema);
