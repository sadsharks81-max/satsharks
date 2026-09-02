import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClass extends Document {
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  roomName: string;
  maxStudents: number;
  startedAt?: Date | null;
  endedAt?: Date | null;
  teacher: mongoose.Schema.Types.ObjectId;
  createdBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    scheduledAt: { type: Date, required: true },
    duration: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"],
      default: "SCHEDULED",
    },
    // LiveKit room name. Set to the document's own _id (unique, URL-safe) right after creation.
    roomName: { type: String, required: true, unique: true },
    maxStudents: { type: Number, default: 100, min: 1, max: 500 },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILiveClass>("LiveClass", LiveClassSchema);
