import mongoose, { Document, Schema } from "mongoose";

export interface IStudyMaterial extends Document {
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  storageFileId?: mongoose.Types.ObjectId;
  category: "MATH" | "READING_WRITING";
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudyMaterialSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    storageFileId: { type: Schema.Types.ObjectId, select: false },
    category: {
      type: String,
      enum: ["MATH", "READING_WRITING"],
      required: true,
      default: "MATH",
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IStudyMaterial>("StudyMaterial", StudyMaterialSchema);
