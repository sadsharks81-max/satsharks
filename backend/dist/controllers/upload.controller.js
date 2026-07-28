"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = exports.deleteUpload = exports.publishUpload = exports.reviewUpload = exports.triggerExtraction = exports.getUpload = exports.getUploads = exports.uploadPracticeQuestions = exports.uploadPracticeTest = void 0;
const PracticeTestUpload_1 = __importDefault(require("../models/PracticeTestUpload"));
const Question_1 = __importDefault(require("../models/Question"));
const QuestionCategory_1 = __importDefault(require("../models/QuestionCategory"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = require("pdf-parse");
const text_1 = require("../utils/text");
const parseQuestionDocument = (text) => {
    const normalized = text.replace(/\r/g, "").replace(/\u00a0/g, " ");
    const starts = [...normalized.matchAll(/(?:^|\n)\s*(?:Question\s*)?(\d{1,4})[\.\)]\s+/gi)];
    return starts.flatMap((entry, index) => {
        const block = normalized.slice(entry.index || 0, starts[index + 1]?.index || normalized.length).trim();
        const options = [...block.matchAll(/(?:^|\n)\s*([A-D])[\.\)]\s+([\s\S]*?)(?=(?:\n\s*[A-D][\.\)]\s+)|(?:\n\s*(?:Answer|Correct Answer)\s*:)|$)/g)];
        if (options.length < 2 || options[0].index === undefined)
            return [];
        const question = block.slice(0, options[0].index).replace(/^(?:Question\s*)?\d{1,4}[\.\)]\s*/i, "").trim();
        const answer = block.match(/(?:Answer|Correct Answer)\s*:\s*([A-D])/i)?.[1]?.toUpperCase() || "";
        if (!question)
            return [];
        return [{
                text: question,
                options: options.slice(0, 4).map((item) => ({ label: item[1], text: item[2].trim() })),
                correctAnswer: answer,
                explanation: (0, text_1.stripEmojis)(block.match(/(?:Explanation|Rationale)\s*:\s*([\s\S]+)$/i)?.[1]?.trim() || ""),
                category: "SAT Math",
                difficulty: "MEDIUM",
                confidence: answer ? 0.9 : 0.65,
                approved: false,
            }];
    });
};
const UPLOAD_DIR = path_1.default.resolve(__dirname, "../../uploads");
if (!fs_1.default.existsSync(UPLOAD_DIR))
    fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
const uploadPracticeTest = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title)
            return res.status(400).json({ success: false, error: "Title is required" });
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, error: "PDF file is required" });
        const upload = await PracticeTestUpload_1.default.create({
            title,
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadType: "FULL_TEST",
            uploadedBy: req.user?.userId,
        });
        res.status(201).json({ success: true, upload });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.uploadPracticeTest = uploadPracticeTest;
const uploadPracticeQuestions = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title)
            return res.status(400).json({ success: false, error: "Title is required" });
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, error: "PDF file is required" });
        const upload = await PracticeTestUpload_1.default.create({
            title,
            fileName: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            fileSize: file.size,
            mimeType: file.mimetype,
            uploadType: "PRACTICE_QUESTIONS",
            uploadedBy: req.user?.userId,
        });
        res.status(201).json({ success: true, upload });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.uploadPracticeQuestions = uploadPracticeQuestions;
const getUploads = async (req, res) => {
    try {
        const uploads = await PracticeTestUpload_1.default.find()
            .populate("uploadedBy", "name email")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, uploads });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getUploads = getUploads;
