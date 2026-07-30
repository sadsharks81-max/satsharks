"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentProgressReports = exports.getLeaderboard = exports.getTimingAnalysis = exports.getErrorAnalysis = exports.getPredictedScore = exports.getCategoryBreakdown = exports.getPerformanceData = exports.getUnifiedHistory = exports.getTestHistory = exports.getDashboardStats = void 0;
const SATTestAttempt_1 = __importDefault(require("../models/SATTestAttempt"));
const PracticeSession_1 = __importDefault(require("../models/PracticeSession"));
const VocabularyProgress_1 = __importDefault(require("../models/VocabularyProgress"));
const User_1 = __importDefault(require("../models/User"));
const getDashboardStats = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const [totalTests, practiceCount, practiceCorrect, attempts, recentPractice] = await Promise.all([
            SATTestAttempt_1.default.countDocuments({ student: studentId, status: "COMPLETED" }),
            PracticeSession_1.default.countDocuments({ student: studentId }),
            PracticeSession_1.default.countDocuments({ student: studentId, isCorrect: true }),
            SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
                .select("percentage totalCorrect createdAt")
                .sort({ createdAt: -1 }),
            PracticeSession_1.default.find({ student: studentId })
                .populate({
                path: "question",
                select: "text difficulty category section",
                populate: { path: "category", select: "name" },
            })
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
        ]);
        const avgScore = attempts.length > 0
            ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
            : 0;
        const bestScore = attempts.length > 0
            ? Math.max(...attempts.map((a) => a.percentage))
            : 0;
        const recentAttempts = attempts.slice(0, 5);
        res.status(200).json({
            success: true,
            stats: {
                totalTests,
                practiceCount,
                practiceCorrect,
                practiceIncorrect: Math.max(0, practiceCount - practiceCorrect),
                practiceAccuracy: practiceCount > 0 ? Math.round((practiceCorrect / practiceCount) * 100) : 0,
                avgScore,
                bestScore,
            },
            recentAttempts,
            recentPractice: recentPractice.map((session) => ({
                id: session._id,
                question: session.question?.text || "Practice question",
                category: session.question?.category?.name || "General",
                section: session.question?.section || "",
                difficulty: session.question?.difficulty || "MEDIUM",
                selectedAnswer: session.selectedAnswer,
                isCorrect: session.isCorrect,
                timeSpent: session.timeSpent,
                createdAt: session.createdAt,
            })),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getDashboardStats = getDashboardStats;
const getTestHistory = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const { page = "1", limit = "20" } = req.query;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const [attempts, total] = await Promise.all([
            SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
                .populate("test", "title year testNumber")
                .sort({ completedAt: -1 })
                .skip(skip)
                .limit(limitNum),
            SATTestAttempt_1.default.countDocuments({ student: studentId, status: "COMPLETED" }),
        ]);
        res.status(200).json({
            success: true,
            attempts,
            pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getTestHistory = getTestHistory;
const getUnifiedHistory = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const [fullTests, practice, vocabulary] = await Promise.all([
            SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
                .populate("test", "title year testNumber")
                .sort({ completedAt: -1 })
                .lean(),
            PracticeSession_1.default.find({ student: studentId })
                .populate({ path: "question", select: "text category difficulty", populate: { path: "category", select: "name" } })
                .sort({ createdAt: -1 })
                .lean(),
            VocabularyProgress_1.default.findOne({ student: studentId }).lean(),
        ]);
        res.status(200).json({
            success: true,
            fullTests,
            practice: practice.map((item) => ({
                _id: item._id,
                title: item.question?.category?.name || "Practice Question",
                question: item.question?.text || "Practice question",
                correct: item.isCorrect,
                selectedAnswer: item.selectedAnswer,
                timeSpent: item.timeSpent || 0,
                createdAt: item.createdAt,
            })),
            vocabulary: vocabulary ? [{
                    _id: vocabulary._id,
                    title: "Vocabulary Mastery",
                    totalAttempts: vocabulary.totalAttempts,
                    totalCorrect: vocabulary.totalCorrect,
                    percentage: vocabulary.totalAttempts ? Math.round((vocabulary.totalCorrect / vocabulary.totalAttempts) * 100) : 0,
                    updatedAt: vocabulary.updatedAt,
                }] : [],
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getUnifiedHistory = getUnifiedHistory;
const getPerformanceData = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const attempts = await SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
            .populate("test", "title year testNumber")
            .sort({ completedAt: 1 });
        const data = attempts.map((a, i) => ({
            index: i + 1,
            testTitle: a.test?.title || "Test",
            section: "FULL",
            score: a.percentage,
            correctCount: a.totalCorrect,
            totalQuestions: a.totalQuestions,
            date: a.completedAt,
        }));
        res.status(200).json({ success: true, performance: data });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getPerformanceData = getPerformanceData;
const getCategoryBreakdown = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const attempts = await SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
            .populate({
            path: "moduleAttempts.answers.question",
            select: "category difficulty",
            populate: { path: "category", select: "name section" },
        });
        const categoryStats = {};
        for (const attempt of attempts) {
            for (const mod of attempt.moduleAttempts) {
                for (const ans of mod.answers) {
                    const q = ans.question;
                    if (!q?.category)
                        continue;
                    const catId = q.category._id.toString();
                    if (!categoryStats[catId]) {
                        categoryStats[catId] = { correct: 0, total: 0, name: q.category.name };
                    }
                    categoryStats[catId].total++;
                    if (ans.isCorrect)
                        categoryStats[catId].correct++;
                }
            }
        }
        const breakdown = Object.values(categoryStats).map((c) => ({
            category: c.name,
            correct: c.correct,
            total: c.total,
            percentage: c.total > 0 ? Math.round((c.correct / c.total) * 100) : 0,
        }));
        res.status(200).json({ success: true, breakdown });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getCategoryBreakdown = getCategoryBreakdown;
const getPredictedScore = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const attempts = await SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
            .populate({
            path: "moduleAttempts.answers.question",
            select: "difficulty"
        })
            .sort({ completedAt: -1 })
            .limit(10);
        if (attempts.length === 0) {
            return res.status(200).json({ success: true, predicted: null, message: "Take a test to see your predicted score" });
        }
        // Weight by recency and difficulty level of questions in attempts
        let weightedCorrect = 0;
        let weightedTotal = 0;
        let recencyWeightSum = 0;
        attempts.forEach((attempt, index) => {
            const recencyWeight = Math.pow(0.85, index); // More recent tests have higher weight
            recencyWeightSum += recencyWeight;
            let attemptWeightedCorrect = 0;
            let attemptWeightedTotal = 0;
            attempt.moduleAttempts.forEach((mod) => {
                mod.answers.forEach((ans) => {
                    const q = ans.question;
                    if (!q)
                        return;
                    // Question Difficulty Weights: EASY=1.0, MEDIUM=1.2, HARD=1.5
                    const diff = q.difficulty || "MEDIUM";
                    const diffWeight = diff === "EASY" ? 1.0 : diff === "HARD" ? 1.5 : 1.2;
                    attemptWeightedTotal += diffWeight;
                    if (ans.isCorrect) {
                        attemptWeightedCorrect += diffWeight;
                    }
                });
            });
            if (attemptWeightedTotal > 0) {
                const attemptAccuracy = attemptWeightedCorrect / attemptWeightedTotal;
                weightedCorrect += attemptAccuracy * recencyWeight;
            }
            else {
                // Fallback to simple percentage if no populated questions
                const attemptAccuracy = attempt.percentage / 100;
                weightedCorrect += attemptAccuracy * recencyWeight;
            }
        });
        const averageAccuracy = weightedCorrect / recencyWeightSum;
        const predictedScore = Math.round(400 + averageAccuracy * 1200);
        const confidence = Math.min(95, 40 + attempts.length * 5.5);
        res.status(200).json({
            success: true,
            predicted: {
                score: predictedScore,
                confidence: Math.round(confidence),
                basedOn: attempts.length,
                range: {
                    low: Math.max(400, predictedScore - 60),
                    high: Math.min(1600, predictedScore + 60),
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getPredictedScore = getPredictedScore;
const getErrorAnalysis = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const attempts = await SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
            .populate({
            path: "moduleAttempts.answers.question",
            select: "text difficulty correctAnswer explanation options category",
            populate: { path: "category", select: "name section" }
        });
        const categoryErrorStats = {};
        const incorrectQuestionsList = [];
        for (const attempt of attempts) {
            for (const mod of attempt.moduleAttempts) {
                for (const ans of mod.answers) {
                    if (ans.isCorrect)
                        continue;
                    const q = ans.question;
                    if (!q)
                        continue;
                    const catId = q.category?._id?.toString() || "Unknown";
                    const catName = q.category?.name || "Uncategorized";
                    const catSec = q.category?.section || q.section || "MATH";
                    if (!categoryErrorStats[catId]) {
                        categoryErrorStats[catId] = { errors: 0, name: catName, section: catSec };
                    }
                    categoryErrorStats[catId].errors++;
                    incorrectQuestionsList.push({
                        questionId: q._id,
                        text: q.text,
                        difficulty: q.difficulty || "MEDIUM",
                        correctAnswer: q.correctAnswer,
                        selectedAnswer: ans.selectedAnswer,
                        skipped: !ans.selectedAnswer,
                        explanation: q.explanation || "No explanation provided.",
                        options: q.options || [],
                        categoryName: catName,
                        sectionName: catSec === "MATH" ? "Math" : "Reading & Writing",
                        completedAt: attempt.completedAt,
                    });
                }
            }
        }
        // Sort by recent attempts first
        incorrectQuestionsList.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
        res.status(200).json({
            success: true,
            errorStats: Object.values(categoryErrorStats),
            // Limit to 20 most recent mistakes
            incorrectQuestions: incorrectQuestionsList.slice(0, 20),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getErrorAnalysis = getErrorAnalysis;
const getTimingAnalysis = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        const attempts = await SATTestAttempt_1.default.find({ student: studentId, status: "COMPLETED" })
            .populate({
            path: "moduleAttempts.answers.question",
            select: "text difficulty category section",
            populate: { path: "category", select: "name" }
        });
        let totalRwTime = 0;
        let totalRwCount = 0;
        let totalMathTime = 0;
        let totalMathCount = 0;
        // First pass: Calculate average time spent per question per section
        for (const attempt of attempts) {
            for (const mod of attempt.moduleAttempts) {
                const firstAns = mod.answers.find((a) => a.question);
                const isRw = firstAns
                    ? firstAns.question.section === "READING_WRITING"
                    : (mod.moduleIndex === 0 || mod.moduleIndex === 1);
                for (const ans of mod.answers) {
                    const time = ans.timeSpent || 0;
                    if (time <= 0)
                        continue;
                    if (isRw) {
                        totalRwTime += time;
                        totalRwCount++;
                    }
                    else {
                        totalMathTime += time;
                        totalMathCount++;
                    }
                }
            }
        }
        const rwAvg = totalRwCount > 0 ? totalRwTime / totalRwCount : 0;
        const mathAvg = totalMathCount > 0 ? totalMathTime / totalMathCount : 0;
        const slowQuestions = [];
        // Second pass: Flag questions where timeSpent > 1.5 * average
        for (const attempt of attempts) {
            for (const mod of attempt.moduleAttempts) {
                const firstAns = mod.answers.find((a) => a.question);
                const isRw = firstAns
                    ? firstAns.question.section === "READING_WRITING"
                    : (mod.moduleIndex === 0 || mod.moduleIndex === 1);
                const sectionAverage = isRw ? rwAvg : mathAvg;
                if (sectionAverage <= 0)
                    continue;
                const threshold = sectionAverage * 1.5;
                for (const ans of mod.answers) {
                    const time = ans.timeSpent || 0;
                    if (time <= threshold)
                        continue;
                    const q = ans.question;
                    if (!q)
                        continue;
                    slowQuestions.push({
                        questionId: q._id,
                        text: q.text,
                        difficulty: q.difficulty || "MEDIUM",
                        categoryName: q.category?.name || "General",
                        sectionName: isRw ? "Reading & Writing" : "Math",
                        timeSpent: time,
                        avgTime: Math.round(isRw ? rwAvg : mathAvg),
                        percentageSlow: Math.round(((time - (isRw ? rwAvg : mathAvg)) / (isRw ? rwAvg : mathAvg)) * 100),
                        completedAt: attempt.completedAt,
                    });
                }
            }
        }
        slowQuestions.sort((a, b) => b.timeSpent - a.timeSpent);
        res.status(200).json({
            success: true,
            stats: {
                rwAvg: Math.round(rwAvg),
                mathAvg: Math.round(mathAvg),
            },
            slowQuestions: slowQuestions.slice(0, 15),
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getTimingAnalysis = getTimingAnalysis;
const getLeaderboard = async (req, res) => {
    try {
        const students = await User_1.default.find({ role: "STUDENT", status: "ACTIVE" })
            .select("name leaderboardPoints streakCount")
            .sort({ leaderboardPoints: -1, streakCount: -1 })
            .limit(5);
        const data = students.map((s, index) => ({
            rank: index + 1,
            id: s.id,
            name: s.name,
            points: s.leaderboardPoints || 0,
            streak: s.streakCount || 0,
        }));
        res.status(200).json({
            success: true,
            leaderboard: data,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getLeaderboard = getLeaderboard;
const getStudentProgressReports = async (req, res) => {
    try {
        const end = req.query.end ? new Date(String(req.query.end)) : new Date();
        end.setHours(23, 59, 59, 999);
        const start = req.query.start ? new Date(String(req.query.start)) : new Date(end.getTime() - 6 * 86400000);
        start.setHours(0, 0, 0, 0);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
            return res.status(400).json({ success: false, error: "Invalid report date range." });
        }
        const students = await User_1.default.find({ role: "STUDENT" }).select("name email status targetScore").lean();
        const dateFilter = { $gte: start, $lte: end };
        const reports = await Promise.all(students.map(async (student) => {
            const [attempts, practiceTotal, practiceCorrect, vocab] = await Promise.all([
                SATTestAttempt_1.default.find({ student: student._id, status: "COMPLETED", completedAt: dateFilter })
                    .select("percentage totalCorrect totalQuestions totalTimeTaken completedAt")
                    .sort({ completedAt: 1 })
                    .lean(),
                PracticeSession_1.default.countDocuments({ student: student._id, createdAt: dateFilter }),
                PracticeSession_1.default.countDocuments({ student: student._id, isCorrect: true, createdAt: dateFilter }),
                VocabularyProgress_1.default.findOne({ student: student._id }).select("totalAttempts totalCorrect").lean(),
            ]);
            const firstScore = attempts[0]?.percentage || 0;
            const latestScore = attempts.at(-1)?.percentage || 0;
            const averageScore = attempts.length
                ? Math.round(attempts.reduce((sum, item) => sum + (item.percentage || 0), 0) / attempts.length)
                : 0;
            return {
                student,
                fullTests: attempts.length,
                firstScore,
                latestScore,
                averageScore,
                improvement: latestScore - firstScore,
                practiceTotal,
                practiceCorrect,
                practiceAccuracy: practiceTotal ? Math.round((practiceCorrect / practiceTotal) * 100) : 0,
                vocabAttempts: vocab?.totalAttempts || 0,
                vocabAccuracy: vocab?.totalAttempts ? Math.round((vocab.totalCorrect / vocab.totalAttempts) * 100) : 0,
                attempts,
            };
        }));
        const [dailyTests, dailyPractice] = await Promise.all([
            SATTestAttempt_1.default.aggregate([
                { $match: { status: "COMPLETED", completedAt: dateFilter } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } }, tests: { $sum: 1 }, averageScore: { $avg: "$percentage" } } },
            ]),
            PracticeSession_1.default.aggregate([
                { $match: { createdAt: dateFilter } },
                { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, practice: { $sum: 1 }, correct: { $sum: { $cond: ["$isCorrect", 1, 0] } } } },
            ]),
        ]);
        const testMap = new Map(dailyTests.map((item) => [item._id, item]));
        const practiceMap = new Map(dailyPractice.map((item) => [item._id, item]));
        const daily = [];
        for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
            const key = cursor.toISOString().slice(0, 10);
            const tests = testMap.get(key);
            const practice = practiceMap.get(key);
            daily.push({
                date: key,
                tests: tests?.tests || 0,
                averageScore: Math.round(tests?.averageScore || 0),
                practice: practice?.practice || 0,
                correct: practice?.correct || 0,
            });
        }
        res.status(200).json({ success: true, reports, daily, range: { start, end } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getStudentProgressReports = getStudentProgressReports;
