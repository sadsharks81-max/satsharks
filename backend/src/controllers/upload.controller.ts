import { Request, Response } from "express";
import PracticeTestUpload from "../models/PracticeTestUpload";
import Question from "../models/Question";
import QuestionCategory from "../models/QuestionCategory";
import { AuthRequest } from "../middleware/auth.middleware";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const uploadPracticeTest = async (req: AuthRequest, res: Response) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ success: false, error: "Title is required" });

    const file = (req as any).file;
    if (!file) return res.status(400).json({ success: false, error: "PDF file is required" });

    const upload = await PracticeTestUpload.create({
      title,
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedBy: req.user?.userId,
    });

    res.status(201).json({ success: true, upload });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUploads = async (req: Request, res: Response) => {
  try {
    const uploads = await PracticeTestUpload.find()
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, uploads });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getUpload = async (req: Request, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id)
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email");
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });
    res.status(200).json({ success: true, upload });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const triggerExtraction = async (req: AuthRequest, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });

    upload.status = "PROCESSING";
    await upload.save();

    // Simulated extraction , replace with real PDF parsing + AI in production
    const sampleExtracted = [
      {
        text: "Sample extracted question from the uploaded PDF. What is the value of x if 2x + 5 = 15?",
        options: [
          { label: "A", text: "3" },
          { label: "B", text: "5" },
          { label: "C", text: "7" },
          { label: "D", text: "10" },
        ],
        correctAnswer: "B",
        explanation: "2x + 5 = 15 → 2x = 10 → x = 5",
        category: "Algebra",
        difficulty: "EASY",
        confidence: 0.92,
        approved: false,
      },
    ];

    upload.extractedQuestions = sampleExtracted;
    upload.status = "EXTRACTED";
    await upload.save();

    res.status(200).json({ success: true, upload });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const reviewUpload = async (req: AuthRequest, res: Response) => {
  try {
    const { extractedQuestions, reviewNotes } = req.body;
    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });

    upload.extractedQuestions = extractedQuestions;
    upload.reviewNotes = reviewNotes || "";
    upload.reviewedBy = req.user?.userId;
    upload.status = "REVIEWED";
    await upload.save();

    res.status(200).json({ success: true, upload });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const publishUpload = async (req: AuthRequest, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });

    const approved = upload.extractedQuestions.filter((q) => q.approved);
    if (approved.length === 0) {
      return res.status(400).json({ success: false, error: "No approved questions to publish" });
    }

    const categories = await QuestionCategory.find();
    const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));

    const questions = approved.map((q) => ({
      text: q.text,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      category: categoryMap.get(q.category.toLowerCase()) || categories[0]?._id,
      difficulty: q.difficulty || "MEDIUM",
      section: "MATH" as const,
      source: "AI_EXTRACTED" as const,
      status: "PUBLISHED" as const,
      createdBy: req.user?.userId,
    }));

    await Question.insertMany(questions);

    upload.status = "PUBLISHED";
    await upload.save();

    res.status(200).json({ success: true, publishedCount: questions.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteUpload = async (req: Request, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findByIdAndDelete(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });
    res.status(200).json({ success: true, message: "Upload deleted" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary only if variables are set
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// --- Generic Image Upload ---
export const uploadImage = async (req: AuthRequest, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ success: false, error: "Image file is required" });

    if (isCloudinaryConfigured) {
      // Upload directly to Cloudinary from memory buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "sat-sharks" },
        (error, result) => {
          if (error) {
            return res.status(500).json({ success: false, error: "Cloudinary upload failed: " + error.message });
          }
          return res.status(201).json({
            success: true,
            url: result?.secure_url
          });
        }
      );
      uploadStream.end(file.buffer);
    } else {
      // Fallback: Convert to Base64 Data URL and store directly in DB
      const base64Data = file.buffer.toString("base64");
      const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
      return res.status(201).json({
        success: true,
        url: dataUrl
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
