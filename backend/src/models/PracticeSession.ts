import mongoose, { Schema, Document } from "mongoose";

export interface IPracticeSession extends Document {
  student: mongoose.Types.ObjectId;
  question: mongoose.Types.ObjectId;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const PracticeSessionSchema: Schema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PracticeSessionSchema.index({ student: 1, createdAt: -1 });
PracticeSessionSchema.index({ student: 1, question: 1 });

export default mongoose.model<IPracticeSession>("PracticeSession", PracticeSessionSchema);
