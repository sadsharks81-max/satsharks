"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudyMaterial = exports.uploadStudyMaterial = exports.getStudyMaterials = void 0;
const StudyMaterial_1 = __importDefault(require("../models/StudyMaterial"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const getStudyMaterials = async (req, res, next) => {
    try {
        const filter = req.query.category ? { category: req.query.category } : {};
        const materials = await StudyMaterial_1.default.find(filter)
            .populate("uploadedBy", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            materials,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudyMaterials = getStudyMaterials;
const uploadStudyMaterial = async (req, res, next) => {
    try {
        const { title, description, category } = req.body;
        const file = req.file;
        if (!title) {
            return res.status(400).json({ success: false, error: "Title is required" });
        }
        if (!file) {
            return res.status(400).json({ success: false, error: "PDF file is required" });
        }
        if (!["MATH", "READING_WRITING"].includes(category)) {
            return res.status(400).json({ success: false, error: "Choose Math or Reading & Writing." });
        }
        const fileUrl = `/uploads/${file.filename}`;
        const newMaterial = await StudyMaterial_1.default.create({
            title,
            description,
            fileUrl,
            fileName: file.originalname,
            fileSize: file.size,
            category,
            uploadedBy: req.user.userId,
        });
        return res.status(201).json({
            success: true,
            material: newMaterial,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.uploadStudyMaterial = uploadStudyMaterial;
const deleteStudyMaterial = async (req, res, next) => {
    try {
        const { id } = req.params;
        const material = await StudyMaterial_1.default.findById(id);
        if (!material) {
            return res.status(404).json({ success: false, error: "Study material not found" });
        }
        // Try to delete physical file
        const filePath = path_1.default.resolve(__dirname, "../../", material.fileUrl.replace(/^\//, ""));
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
        }
        await StudyMaterial_1.default.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: "Study material deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteStudyMaterial = deleteStudyMaterial;
