import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import PracticeTestUpload from "../models/PracticeTestUpload";
import type { IExtractedQuestion } from "../models/PracticeTestUpload";
import Question from "../models/Question";
import QuestionCategory from "../models/QuestionCategory";
import { AuthRequest } from "../middleware/auth.middleware";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";
import { PDFParse } from "pdf-parse";
import { stripEmojis } from "../utils/text";
import { sendError } from "../utils/http";
import { getPagination } from "../utils/query";
import { parsePracticeQuestionDocument } from "../utils/practice-question-parser";

const OPTION_LABELS = ["A", "B", "C", "D"] as const;
const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
const SECTIONS = ["READING_WRITING", "MATH"] as const;

/**
 * Normalises one client-supplied extracted question. Admin input is still input:
 * the previous code assigned req.body straight onto the document, so a malformed
 * or oversized payload was persisted and later published into the live question
 * bank unchecked.
 */
const sanitizeExtractedQuestion = (raw: unknown) => {
  const item = (raw ?? {}) as Record<string, unknown>;
  const asText = (value: unknown, max: number) =>
    typeof value === "string" ? value.slice(0, max) : "";

  return {
    text: asText(item.text, 10000),
    options: Array.isArray(item.options)
      ? item.options.slice(0, 4).map((option) => {
          const entry = (option ?? {}) as Record<string, unknown>;
          return { label: asText(entry.label, 4), text: asText(entry.text, 4000) };
        })
      : [],
    correctAnswer: OPTION_LABELS.includes(item.correctAnswer as (typeof OPTION_LABELS)[number])
      ? (item.correctAnswer as string)
      : "",
    explanation: stripEmojis(asText(item.explanation, 10000)),
    category: asText(item.category, 200),
    difficulty: DIFFICULTIES.includes(item.difficulty as (typeof DIFFICULTIES)[number])
      ? (item.difficulty as string)
      : "MEDIUM",
    section: SECTIONS.includes(item.section as (typeof SECTIONS)[number])
      ? (item.section as "READING_WRITING" | "MATH")
      : "MATH",
    confidence: typeof item.confidence === "number" && Number.isFinite(item.confidence)
      ? Math.min(1, Math.max(0, item.confidence))
      : 0,
    approved: item.approved === true,
  };
};

const parseQuestionDocument = (text: string) => {
  const normalized = text.replace(/\r/g, "").replace(/\u00a0/g, " ");
  const starts = [...normalized.matchAll(/(?:^|\n)\s*(?:Question\s*)?(\d{1,4})[.)]\s+/gi)];
  return starts.flatMap((entry, index) => {
    const block = normalized.slice(entry.index || 0, starts[index + 1]?.index || normalized.length).trim();
    const options = [...block.matchAll(/(?:^|\n)\s*([A-D])[.)]\s+([\s\S]*?)(?=(?:\n\s*[A-D][.)]\s+)|(?:\n\s*(?:Answer|Correct Answer)\s*:)|$)/g)];
    if (options.length < 2 || options[0].index === undefined) return [];
    const question = block.slice(0, options[0].index).replace(/^(?:Question\s*)?\d{1,4}[.)]\s*/i, "").trim();
    const answer = block.match(/(?:Answer|Correct Answer)\s*:\s*([A-D])/i)?.[1]?.toUpperCase() || "";
    if (!question) return [];
    return [{
      text: question,
      options: options.slice(0, 4).map((item) => ({ label: item[1], text: item[2].trim() })),
      correctAnswer: answer,
      explanation: stripEmojis(block.match(/(?:Explanation|Rationale)\s*:\s*([\s\S]+)$/i)?.[1]?.trim() || ""),
      category: "SAT Math",
      difficulty: "MEDIUM",
      section: "MATH" as const,
      confidence: answer ? 0.9 : 0.65,
      approved: false,
    }];
  });
};

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
      uploadType: "FULL_TEST",
      uploadedBy: req.user?.userId,
    });

    res.status(201).json({ success: true, upload });
  } catch (error) {
    sendError(res, error, "upload.uploadPracticeTest");
  }
};

