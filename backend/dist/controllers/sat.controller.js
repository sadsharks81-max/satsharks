"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSATTestAdmin = exports.updateSATTestAdmin = exports.getAllSATTestsAdmin = exports.getMySATAttempts = exports.getSATAttempt = exports.submitSATTest = exports.endBreak = exports.completeModule = exports.saveSATProgress = exports.startSATTest = exports.getSATTests = void 0;
const SATTest_1 = __importDefault(require("../models/SATTest"));
const SATTestAttempt_1 = __importDefault(require("../models/SATTestAttempt"));
const Question_1 = __importDefault(require("../models/Question"));
const User_1 = __importDefault(require("../models/User"));
const grading_1 = require("../utils/grading");
// --- Student: list available SAT tests ---
const getSATTests = async (req, res) => {
    try {
        const filter = { isActive: true };
        const tests = await SATTest_1.default.find(filter)
            .sort({ year: -1, testNumber: 1 });
        const testsWithMeta = await Promise.all(tests.map(async (t) => {
            const doc = t.toObject();
            let totalQuestions = 0;
            let totalMinutes = 0;
            let modulesSummary = [];
            if (t.isAdaptive) {
                // Adaptive: student only takes 4 modules: Mod 1 & Mod 2 of R&W, Mod 1 & Mod 2 of Math.
                const rw1 = t.modules[0];
                const rw2 = t.modules[1]; // Easier (or Harder, they have same count/time)
                const math1 = t.modules[3];
                const math2 = t.modules[4]; // Easier (or Harder)
                totalQuestions = (rw1?.questions?.length || 0) + (rw2?.questions?.length || 0) + (math1?.questions?.length || 0) + (math2?.questions?.length || 0);
                totalMinutes = (rw1?.timeLimitMinutes || 0) + (rw2?.timeLimitMinutes || 0) + (math1?.timeLimitMinutes || 0) + (math2?.timeLimitMinutes || 0) + t.breakDurationMinutes;
                modulesSummary = [
                    { name: "Reading & Writing Module 1", section: "READING_WRITING", questionCount: rw1?.questions?.length || 0, timeLimitMinutes: rw1?.timeLimitMinutes || 0 },
                    { name: "Reading & Writing Module 2 (Adaptive)", section: "READING_WRITING", questionCount: rw2?.questions?.length || 0, timeLimitMinutes: rw2?.timeLimitMinutes || 0 },
                    { name: "Math Module 1", section: "MATH", questionCount: math1?.questions?.length || 0, timeLimitMinutes: math1?.timeLimitMinutes || 0 },
                    { name: "Math Module 2 (Adaptive)", section: "MATH", questionCount: math2?.questions?.length || 0, timeLimitMinutes: math2?.timeLimitMinutes || 0 }
                ];
            }
            else {
                totalQuestions = t.modules.reduce((s, m) => s + (m.questions?.length || 0), 0);
                totalMinutes = t.modules.reduce((s, m) => s + m.timeLimitMinutes, 0) + t.breakDurationMinutes;
                modulesSummary = t.modules.map((m) => ({
                    name: m.name,
                    section: m.section,
                    questionCount: m.questions?.length || 0,
                    timeLimitMinutes: m.timeLimitMinutes,
                }));
            }
            const attemptCount = await SATTestAttempt_1.default.countDocuments({
                student: req.user?.userId, test: t._id, status: "COMPLETED",
            });
            return {
                ...doc,
                totalQuestions,
                totalMinutes,
                attemptCount,
                modulesSummary,
            };
        }));
        res.status(200).json({ success: true, tests: testsWithMeta });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getSATTests = getSATTests;
// --- Student: start a SAT test ---
const startSATTest = async (req, res) => {
    try {
        const test = await SATTest_1.default.findById(req.params.id);
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        if (!test.isActive)
            return res.status(400).json({ success: false, error: "Test is not active" });
        if (req.user?.subscription === "FREE" && test.accessLevel === "PAID") {
            return res.status(403).json({ success: false, error: "Paid subscription required" });
        }
        // Check for existing in-progress attempt
        const existing = await SATTestAttempt_1.default.findOne({
            student: req.user?.userId, test: test._id,
            status: { $in: ["IN_PROGRESS", "ON_BREAK"] },
        });
        if (existing) {
            // Resume existing attempt
            const populatedTest = await SATTest_1.default.findById(test._id).populate("modules.questions");
            return res.status(200).json({ success: true, attempt: existing, test: populatedTest, resumed: true });
        }
        const moduleAttempts = test.modules.map((m, idx) => ({
            moduleIndex: idx,
            answers: [],
            startedAt: idx === 0 ? new Date() : null,
            completedAt: null,
            score: 0,
            totalQuestions: m.questions.length,
            correctCount: 0,
        }));
        let totalQuestions = 0;
        if (test.isAdaptive) {
            totalQuestions = (test.modules[0]?.questions.length || 0) +
                (test.modules[1]?.questions.length || 0) +
                (test.modules[3]?.questions.length || 0) +
                (test.modules[4]?.questions.length || 0);
        }
        else {
            totalQuestions = test.modules.reduce((s, m) => s + m.questions.length, 0);
        }
        const attempt = await SATTestAttempt_1.default.create({
            student: req.user?.userId,
            test: test._id,
            moduleAttempts,
            currentModuleIndex: 0,
            totalQuestions,
            startedAt: new Date(),
        });
        const populatedTest = await SATTest_1.default.findById(test._id).populate("modules.questions");
        res.status(201).json({ success: true, attempt, test: populatedTest });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.startSATTest = startSATTest;
// --- Student: save progress (auto-save / manual save) ---
const saveSATProgress = async (req, res) => {
    try {
        const { id } = req.params;
        const { moduleIndex, answers, markedForReview } = req.body;
        const attempt = await SATTestAttempt_1.default.findOne({
            _id: id, student: req.user?.userId,
            status: { $in: ["IN_PROGRESS", "ON_BREAK"] },
        });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        if (moduleIndex !== undefined && attempt.moduleAttempts[moduleIndex]) {
            const modAttempt = attempt.moduleAttempts[moduleIndex];
            if (answers) {
                modAttempt.answers = answers.map((a) => ({
                    question: a.question,
                    selectedAnswer: a.selectedAnswer || null,
                    isCorrect: false,
                    markedForReview: markedForReview?.[a.question] || false,
                    timeSpent: a.timeSpent || 0,
                }));
            }
        }
        await attempt.save();
        res.status(200).json({ success: true, message: "Progress saved" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.saveSATProgress = saveSATProgress;
// --- Student: complete a module and move to break/next ---
const completeModule = async (req, res) => {
    try {
        const { id } = req.params;
        const { moduleIndex, answers } = req.body;
        const attempt = await SATTestAttempt_1.default.findOne({
            _id: id, student: req.user?.userId,
            status: { $in: ["IN_PROGRESS", "ON_BREAK"] },
        });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        const test = await SATTest_1.default.findById(attempt.test);
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        const mod = test.modules[moduleIndex];
        const modAttempt = attempt.moduleAttempts[moduleIndex];
        if (!mod || !modAttempt)
            return res.status(400).json({ success: false, error: "Invalid module index" });
        // Score the answers
        const questionIds = mod.questions.map((q) => q.toString());
        const questions = await Question_1.default.find({ _id: { $in: questionIds } });
        const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));
        let correctCount = 0;
        const incomingAnswersMap = new Map((answers || []).map((a) => [a.question.toString(), a]));
        modAttempt.answers = mod.questions.map((qIdRef) => {
            const qIdStr = qIdRef.toString();
            const q = questionMap.get(qIdStr);
            const incomingAns = incomingAnswersMap.get(qIdStr);
            const selectedAnswer = incomingAns?.selectedAnswer || null;
            const isCorrect = q && selectedAnswer
                ? (0, grading_1.checkAnswerCorrectness)(q.correctAnswer, selectedAnswer)
                : false;
            if (isCorrect)
                correctCount++;
            return {
                question: qIdRef,
                selectedAnswer,
                isCorrect,
                markedForReview: incomingAns?.markedForReview || false,
                timeSpent: incomingAns?.timeSpent || 0,
            };
        });
        modAttempt.correctCount = correctCount;
        modAttempt.score = correctCount;
        modAttempt.completedAt = new Date();
        let nextModuleIndex = moduleIndex + 1;
        let isBreakPoint = false;
        if (test.isAdaptive) {
            const scorePct = modAttempt.totalQuestions > 0 ? (correctCount / modAttempt.totalQuestions) * 100 : 0;
            if (moduleIndex === 0) {
                // R&W Module 1 completed: route to R&W Module 2 (index 2 for Harder >= 65%, index 1 for Easier < 65%)
                nextModuleIndex = scorePct >= 65 ? 2 : 1;
            }
            else if (moduleIndex === 1 || moduleIndex === 2) {
                // R&W Module 2 (Easier or Harder) completed: go to break, next is Math Module 1 (index 3)
                isBreakPoint = true;
                nextModuleIndex = 3;
            }
            else if (moduleIndex === 3) {
                // Math Module 1 completed: route to Math Module 2 (index 5 for Harder >= 65%, index 4 for Easier < 65%)
                nextModuleIndex = scorePct >= 65 ? 5 : 4;
            }
            else if (moduleIndex === 4 || moduleIndex === 5) {
                // Math Module 2 (Easier or Harder) completed: end of test
                return finalizeAttempt(attempt, res);
            }
        }
        else {
            // Linear logic
            nextModuleIndex = moduleIndex + 1;
            isBreakPoint = moduleIndex === 1 && test.modules.length > 2;
        }
        if (isBreakPoint) {
            attempt.status = "ON_BREAK";
            attempt.breakStartedAt = new Date();
            attempt.currentModuleIndex = nextModuleIndex;
        }
        else if ((test.isAdaptive && nextModuleIndex < 6) || (!test.isAdaptive && nextModuleIndex < test.modules.length)) {
            attempt.currentModuleIndex = nextModuleIndex;
            attempt.moduleAttempts[nextModuleIndex].startedAt = new Date();
            attempt.status = "IN_PROGRESS";
        }
        else {
            return finalizeAttempt(attempt, res);
        }
        await attempt.save();
        res.status(200).json({ success: true, attempt });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.completeModule = completeModule;
// --- Student: end break and start next module ---
const endBreak = async (req, res) => {
    try {
        const { id } = req.params;
        const attempt = await SATTestAttempt_1.default.findOne({
            _id: id, student: req.user?.userId, status: "ON_BREAK",
        });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found or not on break" });
        attempt.breakCompletedAt = new Date();
        attempt.status = "IN_PROGRESS";
        const nextIdx = attempt.currentModuleIndex;
        if (attempt.moduleAttempts[nextIdx]) {
            attempt.moduleAttempts[nextIdx].startedAt = new Date();
        }
        await attempt.save();
        res.status(200).json({ success: true, attempt });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.endBreak = endBreak;
// --- Student: submit entire test ---
const submitSATTest = async (req, res) => {
    try {
        const { id } = req.params;
        const attempt = await SATTestAttempt_1.default.findOne({
            _id: id, student: req.user?.userId,
            status: { $in: ["IN_PROGRESS", "ON_BREAK"] },
        });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        return finalizeAttempt(attempt, res);
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.submitSATTest = submitSATTest;
async function finalizeAttempt(attempt, res) {
    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalTime = 0;
    const test = await SATTest_1.default.findById(attempt.test);
    const isAdaptive = test?.isAdaptive || false;
    for (const mod of attempt.moduleAttempts) {
        if (isAdaptive && !mod.startedAt)
            continue;
        totalCorrect += mod.correctCount;
        totalQuestions += mod.totalQuestions;
        if (mod.startedAt && mod.completedAt) {
            const moduleLimitMinutes = test?.modules?.[mod.moduleIndex]?.timeLimitMinutes || 35;
            const actualTimeSpent = Math.round((new Date(mod.completedAt).getTime() - new Date(mod.startedAt).getTime()) / 1000);
            totalTime += Math.min(actualTimeSpent, moduleLimitMinutes * 60);
        }
    }
    attempt.totalCorrect = totalCorrect;
    attempt.totalScore = totalCorrect;
    attempt.totalQuestions = totalQuestions;
    attempt.percentage = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    attempt.totalTimeTaken = totalTime;
    attempt.status = "COMPLETED";
    attempt.completedAt = new Date();
    await attempt.save();
    // Update student stats for gamification
    try {
        const student = await User_1.default.findById(attempt.student);
        if (student) {
            const pointsToAdd = (totalCorrect * 10) + 100; // 10 points per correct + 100 bonus for full test
            student.leaderboardPoints += pointsToAdd;
            const todayStr = new Date().toISOString().split("T")[0];
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split("T")[0];
            if (student.lastActiveDate === yesterdayStr) {
                student.streakCount += 1;
                student.lastActiveDate = todayStr;
            }
            else if (student.lastActiveDate !== todayStr) {
                student.streakCount = 1;
                student.lastActiveDate = todayStr;
            }
            await student.save();
        }
    }
    catch (err) {
        console.error("Error updating user stats on mock test completion:", err);
    }
    res.status(200).json({ success: true, attempt });
}
// --- Student: get attempt details ---
const getSATAttempt = async (req, res) => {
    try {
        const attempt = await SATTestAttempt_1.default.findOne({
            _id: req.params.id, student: req.user?.userId,
        })
            .populate({
            path: "test",
            populate: {
                path: "modules.questions",
                select: "text options correctAnswer explanation difficulty category"
            }
        })
            .populate({ path: "moduleAttempts.answers.question", select: "text options correctAnswer explanation difficulty category" });
        if (!attempt)
            return res.status(404).json({ success: false, error: "Attempt not found" });
        const attemptObj = attempt.toObject();
        const test = attemptObj.test;
        if (test && test.modules) {
            for (const ma of attemptObj.moduleAttempts) {
                if (!ma.startedAt)
                    continue;
                const testMod = test.modules[ma.moduleIndex];
                if (!testMod || !testMod.questions)
                    continue;
                // Map existing answers by question ID
                const existingAnswersMap = new Map();
                for (const ans of ma.answers) {
                    const qId = ans.question?._id?.toString() || ans.question?.toString();
                    if (qId) {
                        existingAnswersMap.set(qId, ans);
                    }
                }
                // Reconstruct answers list to match all questions of the module in order
                const fullAnswers = testMod.questions.map((q) => {
                    const qId = q._id?.toString() || q.toString();
                    const existing = existingAnswersMap.get(qId);
                    if (existing) {
                        return {
                            ...existing,
                            question: q
                        };
                    }
                    else {
                        return {
                            question: q,
                            selectedAnswer: null,
                            isCorrect: false,
                            markedForReview: false,
                            timeSpent: 0
                        };
                    }
                });
                ma.answers = fullAnswers;
            }
        }
        res.status(200).json({ success: true, attempt: attemptObj });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getSATAttempt = getSATAttempt;
// --- Student: list own SAT attempts ---
const getMySATAttempts = async (req, res) => {
    try {
        const attempts = await SATTestAttempt_1.default.find({
            student: req.user?.userId, status: "COMPLETED",
        })
            .populate("test", "title year testNumber")
            .sort({ completedAt: -1 });
        res.status(200).json({ success: true, attempts });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getMySATAttempts = getMySATAttempts;
// --- Admin: list all SAT tests ---
const getAllSATTestsAdmin = async (req, res) => {
    try {
        const tests = await SATTest_1.default.find().populate("modules.questions").sort({ year: -1, testNumber: 1 });
        res.status(200).json({ success: true, tests });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getAllSATTestsAdmin = getAllSATTestsAdmin;
// --- Admin: update SAT test active status / access level ---
const updateSATTestAdmin = async (req, res) => {
    try {
        const { title, year, testNumber, isActive, accessLevel, pdfUrl, explanationPdfUrl, rwScoreMapping, mathScoreMapping } = req.body;
        const update = {};
        if (title !== undefined)
            update.title = title;
        if (year !== undefined)
            update.year = year;
        if (testNumber !== undefined)
            update.testNumber = testNumber;
        if (isActive !== undefined)
            update.isActive = isActive;
        if (accessLevel !== undefined)
            update.accessLevel = accessLevel;
        if (pdfUrl !== undefined)
            update.pdfUrl = pdfUrl;
        if (explanationPdfUrl !== undefined)
            update.explanationPdfUrl = explanationPdfUrl;
        if (rwScoreMapping !== undefined)
            update.rwScoreMapping = rwScoreMapping;
        if (mathScoreMapping !== undefined)
            update.mathScoreMapping = mathScoreMapping;
        const test = await SATTest_1.default.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        res.status(200).json({ success: true, test });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateSATTestAdmin = updateSATTestAdmin;
// --- Admin: delete SAT test ---
const deleteSATTestAdmin = async (req, res) => {
    try {
        const test = await SATTest_1.default.findByIdAndDelete(req.params.id);
        if (!test)
            return res.status(404).json({ success: false, error: "Test not found" });
        res.status(200).json({ success: true, message: "Test deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteSATTestAdmin = deleteSATTestAdmin;
