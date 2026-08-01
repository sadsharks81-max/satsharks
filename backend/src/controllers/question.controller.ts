import { Request, Response } from "express";
import Question from "../models/Question";
import { AuthRequest } from "../middleware/auth.middleware";
import { stripEmojis } from "../utils/text";
import { deleteManagedImage, deleteReplacedManagedImage } from "../utils/managed-image";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, section, status, search, excludeCategories, page = "1", limit = "20" } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (!category && excludeCategories) {
      const excluded = String(excludeCategories).split(",").filter(Boolean);
      if (excluded.length > 0) filter.category = { $nin: excluded };
    }
    if (difficulty) filter.difficulty = difficulty;
    if (section) filter.section = section;
    if (status) filter.status = status;
    else filter.status = "PUBLISHED";
    if (search) filter.text = { $regex: search, $options: "i" };

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("category", "name section")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      questions: questions.map((question) => ({
        ...question.toObject(),
        explanation: stripEmojis(question.explanation),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params.id).populate("category", "name section");
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });
    res.status(200).json({
      success: true,
      question: { ...question.toObject(), explanation: stripEmojis(question.explanation) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });
    await deleteManagedImage(question.imageUrl);
    res.status(200).json({ success: true, message: "Question deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllQuestionsAdmin = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, section, status, search, page = "1", limit = "20" } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (section) filter.section = section;
    if (status) filter.status = status;
    if (search) filter.text = { $regex: search, $options: "i" };

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)));
    const skip = (pageNum - 1) * limitNum;

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("category", "name section")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      questions: questions.map((question) => ({
        ...question.toObject(),
        explanation: stripEmojis(question.explanation),
      })),
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
