import mongoose, { Schema, Document } from "mongoose";

export interface IHeroFeature extends Document {
  studentName: string;
  university: string;
  score: string;
  improvement: string;
  tag: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const HeroFeatureSchema: Schema = new Schema(
  {
    studentName: { type: String, default: "Admitted Student" },
    university: { type: String, default: "Stanford University '28" },
    score: { type: String, default: "1580" },
    improvement: { type: String, default: "+210 Improvement" },
    tag: { type: String, default: "Top 1% Worldwide" },
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model<IHeroFeature>("HeroFeature", HeroFeatureSchema);
