import { Request, Response } from "express";
import mongoose from "mongoose";
import Question from "../models/Question";
import DiagnosticTest from "../models/DiagnosticTest";
import SATTest from "../models/SATTest";
import { AuthRequest } from "../middleware/auth.middleware";
import { stripEmojis } from "../utils/text";
import { deleteManagedImage, deleteReplacedManagedImage } from "../utils/managed-image";
import { sendError } from "../utils/http";
import { asEnumValue, asObjectId, buildSearchFilter, getPagination } from "../utils/query";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
const SECTIONS = ["READING_WRITING", "MATH"] as const;
const STATUSES = ["UPLOADED", "REVIEW", "PUBLISHED", "UPDATED"] as const;

/**
 * Builds a Question filter from untrusted query params.
 *
 * Two problems this closes:
 *  - every value was previously copied straight from req.query, so
 *    `?status[$ne]=PUBLISHED` injected a Mongo operator and revealed unpublished
 *    questions to any logged-in student.
 *  - `search` was interpolated into $regex unescaped, making
 *    `?search=(a+)+$` a catastrophic-backtracking DoS against an unindexed field.
 */
const buildQuestionFilter = (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = {};
  const category = asObjectId(query.category);
  if (category) filter.category = category;

  const difficulty = asEnumValue(query.difficulty, DIFFICULTIES);
  if (difficulty) filter.difficulty = difficulty;

  const section = asEnumValue(query.section, SECTIONS);
  if (section) filter.section = section;

  const search = buildSearchFilter(query.search);
  if (search) filter.text = search;

  return { filter, category };
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { filter, category } = buildQuestionFilter(req.query as Record<string, unknown>);

    if (!category && req.query.excludeCategories) {
      const excluded = String(req.query.excludeCategories)
        .split(",")
        .map((value) => value.trim())
        .filter((value) => mongoose.Types.ObjectId.isValid(value));
      if (excluded.length > 0) filter.category = { $nin: excluded };
    }

    // This route is reachable by any authenticated student, so the status filter
    // is fixed rather than caller-controlled: allowing `?status=` here exposed
    // draft and under-review questions.
    filter.status = "PUBLISHED";

    const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);

    // Answers and explanations are withheld from the question bank listing.
    // This endpoint is open to every authenticated student and previously
    // returned `correctAnswer` and `explanation` for every question , the whole
    // bank's answer key was one request away, and the practice UI could be read
    // straight out of the network tab. Grading already happens server-side in
    // POST /api/practice/answer, which returns the answer and explanation once
    // the student has committed to a choice, so no screen regresses.
    const [questions, total] = await Promise.all([
      Question.find(filter)
        .select("-correctAnswer -explanation")
        .populate("category", "name section")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      questions,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error, "question.getQuestions");
  }
};

export const getQuestion = async (req: AuthRequest, res: Response) => {
  try {
    // Any authenticated user can reach this route, so the answer key is exposed
    // only to staff. A student fetching a question by id used to receive
    // `correctAnswer` directly.
    const isStaff = req.user?.role === "ADMIN" || req.user?.role === "TEACHER";
    const query = Question.findById(req.params.id).populate("category", "name section");
    if (!isStaff) query.select("-correctAnswer -explanation");

    const question = await query.lean();
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });

    res.status(200).json({
      success: true,
      question: isStaff
        ? { ...question, explanation: stripEmojis(question.explanation) }
        : question,
    });
  } catch (error) {
    sendError(res, error, "question.getQuestion");
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { text, options, correctAnswer, explanation, category, difficulty, section, tags, imageUrl } = req.body;
    const question = await Question.create({
      text, options, correctAnswer, explanation: stripEmojis(explanation), category, difficulty, section,
      tags: tags || [],
      imageUrl: imageUrl || null,
      source: "MANUAL",
      status: imageUrl ? "UPDATED" : "PUBLISHED",
      createdBy: req.user?.userId,
    });
    res.status(201).json({ success: true, question });
  } catch (error) {
    sendError(res, error, "question.controller");
  }
};

