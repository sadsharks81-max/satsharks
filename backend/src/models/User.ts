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
    name: { type: String, required: true, trim: true, maxlength: 200 },
    // Stored lowercased + trimmed so "A@b.com" and "a@b.com" cannot become two
    // accounts and so login is not accidentally case sensitive.
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // `select: false` keeps credential and session material out of every query
    // that does not explicitly ask for it. Previously `.select("-password")` was
    // the only guard, which still returned resetToken/resetTokenExpiry/sessionId
    // to admin-facing endpoints.
    password: { type: String, select: false },
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
      select: false,
    },
    // Only the SHA-256 digest of the emailed token is persisted, and it is never
    // selected by default , a leaked reset token is an account takeover.
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
    targetScore: { type: Number, default: 1400, min: 400, max: 1600 },
    streakCount: { type: Number, default: 0, min: 0 },
    lastActiveDate: { type: String, default: null },
    dailyGoal: { type: Number, default: 10, min: 1, max: 500 },
    dailyPracticeProgress: { type: Number, default: 0, min: 0 },
    leaderboardPoints: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

/**
 * Explicit allowlist for anything that leaves the API. Safer than subtractive
 * projections (`-password`), which silently expose every field added later.
 */
export const USER_PUBLIC_FIELDS = [
  "name",
  "email",
  "role",
  "country",
  "region",
  "subscription",
  "subscriptionPlan",
  "subscriptionExpiry",
  "portalAccessStart",
  "portalAccessEnd",
  "status",
  "targetScore",
  "streakCount",
  "lastActiveDate",
  "dailyGoal",
  "dailyPracticeProgress",
  "leaderboardPoints",
  "createdAt",
  "updatedAt",
].join(" ");

// Admin user list sorts by createdAt and filters by role; leaderboard sorts by
// points. Without these, both were collection scans plus an in-memory sort.
UserSchema.index({ createdAt: -1 });
UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ leaderboardPoints: -1 });
// Reset confirmation looks the user up by token hash. Deliberately NOT a TTL
// index: a TTL index on resetTokenExpiry would delete the whole user document,
// not just the expired token. Expiry is enforced in the query and the fields are
// cleared once consumed.
UserSchema.index({ resetToken: 1 }, { sparse: true });

export default mongoose.model<IUser>("User", UserSchema);
