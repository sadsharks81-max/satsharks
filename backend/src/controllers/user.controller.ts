import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { USER_PUBLIC_FIELDS } from "../models/User";
import PaymentProof from "../models/PaymentProof";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendError } from "../utils/http";
import { asEnumValue, getPagination } from "../utils/query";

const USER_ROLES = ["ADMIN", "STUDENT", "TEACHER"] as const;

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });

    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, user: { ...req.user, hasPendingPayment: false } });
    }

    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ success: false, error: "Invalid user session token" });
    }

    const user = await User.findById(req.user.userId).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let hasPendingPayment = false;
    if (process.env.DATABASE_URL) {
      // Existence check only , the full proof document (including the
      // screenshot path) is not needed here.
      const pending = await PaymentProof.exists({ user: user.id, status: "PENDING" });
      hasPendingPayment = Boolean(pending);
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        region: user.region,
        subscription: user.subscription,
        subscriptionExpiry: user.subscriptionExpiry,
        portalAccessStart: user.portalAccessStart,
        portalAccessEnd: user.portalAccessEnd,
        status: user.status,
        targetScore: user.targetScore ?? 1400,
        streakCount: user.streakCount ?? 0,
        lastActiveDate: user.lastActiveDate,
        dailyGoal: user.dailyGoal ?? 10,
        dailyPracticeProgress: user.dailyPracticeProgress ?? 0,
        leaderboardPoints: user.leaderboardPoints ?? 0,
        hasPendingPayment
      }
    });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};

export const updateUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, error: "Unauthorized" });
    
    if (!mongoose.Types.ObjectId.isValid(req.user.userId)) {
      return res.status(401).json({ success: false, error: "Invalid user session token" });
    }

    const { targetScore, dailyGoal } = req.body;

    // Only these two fields are writable here. Anything else in the body is
    // ignored, so the endpoint cannot be used to self-assign a role or a
    // subscription. `runValidators` enforces the schema's min/max bounds, which
    // an unvalidated findByIdAndUpdate would otherwise skip.
    const updateData: Record<string, number> = {};
    if (Number.isFinite(targetScore)) updateData.targetScore = targetScore;
    if (Number.isFinite(dailyGoal)) updateData.dailyGoal = dailyGoal;

    const user = await User.findByIdAndUpdate(req.user.userId, updateData, {
      new: true,
      runValidators: true,
    }).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        country: user.country,
        region: user.region,
        subscription: user.subscription,
        status: user.status,
        targetScore: user.targetScore,
        streakCount: user.streakCount,
        lastActiveDate: user.lastActiveDate,
        dailyGoal: user.dailyGoal,
        dailyPracticeProgress: user.dailyPracticeProgress,
        leaderboardPoints: user.leaderboardPoints
      }
    });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};


export const getUsers = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, users: [] });
    }

    // `?role[$ne]=STUDENT` previously arrived as an object and was spliced
    // straight into the filter as a Mongo operator. Only known enum values pass.
    const filter: Record<string, unknown> = { email: { $ne: "admin@satsharks.com" } };
    const role = asEnumValue(req.query.role, USER_ROLES);
    if (role) filter.role = role;

    // Bounded to remove the unbounded full-collection read while staying large
    // enough that the current admin table (which has no pager) is unchanged.
    const { page, limit, skip } = getPagination(req.query, 500, 1000);
    const [users, total] = await Promise.all([
      User.find(filter)
        .select(USER_PUBLIC_FIELDS)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);
    res.status(200).json({
      success: true,
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    sendError(res, error, "user.getUsers");
  }
};

export const updateUserSubscription = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const subscription = asEnumValue(req.body.subscription, ["FREE", "PAID"] as const);
    if (!subscription) {
      return res.status(400).json({ success: false, error: "Invalid subscription" });
    }

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Subscription updated (mock)" });

    const user = await User.findByIdAndUpdate(id, { subscription }, { new: true, runValidators: true }).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const status = asEnumValue(req.body.status, ["ACTIVE", "SUSPENDED"] as const);
    if (!status) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Status updated (mock)" });

    // Suspending a student also clears sessionId, so the change takes effect on
    // their next request instead of when their access token eventually expires.
    const update = status === "SUSPENDED" ? { status, sessionId: null } : { status };
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const role = asEnumValue(req.body.role, USER_ROLES);
    if (!role) {
      return res.status(400).json({ success: false, error: "Invalid role" });
    }

    if (!process.env.DATABASE_URL) return res.status(200).json({ success: true, message: "Role updated (mock)" });

    const user = await User.findByIdAndUpdate(id, { role }, { new: true, runValidators: true }).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};

export const updateUserAccessDates = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { portalAccessStart, portalAccessEnd } = req.body;
    const parseDate = (value: unknown) => {
      if (!value) return null;
      const parsed = new Date(value as string);
      // `new Date("nonsense")` yields Invalid Date, which Mongoose would then
      // reject deep in the driver instead of here with a usable message.
      return Number.isNaN(parsed.getTime()) ? undefined : parsed;
    };
    const start = parseDate(portalAccessStart);
    const end = parseDate(portalAccessEnd);
    if (start === undefined || end === undefined) {
      return res.status(400).json({ success: false, error: "Invalid date supplied." });
    }
    if (start && end && end <= start) {
      return res.status(400).json({ success: false, error: "The ending date must be after the starting date." });
    }
    const update: any = { portalAccessStart: start, portalAccessEnd: end, subscriptionExpiry: end };
    if (end) update.subscription = end > new Date() ? "PAID" : "FREE";
    const user = await User.findByIdAndUpdate(id, update, { new: true, runValidators: true }).select(USER_PUBLIC_FIELDS);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    sendError(res, error, "user.controller");
  }
};
