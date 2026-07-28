import mongoose, { Schema, Document } from "mongoose";

export interface IQuestionCategory extends Document {
  name: string;
  section: "READING_WRITING" | "MATH";
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    section: {
      type: String,
      enum: ["READING_WRITING", "MATH"],
      required: true,
    },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IQuestionCategory>("QuestionCategory", QuestionCategorySchema);