const getUpload = async (req, res) => {
    try {
        const upload = await PracticeTestUpload_1.default.findById(req.params.id)
            .populate("uploadedBy", "name email")
            .populate("reviewedBy", "name email");
        if (!upload)
            return res.status(404).json({ success: false, error: "Upload not found" });
        res.status(200).json({ success: true, upload });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getUpload = getUpload;
const triggerExtraction = async (req, res) => {
    try {
        const upload = await PracticeTestUpload_1.default.findById(req.params.id);
        if (!upload)
            return res.status(404).json({ success: false, error: "Upload not found" });
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
        const filePath = path_1.default.resolve(__dirname, "../../", upload.fileUrl.replace(/^\//, ""));
        const parser = new pdf_parse_1.PDFParse({ data: fs_1.default.readFileSync(filePath) });
        const parsed = await parser.getText();
        await parser.destroy();
        const extractedQuestions = parseQuestionDocument(parsed.text);
        if (!extractedQuestions.length) {
            upload.status = "FAILED";
            upload.errorMessage = "No questions were recognized. Use numbered questions, A to D options, and an Answer line.";
            await upload.save();
            return res.status(422).json({ success: false, error: upload.errorMessage, upload });
        }
        upload.extractedQuestions = extractedQuestions;
        upload.status = "EXTRACTED";
        await upload.save();
        res.status(200).json({ success: true, upload });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.triggerExtraction = triggerExtraction;
const reviewUpload = async (req, res) => {
    try {
        const { extractedQuestions, reviewNotes } = req.body;
        const upload = await PracticeTestUpload_1.default.findById(req.params.id);
        if (!upload)
            return res.status(404).json({ success: false, error: "Upload not found" });
        upload.extractedQuestions = extractedQuestions;
        upload.reviewNotes = reviewNotes || "";
        upload.reviewedBy = req.user?.userId;
        upload.status = "REVIEWED";
        await upload.save();
        res.status(200).json({ success: true, upload });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.reviewUpload = reviewUpload;
const publishUpload = async (req, res) => {
    try {
        const upload = await PracticeTestUpload_1.default.findById(req.params.id);
        if (!upload)
            return res.status(404).json({ success: false, error: "Upload not found" });
        const approved = upload.extractedQuestions.filter((q) => q.approved);
        if (approved.length === 0) {
            return res.status(400).json({ success: false, error: "No approved questions to publish" });
        }
        const categories = await QuestionCategory_1.default.find();
        const categoryMap = new Map(categories.map((c) => [c.name.toLowerCase(), c._id]));
        const questions = approved.map((q) => ({
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: (0, text_1.stripEmojis)(q.explanation),
            category: categoryMap.get(q.category.toLowerCase()) || categories[0]?._id,
            difficulty: q.difficulty || "MEDIUM",
            section: "MATH",
            source: "AI_EXTRACTED",
            status: "PUBLISHED",
            createdBy: req.user?.userId,
        }));
        await Question_1.default.insertMany(questions);
        upload.status = "PUBLISHED";
        await upload.save();
        res.status(200).json({ success: true, publishedCount: questions.length });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.publishUpload = publishUpload;
const deleteUpload = async (req, res) => {
    try {
        const upload = await PracticeTestUpload_1.default.findByIdAndDelete(req.params.id);
        if (!upload)
            return res.status(404).json({ success: false, error: "Upload not found" });
        res.status(200).json({ success: true, message: "Upload deleted" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteUpload = deleteUpload;
const cloudinary_1 = require("cloudinary");
// Configure Cloudinary only if variables are set
const isCloudinaryConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET);
if (isCloudinaryConfigured) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}
// --- Generic Image Upload ---
const uploadImage = async (req, res) => {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).json({ success: false, error: "Image file is required" });
        if (isCloudinaryConfigured) {
            // Upload directly to Cloudinary from memory buffer
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: "sat-sharks" }, (error, result) => {
                if (error) {
                    return res.status(500).json({ success: false, error: "Cloudinary upload failed: " + error.message });
                }
                return res.status(201).json({
                    success: true,
                    url: result?.secure_url
                });
            });
            uploadStream.end(file.buffer);
        }
        else {
            // Fallback: Convert to Base64 Data URL and store directly in DB
            const base64Data = file.buffer.toString("base64");
            const dataUrl = `data:${file.mimetype};base64,${base64Data}`;
            return res.status(201).json({
                success: true,
                url: dataUrl
            });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.uploadImage = uploadImage;
