import mongoose, { Schema, Document } from "mongoose";

export interface IHomepageStats extends Document {
  successRate: string;
  studentsMentored: string;
  eliteAdmissions: string;
  avgSatGain: string;
}

const HomepageStatsSchema: Schema = new Schema(
  {
    successRate: { type: String, default: "98%" },
    studentsMentored: { type: String, default: "1,500+" },
    eliteAdmissions: { type: String, default: "250+" },
    avgSatGain: { type: String, default: "+220" },
  },
  { timestamps: true }
);

export default mongoose.model<IHomepageStats>("HomepageStats", HomepageStatsSchema);
