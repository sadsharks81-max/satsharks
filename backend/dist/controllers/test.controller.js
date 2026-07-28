"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttempt = exports.submitTest = exports.startTest = exports.getAllTestsAdmin = exports.deleteTest = exports.updateTest = exports.createTest = exports.getTest = exports.getTests = void 0;
const DiagnosticTest_1 = __importDefault(require("../models/DiagnosticTest"));
const TestAttempt_1 = __importDefault(require("../models/TestAttempt"));
const Question_1 = __importDefault(require("../models/Question"));
const grading_1 = require("../utils/grading");
const getTests = async (req, res) => {
    try {
        const userSub = req.user?.subscription;
        const filter = { isActive: true };
        if (userSub === "FREE")
            filter.accessLevel = "FREE";
        const tests = await DiagnosticTest_1.default.find(filter).sort({ createdAt: 1 });
        const testsWithCount = await Promise.all(tests.map(async (t) => {
            const attemptCount = await TestAttempt_1.default.countDocuments({
                student: req.user?.userId,
                test: t._id,
                status: "COMPLETED",
            });
            const { questions, ...rest } = t.toObject();
            return { ...rest, questionCount: (questions || []).length, attemptCount };
        }));
        res.status(200).json({ success: true, tests: testsWithCount });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getTests = getTests;
const getTest = async (req, res) => {
    try {
        const test = await DiagnosticTest_1.default.findById(req.params.id)
            .populate({ path: "questions", select: "text options section difficulty category" });
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        res.status(200).json({ success: true, test });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getTest = getTest;
const createTest = async (req, res) => {
    try {
        const { title, description, section, questions, timeLimit, accessLevel } = req.body;
        const test = await DiagnosticTest_1.default.create({
            title, description, section, questions, timeLimit,
            totalMarks: questions.length,
            accessLevel: accessLevel || "FREE",
            createdBy: req.user?.userId,
        });
        res.status(201).json({ success: true, test });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createTest = createTest;
const updateTest = async (req, res) => {
    try {
        const { title, description, section, questions, timeLimit, accessLevel, isActive } = req.body;
        const update = {};
        if (title !== undefined)
            update.title = title;
        if (description !== undefined)
            update.description = description;
        if (section !== undefined)
            update.section = section;
        if (questions !== undefined) {
            update.questions = questions;
            update.totalMarks = questions.length;
        }
        if (timeLimit !== undefined)
            update.timeLimit = timeLimit;
        if (accessLevel !== undefined)
            update.accessLevel = accessLevel;
        if (isActive !== undefined)
            update.isActive = isActive;
        const test = await DiagnosticTest_1.default.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        res.status(200).json({ success: true, test });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateTest = updateTest;
const deleteTest = async (req, res) => {
    try {
        const test = await DiagnosticTest_1.default.findByIdAndDelete(req.params.id);
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        res.status(200).json({ success: true, message: "Test deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteTest = deleteTest;
const getAllTestsAdmin = async (req, res) => {
    try {
        const tests = await DiagnosticTest_1.default.find().sort({ createdAt: 1 });
        res.status(200).json({ success: true, tests });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAllTestsAdmin = getAllTestsAdmin;
const startTest = async (req, res) => {
    try {
        const test = await DiagnosticTest_1.default.findById(req.params.id)
            .populate({ path: "questions", select: "text options section difficulty category" });
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        if (!test.isActive)
            return res.status(400).json({ success: false, error: "Test is not active" });
        if (req.user?.subscription === "FREE" && test.accessLevel === "PAID") {
            return res.status(403).json({ success: false, error: "Paid subscription required for this test" });
        }
        const attempt = await TestAttempt_1.default.create({
            student: req.user?.userId,
            test: test._id,
            totalQuestions: test.questions.length,
            startedAt: new Date(),
        });
        res.status(201).json({ success: true, attempt, test });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.startTest = startTest;
const submitTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { answers, timeTaken } = req.body;
        const attempt = await TestAttempt_1.default.findOne({
            _id: id,
            student: req.user?.userId,
            status: "IN_PROGRESS",
        });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        const questionIds = answers.map((a) => a.question);
        const questions = await Question_1.default.find({ _id: { $in: questionIds } });
        const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
        let correctCount = 0;
        const scoredAnswers = answers.map((a) => {
            const q = questionMap.get(a.question);
            const isCorrect = q && a.selectedAnswer
                ? (0, grading_1.checkAnswerCorrectness)(q.correctAnswer, a.selectedAnswer)
                : false;
            if (isCorrect)
                correctCount++;
            return {
                question: a.question,
                selectedAnswer: a.selectedAnswer || null,
                isCorrect,
                timeSpent: a.timeSpent || 0,
            };
        });
        attempt.answers = scoredAnswers;
        attempt.correctCount = correctCount;
        attempt.score = correctCount;
        attempt.percentage = Math.round((correctCount / attempt.totalQuestions) * 100);
        attempt.timeTaken = timeTaken;
        attempt.status = "COMPLETED";
        attempt.completedAt = new Date();
        await attempt.save();
        res.status(200).json({ success: true, attempt });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.submitTest = submitTest;
const getAttempt = async (req, res) => {
    try {
        const attempt = await TestAttempt_1.default.findOne({
            _id: req.params.id,
            student: req.user?.userId,
        })
            .populate({ path: "test", select: "title section timeLimit" })
            .populate({ path: "answers.question", select: "text options correctAnswer explanation category difficulty" });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        res.status(200).json({ success: true, attempt });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAttempt = getAttempt;
