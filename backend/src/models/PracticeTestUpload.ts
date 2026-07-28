import mongoose, { Schema, Document } from "mongoose";

export interface IExtractedQuestion {
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: string;
  confidence: number;
  approved: boolean;
}

export interface IPracticeTestUpload extends Document {
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: mongoose.Types.ObjectId;
  status: "UPLOADED" | "PROCESSING" | "EXTRACTED" | "REVIEWED" | "PUBLISHED" | "FAILED";
  extractedQuestions: IExtractedQuestion[];
  reviewNotes: string;
  reviewedBy: mongoose.Types.ObjectId | null;
  errorMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeTestUploadSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "EXTRACTED", "REVIEWED", "PUBLISHED", "FAILED"],
      default: "UPLOADED",
    },
    extractedQuestions: [
      {
        text: String,
        options: [{ label: String, text: String }],
        correctAnswer: String,
        explanation: String,
        category: String,
        difficulty: String,
        confidence: { type: Number, default: 0 },
        approved: { type: Boolean, default: false },
      },
    ],
    reviewNotes: { type: String, default: "" },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    errorMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

PracticeTestUploadSchema.index({ status: 1 });
PracticeTestUploadSchema.index({ uploadedBy: 1 });

export default mongoose.model<IPracticeTestUpload>("PracticeTestUpload", PracticeTestUploadSchema);
