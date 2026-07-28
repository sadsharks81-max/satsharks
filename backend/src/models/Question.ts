import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionOption {
  label: string;
  text: string;
}

export interface IQuestion extends Document {
  text: string;
  options: IQuestionOption[];
  correctAnswer: string;
  explanation: string;
  category: mongoose.Types.ObjectId;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  section: "READING_WRITING" | "MATH";
  tags: string[];
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
  imageUrl?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema(
  {
    text: { type: String, required: true },
    options: [
      {
        label: { type: String },
        text: { type: String },
      },
    ],
    correctAnswer: {
      type: String,
      required: true,
    },
    explanation: { type: String, default: "" },
    category: {
      type: Schema.Types.ObjectId,
      ref: "QuestionCategory",
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      required: true,
    },
    section: {
      type: String,
      enum: ["READING_WRITING", "MATH"],
      required: true,
    },
    tags: [{ type: String }],
    source: {
      type: String,
      enum: ["MANUAL", "AI_EXTRACTED", "SAT"],
      default: "MANUAL",
    },
    status: {
      type: String,
      enum: ["DRAFT", "REVIEW", "PUBLISHED"],
      default: "DRAFT",
    },
    imageUrl: { type: String, default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

QuestionSchema.index({ category: 1, difficulty: 1 });
QuestionSchema.index({ section: 1, status: 1 });
QuestionSchema.index({ tags: 1 });

export default mongoose.model<IQuestion>("Question", QuestionSchema);
