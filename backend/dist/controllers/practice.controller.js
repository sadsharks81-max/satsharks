"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomTest = exports.getPracticeHistory = exports.submitPracticeAnswer = void 0;
const PracticeSession_1 = __importDefault(require("../models/PracticeSession"));
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const grading_1 = require("../utils/grading");
const SATTest_1 = __importDefault(require("../models/SATTest"));
const SATTestAttempt_1 = __importDefault(require("../models/SATTestAttempt"));
const QuestionCategory_1 = __importDefault(require("../models/QuestionCategory"));
const text_1 = require("../utils/text");
const CUSTOM_TEST_CATEGORY_NAMES = {
    MATH: ["SAT Advanced Math", "SAT Algebra", "SAT Data & Statistics", "SAT Geometry"],
    READING_WRITING: ["SAT Grammar & Writing", "SAT Reading & Writing", "SAT Vocabulary", "SAT Reading Comprehension"],
};
const submitPracticeAnswer = async (req, res) => {
    try {
        const { questionId, selectedAnswer, timeSpent } = req.body;
        const studentId = req.user?.userId;
        if (req.user?.subscription === "FREE") {
            const count = await PracticeSession_1.default.countDocuments({ student: studentId });
            if (count >= 20) {
                return res.status(403).json({
                    success: false,
                    error: "You have reached the free limit of 20 practice questions. Please upgrade to a Premium plan to unlock unlimited access to all 3,686 questions!",
                    limitReached: true,
                });
            }
        }
        const question = await Question_1.default.findById(questionId);
        if (!question)
            return res.status(404).json({ success: false, error: "Question not found" });
        const isCorrect = (0, grading_1.checkAnswerCorrectness)(question.correctAnswer, selectedAnswer);
        const session = await PracticeSession_1.default.create({
            student: studentId,
            question: questionId,
            selectedAnswer,
            isCorrect,
            timeSpent: timeSpent || 0,
        });
        // Update user points, streak, and daily practice count
        const user = await User_1.default.findById(studentId);
        if (user) {
            if (isCorrect) {
                user.leaderboardPoints += 10;
            }
            const todayStr = new Date().toISOString().split("T")[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            if (user.lastActiveDate === yesterdayStr) {
                user.streakCount += 1;
                user.dailyPracticeProgress = 1;
                user.lastActiveDate = todayStr;
            }
            else if (user.lastActiveDate === todayStr) {
                user.dailyPracticeProgress += 1;
            }
            else {
                user.streakCount = 1;
                user.dailyPracticeProgress = 1;
                user.lastActiveDate = todayStr;
            }
            await user.save();
        }
        res.status(201).json({
            success: true,
            result: {
                isCorrect,
                correctAnswer: question.correctAnswer,
                explanation: (0, text_1.stripEmojis)(question.explanation),
                sessionId: session._id,
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.submitPracticeAnswer = submitPracticeAnswer;
const getPracticeHistory = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const { page = "1", limit = "20" } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const [sessions, total] = await Promise.all([
            PracticeSession_1.default.find({ student: studentId })
                .populate("question", "text category difficulty section")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limitNum),
            PracticeSession_1.default.countDocuments({ student: studentId }),
        ]);
        const correct = await PracticeSession_1.default.countDocuments({ student: studentId, isCorrect: true });
        res.status(200).json({
            success: true,
            sessions,
            stats: { total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 },
            pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getPracticeHistory = getPracticeHistory;
const createCustomTest = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const { subject, difficulties, categories } = req.body;
        if (!studentId || !subject) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }
        const totalNeeded = subject === "READING_WRITING" ? 54 : 44;
        const timeLimitMinutes = subject === "READING_WRITING" ? 32 : 35;
        const allowedNames = CUSTOM_TEST_CATEGORY_NAMES[subject];
        if (!allowedNames) {
            return res.status(400).json({ success: false, error: "Invalid custom test subject." });
        }
        const allowedCategoryDocs = await QuestionCategory_1.default.find({ name: { $in: allowedNames } }).select("_id");
        const allowedCategoryIds = allowedCategoryDocs.map((item) => item._id);
        if (allowedCategoryIds.length === 0) {
            return res.status(400).json({ success: false, error: "No approved custom-test categories are available." });
        }
        const requestedCategoryIds = Array.isArray(categories) ? categories.map(String) : [];
        const selectedCategoryIds = requestedCategoryIds.length
            ? allowedCategoryIds.filter((id) => requestedCategoryIds.includes(id.toString()))
            : allowedCategoryIds;
        if (selectedCategoryIds.length === 0) {
            return res.status(400).json({ success: false, error: "Select at least one approved custom-test category." });
        }
        const matchCriteria = { section: subject, category: { $in: selectedCategoryIds } };
        if (difficulties && difficulties.length > 0) {
            matchCriteria.difficulty = { $in: difficulties };
        }
        let questions = await Question_1.default.aggregate([
            { $match: matchCriteria },
            { $sample: { size: totalNeeded } },
        ]);
        if (questions.length < totalNeeded) {
            const existingIds = questions.map((q) => q._id);
            const remaining = totalNeeded - questions.length;
            const fallbackQuestions = await Question_1.default.aggregate([
                { $match: { ...matchCriteria, _id: { $nin: existingIds } } },
                { $sample: { size: remaining } },
            ]);
            questions = [...questions, ...fallbackQuestions];
        }
        if (questions.length === 0) {
            return res.status(400).json({ success: false, error: "No questions found for this subject." });
        }
        const actualModSize = Math.floor(questions.length / 2);
        const customTest = await SATTest_1.default.create({
            title: `Custom Practice Test - ${new Date().toLocaleDateString()}`,
            description: "User generated custom practice test.",
            year: 9999,
            testNumber: Math.floor(Math.random() * 1000000),
            isAdaptive: false,
            breakDurationMinutes: 0,
            isActive: false,
            accessLevel: "FREE",
            createdBy: studentId,
            modules: [
                {
                    name: "Module 1",
                    section: subject,
                    moduleNumber: 1,
                    questions: questions.slice(0, actualModSize).map((q) => q._id),
                    timeLimitMinutes: timeLimitMinutes,
                },
                {
                    name: "Module 2",
                    section: subject,
                    moduleNumber: 2,
                    questions: questions.slice(actualModSize, actualModSize * 2).map((q) => q._id),
                    timeLimitMinutes: timeLimitMinutes,
                }
            ]
        });
        const attempt = await SATTestAttempt_1.default.create({
            student: studentId,
            test: customTest._id,
            moduleAttempts: [
                {
                    moduleIndex: 0,
                    answers: customTest.modules[0].questions.map(qId => ({
                        question: qId,
                        selectedAnswer: null,
                        isCorrect: false,
                        markedForReview: false,
                        timeSpent: 0
                    }))
                },
                {
                    moduleIndex: 1,
                    answers: customTest.modules[1].questions.map(qId => ({
                        question: qId,
                        selectedAnswer: null,
                        isCorrect: false,
                        markedForReview: false,
                        timeSpent: 0
                    }))
                }
            ],
            status: "IN_PROGRESS"
        });
        return res.status(201).json({ success: true, attemptId: attempt._id });
    }
    catch (error) {
        console.error("Create Custom Test Error:", error);
        return res.status(500).json({ success: false, error: "Failed to generate custom test." });
    }
};
exports.createCustomTest = createCustomTest;
