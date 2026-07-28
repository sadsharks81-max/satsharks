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
const SATModuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    section: { type: String, enum: ["READING_WRITING", "MATH"], required: true },
    moduleNumber: { type: Number, required: true },
    questions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Question" }],
    timeLimitMinutes: { type: Number, required: true },
}, { _id: false });
const SATTestSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    year: { type: Number, required: true },
    testNumber: { type: Number, required: true },
    isAdaptive: { type: Boolean, default: false },
    modules: { type: [SATModuleSchema], required: true },
    breakDurationMinutes: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    accessLevel: { type: String, enum: ["FREE", "PAID"], default: "FREE" },
    pdfUrl: { type: String, default: "" },
    explanationPdfUrl: { type: String, default: "" },
    rwScoreMapping: { type: [Number], default: [] },
    mathScoreMapping: { type: [Number], default: [] },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
SATTestSchema.index({ isActive: 1, accessLevel: 1 });
SATTestSchema.index({ year: 1, testNumber: 1 }, { unique: true });
exports.default = mongoose_1.default.model("SATTest", SATTestSchema);
