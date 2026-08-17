import { Request, Response } from "express";
import QuestionCategory from "../models/QuestionCategory";
import Question from "../models/Question";
import { sendError } from "../utils/http";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await QuestionCategory.find().sort({ section: 1, name: 1 });
    res.status(200).json({ success: true, categories });
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
    const { id } = req.params;
    const category = await QuestionCategory.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ success: false, error: "Category not found" });
    await Question.updateMany({ category: id }, { $unset: { category: 1 } });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    sendError(res, error, "category.deleteCategory");
  }
};

