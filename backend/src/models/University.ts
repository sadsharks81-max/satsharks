import mongoose, { Document, Schema } from "mongoose";

export interface IUniversity extends Document {
  uniId: number;
  name: string;
  country: string;
  city: string;
  ranking: number;
  acceptRate: number;
  minGPA: number;
  avgSAT: number | null;
  minIELTS: number | null;
  minTOEFL: number | null;
  tuition: number;
  scholarships: string;
  programs: string[];
  deadline: string;
  type: string;
  logo: string;
  sheetName: string;
}

const universitySchema = new Schema<IUniversity>(
  {
    uniId: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    ranking: { type: Number, required: true },
    acceptRate: { type: Number, required: true },
    minGPA: { type: Number, required: true },
    avgSAT: { type: Number, default: null },
    minIELTS: { type: Number, default: null },
    minTOEFL: { type: Number, default: null },
    tuition: { type: Number, required: true },
    scholarships: { type: String, required: true },
    programs: [{ type: String }],
    deadline: { type: String, required: true },
    type: { type: String, required: true },
    logo: { type: String, required: true },
    sheetName: { type: String, default: "General", required: true },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness within a sheet
universitySchema.index({ uniId: 1, sheetName: 1 }, { unique: true });

export default mongoose.model<IUniversity>("University", universitySchema);
