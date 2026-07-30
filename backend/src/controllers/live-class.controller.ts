import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth.middleware";
import LiveClass from "../models/LiveClass";
import LiveClassChatMessage from "../models/LiveClassChatMessage";
import LiveClassAttendance from "../models/LiveClassAttendance";
import User from "../models/User";
import { env } from "../config/env";
import {
  JOIN_BUFFER_MINUTES,
  LiveKitNotConfiguredError,
  ensureRoomExists,
  deleteRoomIfExists,
  listRoomParticipants,
  removeRoomParticipant,
  muteRoomParticipant,
  issueRoomToken,
  verifyWebhookEvent,
} from "../services/livekit.service";

const MIN_TOKEN_TTL_SECONDS = 5 * 60;
const MAX_TOKEN_TTL_SECONDS = 4 * 60 * 60;
const JOIN_GRACE_MINUTES = 15; // how long after scheduled end a class can still be joined

const handleServiceError = (res: Response, error: any) => {
  if (error instanceof LiveKitNotConfiguredError) {
    return res.status(503).json({ success: false, error: error.message });
  }
  return res.status(500).json({ success: false, error: error.message || "Server Error" });
};

// Create a new online class session
export const createLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, scheduledAt, duration, teacherId, maxStudents } = req.body;

    if (!title || !scheduledAt || !teacherId) {
      return res.status(400).json({ success: false, error: "Title, scheduled time, and teacher are required" });
    }

    // Pre-generate the _id so roomName (the LiveKit room identifier) can be set in the same insert.
    const _id = new mongoose.Types.ObjectId();

    const newClass = await LiveClass.create({
      _id,
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      roomName: _id.toString(),
      maxStudents: Number(maxStudents) > 0 ? Number(maxStudents) : 50,
      teacher: teacherId,
      createdBy: req.user?.userId,
    });

    res.status(201).json({ success: true, liveClass: newClass });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all class sessions (with filter for roles)
export const getLiveClasses = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.userId;

    let query: any = {};

    if (role === "STUDENT") {
      // Students see every scheduled/live/completed class (no roster system) - Join is gated by subscription.
      query.status = { $in: ["SCHEDULED", "LIVE", "COMPLETED"] };
    } else if (role === "TEACHER") {
      // Teachers only see their assigned classes
      query.teacher = userId;
    }
    // Admins see all classes

    const classes = await LiveClass.find(query)
      .populate("teacher", "name email")
      .populate("createdBy", "name email")
      .sort({ scheduledAt: -1 });

    res.status(200).json({ success: true, classes });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get single live class details
export const getLiveClassById = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id)
      .populate("teacher", "name email")
      .populate("createdBy", "name email");

    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }

    res.status(200).json({ success: true, liveClass });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update live class status (e.g., start class or complete class)
export const updateLiveClassStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    if (!["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ success: false, error: "Invalid status" });
    }

    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }

    // Security check: only teacher or admin can modify status
    if (req.user?.role !== "ADMIN" && String(liveClass.teacher) !== String(req.user?.userId)) {
      return res.status(403).json({ success: false, error: "Unauthorized to update this class" });
    }

    // Classes created before roomName existed on the schema won't have it set yet - backfill deterministically.
    if (!liveClass.roomName) {
      liveClass.roomName = String(liveClass._id);
    }

    if (status === "LIVE" && liveClass.status !== "LIVE") {
      await ensureRoomExists(liveClass.roomName, liveClass.maxStudents);
      liveClass.startedAt = new Date();
    }

    if (status === "COMPLETED" && liveClass.status !== "COMPLETED") {
      await deleteRoomIfExists(liveClass.roomName);
      liveClass.endedAt = new Date();
    }

    liveClass.status = status;
    await liveClass.save();

    res.status(200).json({ success: true, liveClass });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

// Delete a class session
export const deleteLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }

    // Only creator/teacher/admin can delete
    if (req.user?.role !== "ADMIN" && String(liveClass.createdBy) !== String(req.user?.userId)) {
      return res.status(403).json({ success: false, error: "Unauthorized to delete this class" });
    }

    if (env.isLiveKitConfigured) {
      await deleteRoomIfExists(liveClass.roomName);
    }
    await LiveClass.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Issue a scoped LiveKit access token for the requesting user to join this class's room.
export const generateJoinToken = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }
    if (!liveClass.roomName) {
      liveClass.roomName = String(liveClass._id);
      await liveClass.save();
    }

    const role = req.user?.role;
    const userId = req.user?.userId;
    const isTeacherOfClass = String(liveClass.teacher) === String(userId);

    if (role === "TEACHER" && !isTeacherOfClass) {
      return res.status(403).json({ success: false, error: "You are not assigned to this class" });
    }

    if (role === "STUDENT") {
      if (req.user?.subscription !== "PAID") {
        return res.status(403).json({
          success: false,
          error: "A Premium subscription is required to join live classes.",
          upgradeRequired: true,
        });
      }

      const now = new Date();
      const opensAt = new Date(liveClass.scheduledAt.getTime() - JOIN_BUFFER_MINUTES * 60000);
      const closesAt = new Date(liveClass.scheduledAt.getTime() + (liveClass.duration + JOIN_GRACE_MINUTES) * 60000);
      if (now < opensAt || now > closesAt) {
        return res.status(403).json({ success: false, error: "This class is not within its scheduled join window." });
      }
      if (liveClass.status !== "LIVE") {
        return res.status(409).json({ success: false, error: "Waiting for the teacher to start the class.", waiting: true });
      }

      const participants = await listRoomParticipants(liveClass.roomName);
      if (participants.length >= liveClass.maxStudents) {
        return res.status(403).json({ success: false, error: "This class has reached its maximum number of students." });
      }
    }

    if ((role === "TEACHER" || role === "ADMIN") && liveClass.status !== "LIVE" && liveClass.status !== "SCHEDULED") {
      return res.status(409).json({ success: false, error: "This class is not currently active." });
    }

    // Room may not exist yet if a teacher/admin is joining ahead of "Start Class" - create it defensively.
    await ensureRoomExists(liveClass.roomName, liveClass.maxStudents);

    const user = await User.findById(userId).select("name");
    const ttlSeconds = Math.min(
      MAX_TOKEN_TTL_SECONDS,
      Math.max(
        MIN_TOKEN_TTL_SECONDS,
        Math.round((liveClass.scheduledAt.getTime() + (liveClass.duration + JOIN_GRACE_MINUTES) * 60000 - Date.now()) / 1000)
      )
    );

    const token = await issueRoomToken({
      roomName: liveClass.roomName,
      identity: String(userId),
      name: user?.name || "Guest",
      ttlSeconds,
      grant: {
        roomAdmin: role === "ADMIN" || role === "TEACHER",
        canPublish: true,
        canSubscribe: true,
        // Needed for the raise-hand feature, which stores state via localParticipant.setAttributes().
        canUpdateOwnMetadata: true,
      },
    });

    res.status(200).json({ success: true, token, url: env.livekitUrl, roomName: liveClass.roomName });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

