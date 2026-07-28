import mongoose, { Document, Schema } from "mongoose";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: "ESSAY_SUBMITTED" | "ESSAY_REVIEWED" | "CONSULTING_SUBMITTED" | "PAYMENT_SUCCESS" | "ACCOUNT" | "TEST" | "CONTACT_INQUIRY" | "ADMIN_REPLY";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["ESSAY_SUBMITTED", "ESSAY_REVIEWED", "CONSULTING_SUBMITTED", "PAYMENT_SUCCESS", "ACCOUNT", "TEST", "CONTACT_INQUIRY", "ADMIN_REPLY"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>("Notification", notificationSchema);