export const uploadPracticeQuestions = async (req: AuthRequest, res: Response) => {
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
      uploadType: "PRACTICE_QUESTIONS",
      uploadedBy: req.user?.userId,
    });
    res.status(201).json({ success: true, upload });
  } catch (error) {
    sendError(res, error, "upload.uploadPracticeQuestions");
  }
};

export const getUploads = async (req: Request, res: Response) => {
  try {
    // Bounded rather than truly paginated: the admin list has no pager UI, so the
    // default is set high enough to preserve today's behaviour while removing the
    // unbounded full-collection scan. `extractedQuestions` stays in the payload
    // because the list column renders its length.
    const { page, limit, skip } = getPagination(req.query, 200, 500);
    const [uploads, total] = await Promise.all([
      PracticeTestUpload.find()
        .populate("uploadedBy", "name email")
        .populate("reviewedBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PracticeTestUpload.countDocuments(),
    ]);
    res.status(200).json({
      success: true,
      uploads,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error, "upload.getUploads");
  }
};

export const getUpload = async (req: Request, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id)
      .populate("uploadedBy", "name email")
      .populate("reviewedBy", "name email");
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });
    res.status(200).json({ success: true, upload });
  } catch (error) {
    sendError(res, error, "upload.getUpload");
  }
};

export const triggerExtraction = async (req: AuthRequest, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });

    upload.status = "PROCESSING";
    await upload.save();

    // Resolve strictly inside the uploads directory. fileUrl is written by this
    // service, but confining it here means a bad/legacy DB value can never make
    // the parser read an arbitrary path.
    const filePath = path.resolve(UPLOAD_DIR, path.basename(upload.fileUrl));
    if (path.dirname(filePath) !== UPLOAD_DIR) {
      return res.status(400).json({ success: false, error: "Invalid upload path" });
    }

    // Async read: readFileSync on a file up to the 50MB multer limit blocks the
    // single Node event loop, stalling every other in-flight request.
    let parsedText: string;
    const parser = new PDFParse({ data: await fsp.readFile(filePath) });
    try {
      parsedText = (await parser.getText()).text;
    } finally {
      // Runs even when getText() throws, so the parser's buffers are always freed.
      await parser.destroy();
    }
    let extractedQuestions: IExtractedQuestion[];
    let extractionErrors: string[] = [];

    if (upload.uploadType === "PRACTICE_QUESTIONS") {
      const parsed = parsePracticeQuestionDocument(parsedText);
      extractionErrors = parsed.errors;

      if (extractionErrors.length === 0) {
        const categories = await QuestionCategory.find()
          .select("name section")
          .lean<Array<{ name: string; section: "READING_WRITING" | "MATH" }>>();
        const categoryMap = new Map(categories.map((category) => [category.name.toLowerCase(), category]));

        extractedQuestions = parsed.questions.flatMap((question) => {
          const category = categoryMap.get(question.category.toLowerCase());
          if (!category) {
            extractionErrors.push(
              `Question ${question.questionNumber}: CATEGORY "${question.category}" does not exist in the question bank.`,
            );
            return [];
          }
          if (category.section !== question.section) {
            extractionErrors.push(
              `Question ${question.questionNumber}: CATEGORY "${category.name}" belongs to ${category.section}, not ${question.section}.`,
            );
            return [];
          }

          const { questionNumber: _questionNumber, ...extracted } = question;
          return [{ ...extracted, category: category.name }];
        });
      } else {
        extractedQuestions = [];
      }
    } else {
      extractedQuestions = parseQuestionDocument(parsedText);
    }

    if (extractionErrors.length > 0) {
      upload.status = "FAILED";
      upload.errorMessage = [
        "The practice-question PDF does not match the required format:",
        ...extractionErrors.slice(0, 12).map((message) => `• ${message}`),
        ...(extractionErrors.length > 12 ? [`• ${extractionErrors.length - 12} more error(s).`] : []),
      ].join("\n");
      await upload.save();
      return res.status(422).json({ success: false, error: upload.errorMessage, upload });
    }

    if (!extractedQuestions.length) {
      upload.status = "FAILED";
      upload.errorMessage = upload.uploadType === "PRACTICE_QUESTIONS"
        ? "No questions were recognized. Follow the practice-question PDF template exactly."
        : "No questions were recognized. Use numbered questions, A to D options, and an Answer line.";
      await upload.save();
      return res.status(422).json({ success: false, error: upload.errorMessage, upload });
    }
    upload.extractedQuestions = extractedQuestions;
    upload.errorMessage = "";
    upload.status = "EXTRACTED";
    await upload.save();

    res.status(200).json({ success: true, upload });
  } catch (error) {
    // Record the failure on the document so the admin UI shows a terminal state
    // instead of leaving the upload stuck in PROCESSING forever.
    try {
      await PracticeTestUpload.updateOne(
        { _id: req.params.id, status: "PROCESSING" },
        { $set: { status: "FAILED", errorMessage: "Extraction failed. Please try again." } },
      );
    } catch (updateError) {
      console.error("[error] upload.triggerExtraction status rollback:", updateError);
    }
    sendError(res, error, "upload.triggerExtraction");
  }
};

