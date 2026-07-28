import mongoose, { Schema, Document } from "mongoose";

export interface IDiagnosticTest extends Document {
  title: string;
  description: string;
  section: "READING_WRITING" | "MATH" | "FULL";
  questions: mongoose.Types.ObjectId[];
  timeLimit: number;
  totalMarks: number;
  isActive: boolean;
  accessLevel: "FREE" | "PAID";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DiagnosticTestSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    section: {
      type: String,
      enum: ["READING_WRITING", "MATH", "FULL"],
      required: true,
    },
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }],
    timeLimit: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    accessLevel: {
      type: String,
      enum: ["FREE", "PAID"],
      default: "FREE",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

DiagnosticTestSchema.index({ isActive: 1, accessLevel: 1 });

export default mongoose.model<IDiagnosticTest>("DiagnosticTest", DiagnosticTestSchema);
