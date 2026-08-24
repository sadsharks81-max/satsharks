import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { USER_PUBLIC_FIELDS } from "../models/User";
import PaymentProof from "../models/PaymentProof";
import ConsultingRequest from "../models/ConsultingRequest";
import DiagnosticTest from "../models/DiagnosticTest";
import Essay from "../models/Essay";
import Inquiry from "../models/Inquiry";
import LiveClass from "../models/LiveClass";
import LiveClassAttendance from "../models/LiveClassAttendance";
import LiveClassChatMessage from "../models/LiveClassChatMessage";
import Notification from "../models/Notification";
import PracticeSession from "../models/PracticeSession";
import PracticeTestUpload from "../models/PracticeTestUpload";
import Question from "../models/Question";
import { ReportedIssue } from "../models/ReportedIssue";
import SATTest from "../models/SATTest";
import SATTestAttempt from "../models/SATTestAttempt";
import StudyMaterial from "../models/StudyMaterial";
import TestAttempt from "../models/TestAttempt";
import VocabularyProgress from "../models/VocabularyProgress";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendError } from "../utils/http";
import { asEnumValue, getPagination } from "../utils/query";
import { deleteManagedImage } from "../utils/managed-image";

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

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, error: "Invalid user." });
    }
    if (id === req.user?.userId) {
      return res.status(409).json({ success: false, error: "You cannot delete your own account." });
    }

    const user = await User.findById(id).select("role name email");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    if (user.role === "ADMIN") {
      return res.status(403).json({ success: false, error: "Administrator accounts cannot be deleted here." });
    }

    const [classCount, studyMaterialCount, uploadCount] = await Promise.all([
      LiveClass.countDocuments({ $or: [{ teacher: user._id }, { createdBy: user._id }] }),
      StudyMaterial.countDocuments({ uploadedBy: user._id }),
      PracticeTestUpload.countDocuments({ uploadedBy: user._id }),
    ]);
    if (classCount > 0 || studyMaterialCount > 0 || uploadCount > 0) {
      return res.status(409).json({
        success: false,
        error: `Delete or reassign this user's ${classCount} class(es), ${studyMaterialCount} study material(s), and ${uploadCount} upload(s) first.`,
      });
    }

    const paymentProofs = await PaymentProof.find({ user: user._id, status: "PENDING" })
      .select("screenshotUrl")
      .lean();
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        // MongoDB sessions do not support parallel operations inside one
        // transaction, so keep this cascade deliberately sequential.
        await ConsultingRequest.deleteMany({ student: user._id }, { session });
        await Essay.deleteMany({ student: user._id }, { session });
        await LiveClassAttendance.deleteMany({ student: user._id }, { session });
        await LiveClassChatMessage.deleteMany({ sender: user._id }, { session });
        await Notification.deleteMany({ user: user._id }, { session });
        await PaymentProof.deleteMany({ user: user._id, status: "PENDING" }, { session });
        await PracticeSession.deleteMany({ student: user._id }, { session });
        await ReportedIssue.deleteMany({ reportedBy: user._id }, { session });
        await SATTestAttempt.deleteMany({ student: user._id }, { session });
        await TestAttempt.deleteMany({ student: user._id }, { session });
        await VocabularyProgress.deleteMany({ student: user._id }, { session });
        await Essay.updateMany({ reviewedBy: user._id }, { $set: { reviewedBy: null } }, { session });
        await PracticeTestUpload.updateMany({ reviewedBy: user._id }, { $set: { reviewedBy: null } }, { session });
        await Inquiry.updateMany({ user: user._id }, { $unset: { user: 1 } }, { session });
        await ReportedIssue.updateMany({ resolvedBy: user._id }, { $unset: { resolvedBy: 1 } }, { session });
        await Question.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } }, { session });
        if (user.role === "STUDENT") {
          await SATTest.deleteMany({ createdBy: user._id, year: 9999 }, { session });
        } else {
          await SATTest.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } }, { session });
        }
        await DiagnosticTest.updateMany({ createdBy: user._id }, { $unset: { createdBy: 1 } }, { session });
        const deleted = await User.deleteOne({ _id: user._id }, { session });
        if (deleted.deletedCount !== 1) throw new Error("User disappeared during deletion.");
      });
    } finally {
      await session.endSession();
    }

    await Promise.allSettled(paymentProofs.map((proof) => deleteManagedImage(proof.screenshotUrl)));

    res.status(200).json({ success: true, message: `${user.name} was deleted.` });
  } catch (error) {
    sendError(res, error, "user.deleteUser");
  }
};

