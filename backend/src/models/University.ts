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
  
  // Extended fields from verified database
  admitDifficulty?: string;
  scholarshipType?: string;
  needBlindIntl?: string;
  maxAidCoverage?: string;
  meritMinGPA?: string;
  meritMinSAT?: string;
  ecImp?: number;
  essayWeight?: number;
  ecProfile?: string;
  holisticReview?: string;
  interview?: string;
  appPlatform?: string;
  counselorTip?: string;
  minACT?: number | null;
  actSatNote?: string;
  englishExemptPolicy?: string;
  englishExemptSAT?: number | null;
  gradingSystemsAccepted?: string;
  minMatricFsc?: string;
  minALevel?: string;
  minIB?: number | null;
  officialWebsite?: string;
  profile?: string;
}

const universitySchema = new Schema<IUniversity>(
  {
    uniId: { type: Number, required: true },
    name: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    ranking: { type: Number, default: 9999 },
    acceptRate: { type: Number, default: 100 },
    minGPA: { type: Number, default: 0 },
    avgSAT: { type: Number, default: null },
    minIELTS: { type: Number, default: null },
    minTOEFL: { type: Number, default: null },
    tuition: { type: Number, default: 0 },
    scholarships: { type: String, default: "" },
    programs: [{ type: String }],
    deadline: { type: String, default: "" },
    type: { type: String, default: "" },
    logo: { type: String, default: "🏫" },
    sheetName: { type: String, default: "General", required: true },
    
    // Extended fields
    admitDifficulty: { type: String, default: "" },
    scholarshipType: { type: String, default: "" },
    needBlindIntl: { type: String, default: "" },
    maxAidCoverage: { type: String, default: "" },
    meritMinGPA: { type: String, default: "" },
    meritMinSAT: { type: String, default: "" },
    ecImp: { type: Number, default: 5 },
    essayWeight: { type: Number, default: 5 },
    ecProfile: { type: String, default: "" },
    holisticReview: { type: String, default: "" },
    interview: { type: String, default: "" },
    appPlatform: { type: String, default: "" },
    counselorTip: { type: String, default: "" },
    minACT: { type: Number, default: null },
    actSatNote: { type: String, default: "" },
    englishExemptPolicy: { type: String, default: "" },
    englishExemptSAT: { type: Number, default: null },
    gradingSystemsAccepted: { type: String, default: "" },
    minMatricFsc: { type: String, default: "" },
    minALevel: { type: String, default: "" },
    minIB: { type: Number, default: null },
    officialWebsite: { type: String, default: "" },
    profile: { type: String, default: "Basic" },
  },
  { timestamps: true }
);

// Compound index to ensure uniqueness within a sheet
universitySchema.index({ uniId: 1, sheetName: 1 }, { unique: true });

export default mongoose.model<IUniversity>("University", universitySchema);

