import mongoose, { Document, Schema } from "mongoose";

export interface IBrowserRecordingUpload extends Document {
  liveClass: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  encryptedUploadUrl: string;
  filename: string;
  mimeType: string;
  nextOffset: number;
  status: "ACTIVE" | "READY" | "FAILED" | "ABORTED";
  driveFileId?: string | null;
  error?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const BrowserRecordingUploadSchema = new Schema<IBrowserRecordingUpload>(
  {
    liveClass: {
      type: Schema.Types.ObjectId,
      ref: "LiveClass",
      required: true,
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    encryptedUploadUrl: { type: String, required: true, select: false },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    nextOffset: { type: Number, required: true, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["ACTIVE", "READY", "FAILED", "ABORTED"],
      default: "ACTIVE",
      index: true,
    },
    driveFileId: { type: String, default: null },
    error: { type: String, default: null },
  },
  { timestamps: true },
);

BrowserRecordingUploadSchema.index({ liveClass: 1, status: 1 });

export default mongoose.model<IBrowserRecordingUpload>(
  "BrowserRecordingUpload",
  BrowserRecordingUploadSchema,
);