export const bulkDeleteUsers = async (req: AuthRequest, res: Response) => {
  try {
    const suppliedIds: string[] = Array.isArray(req.body.userIds)
      ? req.body.userIds.map((id: unknown) => String(id))
      : [];
    const userIds = [...new Set<string>(suppliedIds)];

    if (userIds.length === 0) {
      return res.status(400).json({ success: false, error: "Select at least one user." });
    }
    if (userIds.length > 100) {
      return res.status(400).json({ success: false, error: "You can delete at most 100 users at once." });
    }
    if (userIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ success: false, error: "One or more selected users are invalid." });
    }
    if (req.user?.userId && userIds.includes(req.user.userId)) {
      return res.status(409).json({ success: false, error: "You cannot delete your own account." });
    }

    const users = await User.find({ _id: { $in: userIds } }).select("role name email");
    if (users.length !== userIds.length) {
      return res.status(404).json({ success: false, error: "One or more selected users no longer exist." });
    }
    if (users.some((selectedUser) => selectedUser.role === "ADMIN")) {
      return res.status(403).json({ success: false, error: "Administrator accounts cannot be deleted here." });
    }

    const objectIds = users.map((selectedUser) => selectedUser._id);
    const ownerFilter = { $in: objectIds };
    const [classCount, studyMaterialCount, uploadCount] = await Promise.all([
      LiveClass.countDocuments({ $or: [{ teacher: ownerFilter }, { createdBy: ownerFilter }] }),
      StudyMaterial.countDocuments({ uploadedBy: ownerFilter }),
      PracticeTestUpload.countDocuments({ uploadedBy: ownerFilter }),
    ]);
    if (classCount > 0 || studyMaterialCount > 0 || uploadCount > 0) {
      return res.status(409).json({
        success: false,
        error: `Delete or reassign the selected users' ${classCount} class(es), ${studyMaterialCount} study material(s), and ${uploadCount} upload(s) first. No users were deleted.`,
      });
    }

    const paymentProofs = await PaymentProof.find({ user: ownerFilter, status: "PENDING" })
      .select("screenshotUrl")
      .lean();
    const studentIds = users
      .filter((selectedUser) => selectedUser.role === "STUDENT")
      .map((selectedUser) => selectedUser._id);
    const teacherIds = users
      .filter((selectedUser) => selectedUser.role === "TEACHER")
      .map((selectedUser) => selectedUser._id);

    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        await ConsultingRequest.deleteMany({ student: ownerFilter }, { session });
        await Essay.deleteMany({ student: ownerFilter }, { session });
        await LiveClassAttendance.deleteMany({ student: ownerFilter }, { session });
        await LiveClassChatMessage.deleteMany({ sender: ownerFilter }, { session });
        await Notification.deleteMany({ user: ownerFilter }, { session });
        await PaymentProof.deleteMany({ user: ownerFilter, status: "PENDING" }, { session });
        await PracticeSession.deleteMany({ student: ownerFilter }, { session });
        await ReportedIssue.deleteMany({ reportedBy: ownerFilter }, { session });
        await SATTestAttempt.deleteMany({ student: ownerFilter }, { session });
        await TestAttempt.deleteMany({ student: ownerFilter }, { session });
        await VocabularyProgress.deleteMany({ student: ownerFilter }, { session });
        await Essay.updateMany({ reviewedBy: ownerFilter }, { $set: { reviewedBy: null } }, { session });
        await PracticeTestUpload.updateMany({ reviewedBy: ownerFilter }, { $set: { reviewedBy: null } }, { session });
        await Inquiry.updateMany({ user: ownerFilter }, { $unset: { user: 1 } }, { session });
        await ReportedIssue.updateMany({ resolvedBy: ownerFilter }, { $unset: { resolvedBy: 1 } }, { session });
        await Question.updateMany({ createdBy: ownerFilter }, { $unset: { createdBy: 1 } }, { session });
        if (studentIds.length > 0) {
          await SATTest.deleteMany({ createdBy: { $in: studentIds }, year: 9999 }, { session });
        }
        if (teacherIds.length > 0) {
          await SATTest.updateMany(
            { createdBy: { $in: teacherIds } },
            { $unset: { createdBy: 1 } },
            { session },
          );
        }
        await DiagnosticTest.updateMany(
          { createdBy: ownerFilter },
          { $unset: { createdBy: 1 } },
          { session },
        );
        const deleted = await User.deleteMany({ _id: ownerFilter }, { session });
        if (deleted.deletedCount !== users.length) {
          throw new Error("One or more selected users changed during deletion.");
        }
      });
    } finally {
      await session.endSession();
    }

    await Promise.allSettled(paymentProofs.map((proof) => deleteManagedImage(proof.screenshotUrl)));
    return res.status(200).json({
      success: true,
      deletedCount: users.length,
      message: `${users.length} user${users.length === 1 ? "" : "s"} deleted.`,
    });
  } catch (error) {
    sendError(res, error, "user.bulkDeleteUsers");
  }
};
