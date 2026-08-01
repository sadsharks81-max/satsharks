import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "STUDENT" | "TEACHER";
  country: string;
  region: "LOCAL" | "INTERNATIONAL";
  subscription: "FREE" | "PAID";
  subscriptionPlan?: string;
  subscriptionExpiry?: Date;
  portalAccessStart?: Date;
  portalAccessEnd?: Date;
  status: "ACTIVE" | "SUSPENDED";
  sessionId?: string;
  resetToken?: string;
  resetTokenExpiry?: Date;
  targetScore: number;
  streakCount: number;
  lastActiveDate: string | null;
  dailyGoal: number;
  dailyPracticeProgress: number;
  leaderboardPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["ADMIN", "STUDENT", "TEACHER"],
      default: "STUDENT",
    },
    country: {
      type: String,
      required: true,
      default: "Unknown",
    },
    region: {
      type: String,
      enum: ["LOCAL", "INTERNATIONAL"],
      required: true,
      default: "INTERNATIONAL",
    },
    subscription: {
      type: String,
      enum: ["FREE", "PAID"],
      required: true,
      default: "FREE",
    },
    subscriptionPlan: {
      type: String,
    },
    subscriptionExpiry: {
      type: Date,
    },
    portalAccessStart: { type: Date },
    portalAccessEnd: { type: Date },
    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      required: true,
      default: "ACTIVE",
    },
    sessionId: {
      type: String,
      default: null,
    },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    targetScore: { type: Number, default: 1400 },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },
    dailyGoal: { type: Number, default: 10 },
    dailyPracticeProgress: { type: Number, default: 0 },
    leaderboardPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
