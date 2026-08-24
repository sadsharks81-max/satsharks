import { Request, Response } from "express";
import mongoose from "mongoose";
import QuestionCategory from "../models/QuestionCategory";
import Question from "../models/Question";
import DiagnosticTest from "../models/DiagnosticTest";
import SATTest from "../models/SATTest";
import { deleteManagedImage } from "../utils/managed-image";
import { sendError } from "../utils/http";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const [categories, questionCounts] = await Promise.all([
      QuestionCategory.find().sort({ section: 1, name: 1 }).lean(),
      Question.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
    ]);
    const countByCategory = new Map(
      questionCounts.map((item) => [String(item._id), item.count as number]),
    );
    res.status(200).json({
      success: true,
      categories: categories.map((category) => ({
        ...category,
        questionCount: countByCategory.get(String(category._id)) || 0,
      })),
    });
  } catch (error) {
    sendError(res, error, "category.getCategories");
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, section, description } = req.body;
    const existing = await QuestionCategory.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, error: "Category already exists" });
    }
    const category = await QuestionCategory.create({ name, section, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    sendError(res, error, "category.createCategory");
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, section, description } = req.body;
    const category = await QuestionCategory.findByIdAndUpdate(
      id,
      { name, section, description },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    res.status(200).json({ success: true, category });
  } catch (error) {
    sendError(res, error, "category.updateCategory");
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid category." });
    }

    const category = await QuestionCategory.findById(id);
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    const questions = await Question.find({ category: id }).select("_id imageUrl");
    const questionIds = questions.map((question) => question._id);
    if (questionIds.length > 0) {
      const [satTestReferences, diagnosticReferences] = await Promise.all([
        SATTest.countDocuments({ "modules.questions": { $in: questionIds } }),
        DiagnosticTest.countDocuments({ questions: { $in: questionIds } }),
      ]);
      if (satTestReferences > 0 || diagnosticReferences > 0) {
        return res.status(409).json({
          success: false,
          error: `This category contains questions used by ${satTestReferences} SAT test(s) and ${diagnosticReferences} diagnostic test(s). Remove those references first.`,
        });
      }
    }

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await Question.deleteMany({ category: id }, { session });
        const deleted = await QuestionCategory.deleteOne({ _id: id }, { session });
        if (deleted.deletedCount !== 1) throw new Error("Category disappeared during deletion.");
      });
    } finally {
      await session.endSession();
    }

    await Promise.allSettled(questions.map((question) => deleteManagedImage(question.imageUrl)));
    res.status(200).json({
      success: true,
      deletedQuestionCount: questions.length,
      message: `Category and ${questions.length} question(s) deleted.`,
    });
  } catch (error) {
    sendError(res, error, "category.deleteCategory");
  }
};

