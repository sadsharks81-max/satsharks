import mongoose, { Document, Schema } from "mongoose";

export interface IEssay extends Document {
  student: mongoose.Types.ObjectId;
  type: "COMMON_APP" | "SUPPLEMENTAL" | "OTHER";
  targetUniversity: string;
  essayText: string;
  fileUrl: string;
  status: "PENDING" | "IN_REVIEW" | "REVIEWED";
  adminFeedback: string;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const essaySchema = new Schema<IEssay>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["COMMON_APP", "SUPPLEMENTAL", "OTHER"],
      required: true,
    },
    targetUniversity: {
      type: String,
      default: "",
    },
    essayText: {
      type: String,
      default: "",
    },
    fileUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["PENDING", "IN_REVIEW", "REVIEWED"],
      default: "PENDING",
    },
    adminFeedback: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEssay>("Essay", essaySchema);
