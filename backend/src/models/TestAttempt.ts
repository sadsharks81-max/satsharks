import mongoose, { Schema, Document } from "mongoose";

export interface IAttemptAnswer {
  question: mongoose.Types.ObjectId;
  selectedAnswer: string | null;
  isCorrect: boolean;
  timeSpent: number;
}

export interface ITestAttempt extends Document {
  student: mongoose.Types.ObjectId;
  test: mongoose.Types.ObjectId;
  answers: IAttemptAnswer[];
  score: number;
  totalQuestions: number;
  correctCount: number;
  percentage: number;
  timeTaken: number;
  status: "IN_PROGRESS" | "COMPLETED" | "ABANDONED";
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const TestAttemptSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    test: { type: Schema.Types.ObjectId, ref: "DiagnosticTest", required: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: "Question" },
        selectedAnswer: { type: String, default: null },
        isCorrect: { type: Boolean, default: false },
        timeSpent: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED", "ABANDONED"],
      default: "IN_PROGRESS",
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

TestAttemptSchema.index({ student: 1, createdAt: -1 });
TestAttemptSchema.index({ student: 1, test: 1 });

export default mongoose.model<ITestAttempt>("TestAttempt", TestAttemptSchema);
