import mongoose, { Document, Schema } from "mongoose";

export interface IVocabularyProgress extends Document {
  student: mongoose.Types.ObjectId;
  masteredWords: mongoose.Types.ObjectId[];
  missedCounts: Map<string, number>;
  totalAttempts: number;
  totalCorrect: number;
  pointsDate: string | null;
  pointsAwardedToday: number;
  createdAt: Date;
  updatedAt: Date;
}

const VocabularyProgressSchema = new Schema<IVocabularyProgress>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    masteredWords: [{ type: Schema.Types.ObjectId, ref: "VocabularyWord" }],
    missedCounts: { type: Map, of: Number, default: {} },
    totalAttempts: { type: Number, default: 0, min: 0 },
    totalCorrect: { type: Number, default: 0, min: 0 },
    pointsDate: { type: String, default: null },
    pointsAwardedToday: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IVocabularyProgress>("VocabularyProgress", VocabularyProgressSchema);
