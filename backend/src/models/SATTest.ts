import mongoose, { Schema, Document } from "mongoose";

export interface ISATModule {
  name: string;
  section: "READING_WRITING" | "MATH";
  moduleNumber: number;
  questions: mongoose.Types.ObjectId[];
  timeLimitMinutes: number;
}

export interface ISATTest extends Document {
  title: string;
  description: string;
  year: number;
  testNumber: number;
  isAdaptive: boolean;
  modules: ISATModule[];
  breakDurationMinutes: number;
  isActive: boolean;
  accessLevel: "FREE" | "PAID";
  pdfUrl: string;
  explanationPdfUrl: string;
  rwScoreMapping: number[];
  mathScoreMapping: number[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SATModuleSchema = new Schema(
  {
    name: { type: String, required: true },
    section: { type: String, enum: ["READING_WRITING", "MATH"], required: true },
    moduleNumber: { type: Number, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    timeLimitMinutes: { type: Number, required: true },
  },
  { _id: false }
);

const SATTestSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    year: { type: Number, required: true },
    testNumber: { type: Number, required: true },
    isAdaptive: { type: Boolean, default: false },
    modules: { type: [SATModuleSchema], required: true },
    breakDurationMinutes: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    accessLevel: { type: String, enum: ["FREE", "PAID"], default: "FREE" },
    pdfUrl: { type: String, default: "" },
    explanationPdfUrl: { type: String, default: "" },
    rwScoreMapping: { type: [Number], default: [] },
    mathScoreMapping: { type: [Number], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

SATTestSchema.index({ isActive: 1, accessLevel: 1 });
SATTestSchema.index({ year: 1, testNumber: 1 }, { unique: true });

export default mongoose.model<ISATTest>("SATTest", SATTestSchema);
