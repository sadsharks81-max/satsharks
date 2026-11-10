import mongoose, { Schema, Document } from "mongoose";

export interface IWhiteboardPoint {
  x: number;
  y: number;
}

export interface ILiveClassWhiteboardStroke extends Document {
  liveClass: mongoose.Schema.Types.ObjectId;
  strokeId: string;
  points: IWhiteboardPoint[];
  color: string;
  width: number;
  tool: "PEN" | "ERASER";
  author: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const PointSchema = new Schema(
  {
    x: { type: Number, required: true, min: 0, max: 1 },
    y: { type: Number, required: true, min: 0, max: 1 },
  },
  { _id: false },
);

const LiveClassWhiteboardStrokeSchema = new Schema(
  {
    liveClass: { type: Schema.Types.ObjectId, ref: "LiveClass", required: true, index: true },
    strokeId: { type: String, required: true, maxlength: 100 },
    points: {
      type: [PointSchema],
      required: true,
      validate: {
        validator: (points: IWhiteboardPoint[]) => points.length >= 2 && points.length <= 500,
        message: "A stroke must contain between 2 and 500 points",
      },
    },
    color: { type: String, required: true, match: /^#[0-9a-f]{6}$/i },
    width: { type: Number, required: true, min: 1, max: 40 },
    tool: { type: String, enum: ["PEN", "ERASER"], default: "PEN" },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

LiveClassWhiteboardStrokeSchema.index({ liveClass: 1, strokeId: 1 }, { unique: true });
LiveClassWhiteboardStrokeSchema.index({ liveClass: 1, createdAt: 1 });

export default mongoose.model<ILiveClassWhiteboardStroke>(
  "LiveClassWhiteboardStroke",
  LiveClassWhiteboardStrokeSchema,
);
