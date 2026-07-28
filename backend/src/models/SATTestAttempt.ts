import mongoose, { Schema, Document } from "mongoose";

export interface ISATModuleAttempt {
  moduleIndex: number;
  answers: {
    question: mongoose.Types.ObjectId;
    selectedAnswer: string | null;
    isCorrect: boolean;
    markedForReview: boolean;
    timeSpent: number;
  }[];
  startedAt: Date | null;
  completedAt: Date | null;
  score: number;
  totalQuestions: number;
  correctCount: number;
}

export interface ISATTestAttempt extends Document {
  student: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  moduleAttempts: ISATModuleAttempt[];
  currentModuleIndex: number;
  breakStartedAt: Date | null;
  breakCompletedAt: Date | null;
  totalScore: number;
  totalQuestions: number;
  totalCorrect: number;
  percentage: number;
  totalTimeTaken: number;
  status: "IN_PROGRESS" | "ON_BREAK" | "COMPLETED" | "ABANDONED" | "TIMED_OUT";
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SATModuleAttemptSchema = new Schema(
  {
    moduleIndex: { type: Number, required: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedAnswer: { type: String, default: null },
        isCorrect: { type: Boolean, default: false },
        markedForReview: { type: Boolean, default: false },
        timeSpent: { type: Number, default: 0 },
      },
    ],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
  },
  { _id: false }
);

const SATTestAttemptSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: Schema.Types.ObjectId, ref: "SATTest", required: true },
    moduleAttempts: { type: [SATModuleAttemptSchema], default: [] },
    currentModuleIndex: { type: Number, default: 0 },
    breakStartedAt: { type: Date, default: null },
    breakCompletedAt: { type: Date, default: null },
    totalScore: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    totalTimeTaken: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "ON_BREAK", "COMPLETED", "ABANDONED", "TIMED_OUT"],
      default: "IN_PROGRESS",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

SATTestAttemptSchema.index({ student: 1, createdAt: -1 });
SATTestAttemptSchema.index({ student: 1, test: 1 });

export default mongoose.model<ISATTestAttempt>("SATTestAttempt", SATTestAttemptSchema);
