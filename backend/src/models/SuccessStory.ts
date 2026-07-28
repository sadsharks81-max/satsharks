import mongoose, { Schema, Document } from "mongoose";

export interface ISuccessStory extends Document {
  name: string;
  score: string;
  quote: string;
  university: string;
  imageUrl?: string;
  videoUrl?: string;
  category: "SAT" | "ADMISSION";
  createdAt: Date;
  updatedAt: Date;
}

const SuccessStorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    score: { type: String, required: true },
    quote: { type: String, required: true },
    university: { type: String, required: true },
    imageUrl: { type: String, required: false },
    videoUrl: { type: String, required: false },
    category: {
      type: String,
      enum: ["SAT", "ADMISSION"],
      default: "SAT",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISuccessStory>("SuccessStory", SuccessStorySchema);
