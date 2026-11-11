import mongoose, { Schema, Document } from "mongoose";

export interface ILiveClassPoll extends Document {
  liveClass: mongoose.Types.ObjectId;
  question: string;
  options: { id: string; text: string }[];
  responses: { user: mongoose.Types.ObjectId; optionId: string; answeredAt: Date }[];
  status: "ACTIVE" | "CLOSED";
  resultsVisible: boolean;
  revealedAt?: Date | null;
  revealedBy?: mongoose.Types.ObjectId | null;
  createdBy: mongoose.Types.ObjectId;
  closedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LiveClassPollSchema = new Schema(
  {
    liveClass: { type: Schema.Types.ObjectId, ref: "LiveClass", required: true, index: true },
    question: { type: String, required: true, trim: true, maxlength: 500 },
    options: {
      type: [
        new Schema(
          {
            id: { type: String, required: true, maxlength: 20 },
            text: { type: String, required: true, trim: true, maxlength: 250 },
          },
          { _id: false },
        ),
      ],
      validate: {
        validator: (options: { id: string; text: string }[]) => options.length >= 2 && options.length <= 6,
        message: "A poll must have between 2 and 6 options",
      },
    },
    responses: {
      type: [
        new Schema(
          {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            optionId: { type: String, required: true },
            answeredAt: { type: Date, default: Date.now },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
    status: { type: String, enum: ["ACTIVE", "CLOSED"], default: "ACTIVE", index: true },
    resultsVisible: { type: Boolean, default: false },
    revealedAt: { type: Date, default: null },
    revealedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

LiveClassPollSchema.index({ liveClass: 1, createdAt: -1 });

export default mongoose.model<ILiveClassPoll>("LiveClassPoll", LiveClassPollSchema);
