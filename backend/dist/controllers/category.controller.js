"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const QuestionCategory_1 = __importDefault(require("../models/QuestionCategory"));
const getCategories = async (req, res) => {
    try {
        const categories = await QuestionCategory_1.default.find().sort({ section: 1, name: 1 });
        res.status(200).json({ success: true, categories });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    try {
        const { name, section, description } = req.body;
        const existing = await QuestionCategory_1.default.findOne({ name });
        if (existing) {
            return res.status(400).json({ success: false, error: "Category already exists" });
        }
        const category = await QuestionCategory_1.default.create({ name, section, description });
        res.status(201).json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, section, description } = req.body;
        const category = await QuestionCategory_1.default.findByIdAndUpdate(id, { name, section, description }, { new: true, runValidators: true });
        if (!category)
            return res.status(404).json({ success: false, error: "Category not found" });
        res.status(200).json({ success: true, category });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await QuestionCategory_1.default.findByIdAndDelete(id);
        if (!category)
            return res.status(404).json({ success: false, error: "Category not found" });
        res.status(200).json({ success: true, message: "Category deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteCategory = deleteCategory;
