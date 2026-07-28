"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllQuestionsAdmin = exports.bulkCreateQuestions = exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestion = exports.getQuestions = void 0;
const Question_1 = __importDefault(require("../models/Question"));
const getQuestions = async (req, res) => {
    try {
        const { category, difficulty, section, status, search, page = "1", limit = "20" } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (section)
            filter.section = section;
        if (status)
            filter.status = status;
        else
            filter.status = "PUBLISHED";
        if (search)
            filter.text = { $regex: search, $options: "i" };
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const [questions, total] = await Promise.all([
            Question_1.default.find(filter)
                .populate("category", "name section")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Question_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            questions,
            pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getQuestions = getQuestions;
const getQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findById(req.params.id).populate("category", "name section");
        if (!question)
            return res.status(404).json({ success: false, error: "Question not found" });
        res.status(200).json({ success: true, question });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getQuestion = getQuestion;
const createQuestion = async (req, res) => {
    try {
        const { text, options, correctAnswer, explanation, category, difficulty, section, tags, imageUrl } = req.body;
        const question = await Question_1.default.create({
            text, options, correctAnswer, explanation, category, difficulty, section,
            tags: tags || [],
            imageUrl: imageUrl || null,
            source: "MANUAL",
            status: "PUBLISHED",
            createdBy: req.user?.userId,
        });
        res.status(201).json({ success: true, question });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createQuestion = createQuestion;
const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const { text, options, correctAnswer, explanation, category, difficulty, section, tags, status, imageUrl } = req.body;
        const question = await Question_1.default.findByIdAndUpdate(id, { text, options, correctAnswer, explanation, category, difficulty, section, tags, status, imageUrl }, { new: true, runValidators: true });
        if (!question)
            return res.status(404).json({ success: false, error: "Question not found" });
        res.status(200).json({ success: true, question });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateQuestion = updateQuestion;
const deleteQuestion = async (req, res) => {
    try {
        const question = await Question_1.default.findByIdAndDelete(req.params.id);
        if (!question)
            return res.status(404).json({ success: false, error: "Question not found" });
        res.status(200).json({ success: true, message: "Question deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteQuestion = deleteQuestion;
const bulkCreateQuestions = async (req, res) => {
    try {
        const { questions } = req.body;
        const docs = questions.map((q) => ({
            ...q,
            source: q.source || "MANUAL",
            status: q.status || "PUBLISHED",
            createdBy: req.user?.userId,
        }));
        const created = await Question_1.default.insertMany(docs);
        res.status(201).json({ success: true, count: created.length, questions: created });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.bulkCreateQuestions = bulkCreateQuestions;
const getAllQuestionsAdmin = async (req, res) => {
    try {
        const { category, difficulty, section, status, search, page = "1", limit = "20" } = req.query;
        const filter = {};
        if (category)
            filter.category = category;
        if (difficulty)
            filter.difficulty = difficulty;
        if (section)
            filter.section = section;
        if (status)
            filter.status = status;
        if (search)
            filter.text = { $regex: search, $options: "i" };
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const [questions, total] = await Promise.all([
            Question_1.default.find(filter)
                .populate("category", "name section")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            Question_1.default.countDocuments(filter),
        ]);
        res.status(200).json({
            success: true,
            questions,
            pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAllQuestionsAdmin = getAllQuestionsAdmin;
