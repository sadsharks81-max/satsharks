import mongoose, { Document, Schema } from "mongoose";

export interface IGoogleDriveCredential extends Document {
  provider: "GOOGLE_DRIVE";
  encryptedRefreshToken: string;
  connectedBy: mongoose.Types.ObjectId;
  connectedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GoogleDriveCredentialSchema = new Schema<IGoogleDriveCredential>(
  {
    provider: {
      type: String,
      enum: ["GOOGLE_DRIVE"],
      default: "GOOGLE_DRIVE",
      unique: true,
      required: true,
    },
    encryptedRefreshToken: { type: String, required: true, select: false },
    connectedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    connectedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.model<IGoogleDriveCredential>(
  "GoogleDriveCredential",
  GoogleDriveCredentialSchema,
);
