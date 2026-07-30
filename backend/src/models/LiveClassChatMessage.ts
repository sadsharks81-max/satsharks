import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClassChatMessage extends Document {
  liveClass: mongoose.Schema.Types.ObjectId;
  sender: mongoose.Schema.Types.ObjectId;
  senderName: string;
  senderRole: "ADMIN" | "STUDENT" | "TEACHER";
  text: string;
  deleted: boolean;
  createdAt: Date;
}

const LiveClassChatMessageSchema: Schema = new Schema(
  {
    liveClass: { type: mongoose.Schema.Types.ObjectId, ref: "LiveClass", required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderRole: { type: String, enum: ["ADMIN", "STUDENT", "TEACHER"], required: true },
    text: { type: String, required: true, maxlength: 1000 },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ILiveClassChatMessage>("LiveClassChatMessage", LiveClassChatMessageSchema);
