import mongoose, { Document, Schema } from "mongoose";

export interface IConsultingRequest extends Document {
  student: mongoose.Types.ObjectId;
  level: "UNDERGRADUATE" | "GRADUATE";
  secondaryType: "MATRIC" | "O_LEVEL" | "";
  secondaryObtained: number | null;
  secondaryTotal: number | null;
  secondaryGrades: string;
  higherType: "FSC" | "A_LEVEL" | "";
  higherObtained: number | null;
  higherTotal: number | null;
  higherGrades: string;
  gpa: string;
  satScore: number | null;
  gradeYear: string;
  targetUniversities: string[];
  selectedScholarship: string;
  extracurriculars: string;
  budgetRange: string;
  status: "PENDING" | "IN_REVIEW" | "COMPLETED";
  adminNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const consultingRequestSchema = new Schema<IConsultingRequest>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    level: {
      type: String,
      enum: ["UNDERGRADUATE", "GRADUATE"],
      required: true,
      default: "UNDERGRADUATE"
    },
    secondaryType: { type: String, default: "" },
    secondaryObtained: { type: Number, default: null },
    secondaryTotal: { type: Number, default: null },
    secondaryGrades: { type: String, default: "" },
    higherType: { type: String, default: "" },
    higherObtained: { type: Number, default: null },
    higherTotal: { type: Number, default: null },
    higherGrades: { type: String, default: "" },
    gpa: {
      type: String,
      default: ""
    },
    satScore: {
      type: Number,
      default: null,
    },
    gradeYear: {
      type: String,
      default: "",
    },
    targetUniversities: [
      {
        type: String,
      },
    ],
    selectedScholarship: {
      type: String,
      default: "",
    },
    extracurriculars: {
      type: String,
      default: "",
    },
    budgetRange: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "COMPLETED"],
      default: "PENDING",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IConsultingRequest>("ConsultingRequest", consultingRequestSchema);
