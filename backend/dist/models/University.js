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
const universitySchema = new mongoose_1.Schema({
    uniId: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    ranking: { type: Number, default: 9999 },
    acceptRate: { type: Number, default: 100 },
    minGPA: { type: Number, default: 0 },
    avgSAT: { type: Number, default: null },
    minIELTS: { type: Number, default: null },
    minTOEFL: { type: Number, default: null },
    tuition: { type: Number, default: 0 },
    scholarships: { type: String, default: "" },
    programs: [{ type: String }],
    deadline: { type: String, default: "" },
    type: { type: String, default: "" },
    logo: { type: String, default: "🏫" },
    sheetName: { type: String, default: "General", required: true },
    // Extended fields
    admitDifficulty: { type: String, default: "" },
    scholarshipType: { type: String, default: "" },
    needBlindIntl: { type: String, default: "" },
    maxAidCoverage: { type: String, default: "" },
    meritMinGPA: { type: String, default: "" },
    meritMinSAT: { type: String, default: "" },
    ecImp: { type: Number, default: 5 },
    essayWeight: { type: Number, default: 5 },
    ecProfile: { type: String, default: "" },
    holisticReview: { type: String, default: "" },
    interview: { type: String, default: "" },
    appPlatform: { type: String, default: "" },
    counselorTip: { type: String, default: "" },
    minACT: { type: Number, default: null },
    actSatNote: { type: String, default: "" },
    englishExemptPolicy: { type: String, default: "" },
    englishExemptSAT: { type: Number, default: null },
    gradingSystemsAccepted: { type: String, default: "" },
    minMatricFsc: { type: String, default: "" },
    minALevel: { type: String, default: "" },
    minIB: { type: Number, default: null },
    officialWebsite: { type: String, default: "" },
    profile: { type: String, default: "Basic" },
}, { timestamps: true });
// Compound index to ensure uniqueness within a sheet
universitySchema.index({ uniId: 1, sheetName: 1 }, { unique: true });
exports.default = mongoose_1.default.model("University", universitySchema);
