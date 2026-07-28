import mongoose, { Schema, Document } from "mongoose";

export interface IInquiry extends Document {
  user?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  category: string;
  message: string;
  adminReply?: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    category: { type: String, required: true },
    message: { type: String, required: true },
    adminReply: { type: String },
    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "RESOLVED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IInquiry>("Inquiry", InquirySchema);
