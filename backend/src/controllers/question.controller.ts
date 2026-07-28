import { Request, Response } from "express";
import Question from "../models/Question";
import { AuthRequest } from "../middleware/auth.middleware";

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { category, difficulty, section, status, search, page = "1", limit = "20" } = req.query;
    const filter: any = {};

    if (category) filter.category = category;
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
      questions,
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
    res.status(200).json({ success: true, question });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { text, options, correctAnswer, explanation, category, difficulty, section, tags, imageUrl } = req.body;
    const question = await Question.create({
      text, options, correctAnswer, explanation, category, difficulty, section,
      tags: tags || [],
      imageUrl: imageUrl || null,
      source: "MANUAL",
      status: "PUBLISHED",
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
    const question = await Question.findByIdAndUpdate(
      id,
      { text, options, correctAnswer, explanation, category, difficulty, section, tags, status, imageUrl },
      { new: true, runValidators: true }
    );
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });
    res.status(200).json({ success: true, question });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteQuestion = async (req: Request, res: Response) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ success: false, error: "Question not found" });
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
      questions,
      pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