// Lightweight participant count, used by dashboard cards for "Students Joined" - only meaningful once LIVE.
export const getLiveClassParticipants = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }
    if (liveClass.status !== "LIVE") {
      return res.status(200).json({ success: true, count: 0 });
    }
    const participants = await listRoomParticipants(liveClass.roomName);
    res.status(200).json({ success: true, count: participants.length });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

const assertModeratorAccess = async (req: AuthRequest, liveClass: InstanceType<typeof LiveClass>) => {
  const role = req.user?.role;
  if (role === "ADMIN") return true;
  if (role === "TEACHER" && String(liveClass.teacher) === String(req.user?.userId)) return true;
  return false;
};

export const muteParticipant = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ success: false, error: "Class session not found" });
    if (!(await assertModeratorAccess(req, liveClass))) {
      return res.status(403).json({ success: false, error: "Only the teacher or an admin can do this" });
    }
    const { muted } = req.body;
    await muteRoomParticipant(liveClass.roomName, String(req.params.identity), Boolean(muted));
    res.status(200).json({ success: true });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

export const removeParticipantFromClass = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ success: false, error: "Class session not found" });
    if (!(await assertModeratorAccess(req, liveClass))) {
      return res.status(403).json({ success: false, error: "Only the teacher or an admin can do this" });
    }
    await removeRoomParticipant(liveClass.roomName, String(req.params.identity));
    res.status(200).json({ success: true });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

// --- Chat ---

export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const messages = await LiveClassChatMessage.find({ liveClass: req.params.id })
      .sort({ createdAt: 1 })
      .limit(200);
    res.status(200).json({ success: true, messages });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const postChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, error: "Message text is required" });
    }
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ success: false, error: "Class session not found" });

    const user = await User.findById(req.user?.userId).select("name");
    const message = await LiveClassChatMessage.create({
      liveClass: liveClass._id,
      sender: req.user?.userId,
      senderName: user?.name || "Guest",
      senderRole: req.user?.role,
      text: text.trim().slice(0, 1000),
    });

    res.status(201).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteChatMessage = async (req: AuthRequest, res: Response) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) return res.status(404).json({ success: false, error: "Class session not found" });
    if (!(await assertModeratorAccess(req, liveClass))) {
      return res.status(403).json({ success: false, error: "Only the teacher or an admin can delete messages" });
    }
    const message = await LiveClassChatMessage.findOneAndUpdate(
      { _id: req.params.messageId, liveClass: liveClass._id },
      { deleted: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ success: false, error: "Message not found" });
    res.status(200).json({ success: true, message });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- Webhook ---
// Mounted with express.raw() ahead of express.json() in server.ts, mirroring the Stripe webhook.
export const liveKitWebhook = async (req: AuthRequest, res: Response) => {
  try {
    const authHeader = (req.headers["authorization"] as string) || "";
    const body = (req.body as Buffer).toString("utf8");
    const event = await verifyWebhookEvent(body, authHeader);

    const roomName = event.room?.name;
    if (!roomName) return res.status(200).json({ received: true });

    if (event.event === "room_started") {
      await LiveClass.updateOne({ roomName, startedAt: null }, { startedAt: new Date() });
    }

    if (event.event === "room_finished") {
      await LiveClass.updateOne(
        { roomName, status: { $ne: "COMPLETED" } },
        { status: "COMPLETED", endedAt: new Date() }
      );
    }

    if (event.event === "participant_joined" && event.participant) {
      const liveClass = await LiveClass.findOne({ roomName });
      const identity = event.participant.identity;
      if (liveClass && mongoose.isValidObjectId(identity)) {
        const student = await User.findOne({ _id: identity, role: "STUDENT" }).select("_id");
        if (student) {
          await LiveClassAttendance.create({
            liveClass: liveClass._id,
            student: student._id,
            identity,
            joinedAt: new Date(),
          });
        }
      }
    }

    if (event.event === "participant_left" && event.participant) {
      const liveClass = await LiveClass.findOne({ roomName });
      if (liveClass) {
        await LiveClassAttendance.findOneAndUpdate(
          { liveClass: liveClass._id, identity: event.participant.identity, leftAt: null },
          { leftAt: new Date() },
          { sort: { joinedAt: -1 } }
        );
      }
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("LiveKit webhook error:", error.message);
    res.status(400).json({ success: false, error: "Invalid webhook request" });
  }
};