export const reviewUpload = async (req: AuthRequest, res: Response) => {
  try {
    const { extractedQuestions, reviewNotes } = req.body;
    // The review payload is written verbatim into the document, so validate its
    // shape rather than trusting the client to send well-formed questions.
    if (!Array.isArray(extractedQuestions)) {
      return res
        .status(400)
        .json({ success: false, error: "extractedQuestions must be an array" });
    }

    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });
    if (upload.status === "PUBLISHED") {
      return res.status(409).json({ success: false, error: "Published uploads cannot be edited." });
    }

    upload.extractedQuestions = extractedQuestions.map(sanitizeExtractedQuestion);
    upload.reviewNotes = typeof reviewNotes === "string" ? reviewNotes : "";
    // authenticate() guarantees req.user, but the field is typed as optional;
    // assigning undefined here would silently clear an existing reviewer.
    if (req.user?.userId) {
      upload.reviewedBy = new mongoose.Types.ObjectId(req.user.userId);
    }
    upload.status = "REVIEWED";
    await upload.save();

    res.status(200).json({ success: true, upload });
  } catch (error) {
    sendError(res, error, "upload.reviewUpload");
  }
};

export const publishUpload = async (req: AuthRequest, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findById(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });
    if (upload.status === "PUBLISHED") {
      return res.status(409).json({ success: false, error: "This upload has already been published." });
    }

    const approved = upload.extractedQuestions.filter((q) => q.approved);
    if (approved.length === 0) {
      return res.status(400).json({ success: false, error: "No approved questions to publish" });
    }

    const categories = await QuestionCategory.find().select("name section").lean<
      Array<{ _id: mongoose.Types.ObjectId; name: string; section: "READING_WRITING" | "MATH" }>
    >();
    const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c]));

    // `category` is required on Question, so with no categories at all every
    // insert would fail mid-batch. Fail fast with a message the admin can act on.
    if (categories.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Create at least one question category before publishing.",
      });
    }

    const validationErrors: string[] = [];
    const questions = approved.flatMap((q, index) => {
      const label = `Approved question ${index + 1}`;
      const category = categoryMap.get(q.category.trim().toLowerCase());
      if (!q.text.trim()) validationErrors.push(`${label}: question text is required.`);
      if (
        q.options.length !== 4 ||
        q.options.some((option, optionIndex) => option.label !== OPTION_LABELS[optionIndex] || !option.text.trim())
      ) {
        validationErrors.push(`${label}: four non-empty options labelled A, B, C, and D are required.`);
      }
      if (!OPTION_LABELS.includes(q.correctAnswer as (typeof OPTION_LABELS)[number])) {
        validationErrors.push(`${label}: correct answer must be A, B, C, or D.`);
      }
      if (!DIFFICULTIES.includes(q.difficulty as (typeof DIFFICULTIES)[number])) {
        validationErrors.push(`${label}: difficulty must be EASY, MEDIUM, or HARD.`);
      }
      if (!SECTIONS.includes(q.section as (typeof SECTIONS)[number])) {
        validationErrors.push(`${label}: section must be READING_WRITING or MATH.`);
      }
      if (!category) {
        validationErrors.push(`${label}: category "${q.category}" does not exist.`);
      } else if (category.section !== q.section) {
        validationErrors.push(`${label}: category "${category.name}" does not belong to ${q.section}.`);
      }

      if (validationErrors.some((error) => error.startsWith(`${label}:`)) || !category) return [];

      return [{
        text: q.text.trim(),
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: stripEmojis(q.explanation),
        category: category._id,
        difficulty: q.difficulty,
        section: q.section,
        tags: upload.uploadType === "PRACTICE_QUESTIONS" ? ["practice-question"] : [],
        source: "AI_EXTRACTED" as const,
        status: "PUBLISHED" as const,
        createdBy: req.user?.userId,
      }];
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Fix the review before publishing:\n${validationErrors.join("\n")}`,
      });
    }

    await Question.insertMany(questions);

    upload.status = "PUBLISHED";
    await upload.save();

    res.status(200).json({ success: true, publishedCount: questions.length });
  } catch (error) {
    sendError(res, error, "upload.publishUpload");
  }
};

export const deleteUpload = async (req: Request, res: Response) => {
  try {
    const upload = await PracticeTestUpload.findByIdAndDelete(req.params.id);
    if (!upload) return res.status(404).json({ success: false, error: "Upload not found" });

    // Deleting only the database row left the PDF on disk forever, so the uploads
    // volume grew without bound. Best-effort: a missing file must not fail the
    // request, since the record is already gone.
    if (upload.fileUrl) {
      const filePath = path.resolve(UPLOAD_DIR, path.basename(upload.fileUrl));
      if (path.dirname(filePath) === UPLOAD_DIR) {
        await fsp.unlink(filePath).catch((error: NodeJS.ErrnoException) => {
          if (error.code !== "ENOENT") {
            console.error("[error] upload.deleteUpload orphaned file:", error);
          }
        });
      }
    }

    res.status(200).json({ success: true, message: "Upload deleted" });
  } catch (error) {
    sendError(res, error, "upload.deleteUpload");
  }
};

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary only if variables are set
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

const SITE_IMAGE_BUCKET = "siteImages";

const getSiteImageBucket = () => {
  if (!mongoose.connection.db) return null;
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: SITE_IMAGE_BUCKET,
  });
};

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
      const bucket = getSiteImageBucket();
      if (bucket) {
        // Railway's local filesystem is ephemeral, while embedding base64 in a
        // success-story/question document makes every JSON response enormous.
        // GridFS keeps the binary persistent and independently cacheable.
        const imageId = new mongoose.Types.ObjectId();
        const uploadStream = bucket.openUploadStreamWithId(imageId, file.originalname, {
          contentType: file.mimetype,
          metadata: { uploadedBy: req.user?.userId },
        });
        await new Promise<void>((resolve, reject) => {
          uploadStream.once("finish", resolve);
          uploadStream.once("error", reject);
          uploadStream.end(file.buffer);
        });
        return res.status(201).json({
          success: true,
          url: `/media/images/${imageId}`,
        });
      }

      // Preserve standalone mock development when no database is connected.
      const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
      return res.status(201).json({
        success: true,
        url: dataUrl
      });
    }
  } catch (error) {
    sendError(res, error, "upload.uploadImage");
  }
};

export const streamUploadedImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageIdParam = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!mongoose.isValidObjectId(imageIdParam)) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }

    const bucket = getSiteImageBucket();
    if (!bucket) {
      return res.status(503).json({ success: false, error: "Image storage unavailable" });
    }

    const imageId = new mongoose.Types.ObjectId(imageIdParam);
    const storedFile = await bucket.find({ _id: imageId }).next();
    if (!storedFile) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }

    res.setHeader("Content-Type", storedFile.contentType || "application/octet-stream");
    res.setHeader("Content-Length", storedFile.length.toString());
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("X-Content-Type-Options", "nosniff");

    const download = bucket.openDownloadStream(imageId);
    download.once("error", next);
    return download.pipe(res);
  } catch (error) {
    return next(error);
  }
};
