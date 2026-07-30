import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClassAttendance extends Document {
  liveClass: mongoose.Schema.Types.ObjectId;
  student: mongoose.Schema.Types.ObjectId;
  identity: string;
  joinedAt: Date;
  leftAt?: Date | null;
}

const LiveClassAttendanceSchema: Schema = new Schema(
  {
    liveClass: { type: mongoose.Schema.Types.ObjectId, ref: "LiveClass", required: true, index: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // LiveKit participant identity (matches the userId used when issuing the token)
    identity: { type: String, required: true },
    joinedAt: { type: Date, required: true },
    leftAt: { type: Date, default: null },
  },
  { timestamps: false }
);

export default mongoose.model<ILiveClassAttendance>("LiveClassAttendance", LiveClassAttendanceSchema);