export const updateQuestion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text, options, correctAnswer, explanation, category, difficulty, section, tags, status, imageUrl } = req.body;
    const existingQuestion = await Question.findById(id);
    if (!existingQuestion) return res.status(404).json({ success: false, error: "Question not found" });
    const previousImageUrl = existingQuestion.imageUrl;

    if (text !== undefined) existingQuestion.text = text;
    if (options !== undefined) existingQuestion.options = options;
    if (correctAnswer !== undefined) existingQuestion.correctAnswer = correctAnswer;
    if (explanation !== undefined) existingQuestion.explanation = stripEmojis(explanation);
    if (category !== undefined) existingQuestion.category = category;
    if (difficulty !== undefined) existingQuestion.difficulty = difficulty;
    if (section !== undefined) existingQuestion.section = section;
    if (tags !== undefined) existingQuestion.tags = tags;
    if (imageUrl !== undefined) existingQuestion.imageUrl = imageUrl;
    if (status !== undefined) {
      existingQuestion.status = (status === "DRAFT" ? "UPLOADED" : status) as any;
    }

    const question = await existingQuestion.save();
    await deleteReplacedManagedImage(previousImageUrl, question.imageUrl);
    res.status(200).json({ success: true, question });
  } catch (error) {
    sendError(res, error, "question.controller");
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });

    const [satTestReferences, diagnosticReferences] = await Promise.all([
      SATTest.countDocuments({ "modules.questions": question._id }),
      DiagnosticTest.countDocuments({ questions: question._id }),
    ]);
    if (satTestReferences > 0 || diagnosticReferences > 0) {
      return res.status(409).json({
        success: false,
        error: `This question is used by ${satTestReferences} SAT test(s) and ${diagnosticReferences} diagnostic test(s). Remove it from those tests first.`,
      });
    }

    await question.deleteOne();
    await deleteManagedImage(question.imageUrl);
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error) {
    sendError(res, error, "question.controller");
  }
};

export const bulkDeleteQuestions = async (req: Request, res: Response) => {
  try {
    if (!Array.isArray(req.body.questionIds) || req.body.questionIds.length === 0) {
      return res.status(400).json({ success: false, error: "Select at least one question." });
    }

    const rawQuestionIds = req.body.questionIds as unknown[];
    const questionIds: string[] = [...new Set(rawQuestionIds.map((id) => String(id)))];
    if (questionIds.length > 500 || questionIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, error: "Invalid question selection." });
    }

    const questions = await Question.find({ _id: { $in: questionIds } }).select("_id imageUrl");
    if (questions.length === 0) {
      return res.status(404).json({ success: false, error: "No selected questions were found." });
    }
    const existingIds = questions.map((question) => question._id);
    const [satTestReferences, diagnosticReferences] = await Promise.all([
      SATTest.countDocuments({ "modules.questions": { $in: existingIds } }),
      DiagnosticTest.countDocuments({ questions: { $in: existingIds } }),
    ]);
    if (satTestReferences > 0 || diagnosticReferences > 0) {
      return res.status(409).json({
        success: false,
        error: `The selection contains questions used by ${satTestReferences} SAT test(s) and ${diagnosticReferences} diagnostic test(s). Remove those test references first.`,
      });
    }

    const result = await Question.deleteMany({ _id: { $in: existingIds } });
    await Promise.allSettled(questions.map((question) => deleteManagedImage(question.imageUrl)));
    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `${result.deletedCount} question(s) deleted.`,
    });
  } catch (error) {
    sendError(res, error, "question.bulkDeleteQuestions");
  }
};

export const bulkCreateQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const { questions } = req.body;
    const docs = questions.map((q: any) => ({
      ...q,
      explanation: stripEmojis(q.explanation),
      source: q.source || "MANUAL",
      status: q.status || "PUBLISHED",
      createdBy: req.user?.userId,
    }));
    const created = await Question.insertMany(docs);
    res.status(201).json({ success: true, count: created.length, questions: created });
  } catch (error) {
    sendError(res, error, "question.controller");
  }
};

export const getAllQuestionsAdmin = async (req: Request, res: Response) => {
  try {
    const { filter } = buildQuestionFilter(req.query as Record<string, unknown>);
    // Admins may legitimately filter by any status, but only by a known value.
    const status = asEnumValue(req.query.status, STATUSES);
    if (status) filter.status = status;

    const { page, limit, skip } = getPagination(req.query as Record<string, unknown>);

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("category", "name section")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      questions: questions.map((question) => ({
        ...question,
        explanation: stripEmojis(question.explanation),
      })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error, "question.getAllQuestionsAdmin");
  }
};
