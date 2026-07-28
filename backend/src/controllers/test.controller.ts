import { Request, Response } from "express";
import DiagnosticTest from "../models/DiagnosticTest";
import TestAttempt from "../models/TestAttempt";
import Question from "../models/Question";
import { AuthRequest } from "../middleware/auth.middleware";
import { checkAnswerCorrectness } from "../utils/grading";

export const getTests = async (req: AuthRequest, res: Response) => {
  try {
    const userSub = req.user?.subscription;
    const filter: any = { isActive: true };
    if (userSub === "FREE") filter.accessLevel = "FREE";

    const tests = await DiagnosticTest.find(filter).sort({ createdAt: 1 });

    const testsWithCount = await Promise.all(
      tests.map(async (t) => {
        const attemptCount = await TestAttempt.countDocuments({
          student: req.user?.userId,
          test: t._id,
          status: "COMPLETED",
        });
        const { questions, ...rest } = t.toObject();
        return { ...rest, questionCount: (questions || []).length, attemptCount };
      })
    );

    res.status(200).json({ success: true, tests: testsWithCount });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getTest = async (req: Request, res: Response) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id)
      .populate({ path: "questions", select: "text options section difficulty category" });
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });
    res.status(200).json({ success: true, test });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createTest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, section, questions, timeLimit, accessLevel } = req.body;
    const test = await DiagnosticTest.create({
      title, description, section, questions, timeLimit,
      totalMarks: questions.length,
      accessLevel: accessLevel || "FREE",
      createdBy: req.user?.userId,
    });
    res.status(201).json({ success: true, test });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateTest = async (req: Request, res: Response) => {
  try {
    const { title, description, section, questions, timeLimit, accessLevel, isActive } = req.body;
    const update: any = {};
    if (title !== undefined) update.title = title;
    if (description !== undefined) update.description = description;
    if (section !== undefined) update.section = section;
    if (questions !== undefined) { update.questions = questions; update.totalMarks = questions.length; }
    if (timeLimit !== undefined) update.timeLimit = timeLimit;
    if (accessLevel !== undefined) update.accessLevel = accessLevel;
    if (isActive !== undefined) update.isActive = isActive;

    const test = await DiagnosticTest.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });
    res.status(200).json({ success: true, test });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteTest = async (req: Request, res: Response) => {
  try {
    const test = await DiagnosticTest.findByIdAndDelete(req.params.id);
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });
    res.status(200).json({ success: true, message: "Test deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllTestsAdmin = async (req: Request, res: Response) => {
  try {
    const tests = await DiagnosticTest.find().sort({ createdAt: 1 });
    res.status(200).json({ success: true, tests });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const startTest = async (req: AuthRequest, res: Response) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id)
      .populate({ path: "questions", select: "text options section difficulty category" });
    if (!test) return res.status(404).json({ success: false, error: "Test not found" });
    if (!test.isActive) return res.status(400).json({ success: false, error: "Test is not active" });

    if (req.user?.subscription === "FREE" && test.accessLevel === "PAID") {
      return res.status(403).json({ success: false, error: "Paid subscription required for this test" });
    }

    const attempt = await TestAttempt.create({
      student: req.user?.userId,
      test: test._id,
      totalQuestions: test.questions.length,
      startedAt: new Date(),
    });

    res.status(201).json({ success: true, attempt, test });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { answers, timeTaken } = req.body;

    const attempt = await TestAttempt.findOne({
      _id: id,
      student: req.user?.userId,
      status: "IN_PROGRESS",
    });
    if (!attempt) return res.status(404).json({ success: false, error: "Attempt not found" });

    const questionIds = answers.map((a: any) => a.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let correctCount = 0;
    const scoredAnswers = answers.map((a: any) => {
      const q = questionMap.get(a.question);
      const isCorrect = q && a.selectedAnswer
        ? checkAnswerCorrectness(q.correctAnswer, a.selectedAnswer)
        : false;
      if (isCorrect) correctCount++;
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const attempt = await TestAttempt.findOne({
      _id: req.params.id,
      student: req.user?.userId,
    })
      .populate({ path: "test", select: "title section timeLimit" })
      .populate({ path: "answers.question", select: "text options correctAnswer explanation category difficulty" });

    if (!attempt) return res.status(404).json({ success: false, error: "Attempt not found" });
    res.status(200).json({ success: true, attempt });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
