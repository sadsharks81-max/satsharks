import { Response } from "express";
import PracticeSession from "../models/PracticeSession";
import Question from "../models/Question";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";
import { checkAnswerCorrectness } from "../utils/grading";
import SATTest from "../models/SATTest";
import SATTestAttempt from "../models/SATTestAttempt";
import QuestionCategory from "../models/QuestionCategory";
import { stripEmojis } from "../utils/text";
import { sendError } from "../utils/http";

const CUSTOM_TEST_CATEGORY_NAMES = {
  MATH: ["SAT Advanced Math", "SAT Algebra", "SAT Data & Statistics", "SAT Geometry"],
  READING_WRITING: ["SAT Grammar & Writing", "SAT Reading & Writing", "SAT Vocabulary", "SAT Reading Comprehension"],
} as const;

export const submitPracticeAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, selectedAnswer, timeSpent } = req.body;
    const studentId = req.user?.userId;

    if (req.user?.subscription === "FREE") {
      const count = await PracticeSession.countDocuments({ student: studentId });
      if (count >= 20) {
        return res.status(403).json({
          success: false,
          error: "You have reached the free limit of 20 practice questions. Please upgrade to a Premium plan to unlock unlimited access to all 3,686 questions!",
          limitReached: true,
        });
      }
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });

    const isCorrect = checkAnswerCorrectness(question.correctAnswer, selectedAnswer);

    const session = await PracticeSession.create({
      student: studentId,
      question: questionId,
      selectedAnswer,
      isCorrect,
      timeSpent: timeSpent || 0,
    });

    // Update user points, streak, and daily practice count
    const user = await User.findById(studentId);
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
      } else if (user.lastActiveDate === todayStr) {
        user.dailyPracticeProgress += 1;
      } else {
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
        explanation: stripEmojis(question.explanation),
        sessionId: session._id,
      },
    });
  } catch (error) {
    sendError(res, error, "practice.submitPracticeAnswer");
  }
};


export const getPracticeHistory = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    const { page = "1", limit = "20" } = req.query;
    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [sessions, total] = await Promise.all([
      PracticeSession.find({ student: studentId })
        .populate("question", "text category difficulty section imageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      PracticeSession.countDocuments({ student: studentId }),
    ]);

    const correct = await PracticeSession.countDocuments({ student: studentId, isCorrect: true });

    res.status(200).json({
      success: true,
      sessions,
      stats: { total, correct, accuracy: total > 0 ? Math.round((correct / total) * 100) : 0 },
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    sendError(res, error, "practice.getPracticeHistory");
  }
};

export const createCustomTest = async (req: AuthRequest, res: Response) => {
  try {
    const studentId = req.user?.userId;
    const { subject, difficulties, categories } = req.body;

    if (!studentId || !subject) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const totalNeeded = subject === "READING_WRITING" ? 54 : 44;
    const timeLimitMinutes = subject === "READING_WRITING" ? 32 : 35;

    const allowedNames = CUSTOM_TEST_CATEGORY_NAMES[subject as keyof typeof CUSTOM_TEST_CATEGORY_NAMES];
    if (!allowedNames) {
      return res.status(400).json({ success: false, error: "Invalid custom test subject." });
    }

    const allowedCategoryDocs = await QuestionCategory.find({ name: { $in: allowedNames } }).select("_id");
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

    const matchCriteria: any = { section: subject, category: { $in: selectedCategoryIds } };
    if (difficulties && difficulties.length > 0) {
      matchCriteria.difficulty = { $in: difficulties };
    }

    let questions = await Question.aggregate([
      { $match: matchCriteria },
      { $sample: { size: totalNeeded } },
    ]);

    if (questions.length < totalNeeded) {
      const existingIds = questions.map((q: any) => q._id);
      const remaining = totalNeeded - questions.length;
      
      const fallbackQuestions = await Question.aggregate([
        { $match: { ...matchCriteria, _id: { $nin: existingIds } } },
        { $sample: { size: remaining } },
      ]);
      
      questions = [...questions, ...fallbackQuestions];
    }

    if (questions.length === 0) {
      return res.status(400).json({ success: false, error: "No questions found for this subject." });
    }

    const actualModSize = Math.floor(questions.length / 2);
    
    const customTest = await SATTest.create({
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
          questions: questions.slice(0, actualModSize).map((q: any) => q._id),
          timeLimitMinutes: timeLimitMinutes,
        },
        {
          name: "Module 2",
          section: subject,
          moduleNumber: 2,
          questions: questions.slice(actualModSize, actualModSize * 2).map((q: any) => q._id),
          timeLimitMinutes: timeLimitMinutes,
        }
      ]
    });

    const attempt = await SATTestAttempt.create({
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
  } catch (error: any) {
    console.error("Create Custom Test Error:", error);
    return res.status(500).json({ success: false, error: "Failed to generate custom test." });
  }
};
