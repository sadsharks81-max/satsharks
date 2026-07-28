"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncUniversities = exports.getAllUniversities = void 0;
const University_1 = __importDefault(require("../models/University"));
const getAllUniversities = async (req, res) => {
    try {
        const universities = await University_1.default.find();
        return res.status(200).json({ success: true, data: universities });
    }
    catch (error) {
        console.error("Get All Universities Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getAllUniversities = getAllUniversities;
const syncUniversities = async (req, res) => {
    try {
        const { universities, sheetName = "General" } = req.body;
        if (!Array.isArray(universities)) {
            return res.status(400).json({ success: false, error: "Invalid data format. Expected an array of universities." });
        }
        // Clear existing universities matching this sheetName
        await University_1.default.deleteMany({ sheetName });
        // Map each university to include sheetName
        const universitiesWithSheet = universities.map((u) => ({
            ...u,
            sheetName,
        }));
        // Insert new universities
        const inserted = await University_1.default.insertMany(universitiesWithSheet);
        return res.status(200).json({ success: true, data: inserted, message: `Universities synced successfully for sheet "${sheetName}".` });
    }
    catch (error) {
        console.error("Sync Universities Error:", error);
        return res.status(500).json({ success: false, error: error.message || "Server Error", details: error.errors });
    }
};
exports.syncUniversities = syncUniversities;
