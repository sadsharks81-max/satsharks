"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.liveKitWebhook = exports.deleteChatMessage = exports.postChatMessage = exports.getChatHistory = exports.removeParticipantFromClass = exports.muteParticipant = exports.getLiveClassParticipants = exports.generateJoinToken = exports.deleteLiveClass = exports.updateLiveClassStatus = exports.getLiveClassById = exports.getLiveClasses = exports.createLiveClass = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const LiveClass_1 = __importDefault(require("../models/LiveClass"));
const LiveClassChatMessage_1 = __importDefault(require("../models/LiveClassChatMessage"));
const LiveClassAttendance_1 = __importDefault(require("../models/LiveClassAttendance"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const livekit_service_1 = require("../services/livekit.service");
const MIN_TOKEN_TTL_SECONDS = 5 * 60;
const MAX_TOKEN_TTL_SECONDS = 4 * 60 * 60;
const JOIN_GRACE_MINUTES = 15; // how long after scheduled end a class can still be joined
const handleServiceError = (res, error) => {
    if (error instanceof livekit_service_1.LiveKitNotConfiguredError) {
        return res.status(503).json({ success: false, error: error.message });
    }
    return res.status(500).json({ success: false, error: error.message || "Server Error" });
};
// Create a new online class session
const createLiveClass = async (req, res) => {
    try {
        const { title, description, scheduledAt, duration, teacherId, maxStudents } = req.body;
        if (!title || !scheduledAt || !teacherId) {
            return res.status(400).json({ success: false, error: "Title, scheduled time, and teacher are required" });
        }
        // Pre-generate the _id so roomName (the LiveKit room identifier) can be set in the same insert.
        const _id = new mongoose_1.default.Types.ObjectId();
        const newClass = await LiveClass_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.createLiveClass = createLiveClass;
// Get all class sessions (with filter for roles)
const getLiveClasses = async (req, res) => {
    try {
        const role = req.user?.role;
        const userId = req.user?.userId;
        let query = {};
        if (role === "STUDENT") {
            // Students see every scheduled/live/completed class (no roster system) - Join is gated by subscription.
            query.status = { $in: ["SCHEDULED", "LIVE", "COMPLETED"] };
        }
        else if (role === "TEACHER") {
            // Teachers only see their assigned classes
            query.teacher = userId;
        }
        // Admins see all classes
        const classes = await LiveClass_1.default.find(query)
            .populate("teacher", "name email")
            .populate("createdBy", "name email")
            .sort({ scheduledAt: -1 });
        res.status(200).json({ success: true, classes });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getLiveClasses = getLiveClasses;
// Get single live class details
const getLiveClassById = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id)
            .populate("teacher", "name email")
            .populate("createdBy", "name email");
        if (!liveClass) {
            return res.status(404).json({ success: false, error: "Class session not found" });
        }
        res.status(200).json({ success: true, liveClass });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getLiveClassById = getLiveClassById;
// Update live class status (e.g., start class or complete class)
const updateLiveClassStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["SCHEDULED", "LIVE", "COMPLETED", "CANCELLED"].includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }
        const liveClass = await LiveClass_1.default.findById(req.params.id);
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
            await (0, livekit_service_1.ensureRoomExists)(liveClass.roomName, liveClass.maxStudents);
            liveClass.startedAt = new Date();
        }
        if (status === "COMPLETED" && liveClass.status !== "COMPLETED") {
            await (0, livekit_service_1.deleteRoomIfExists)(liveClass.roomName);
            liveClass.endedAt = new Date();
        }
        liveClass.status = status;
        await liveClass.save();
        res.status(200).json({ success: true, liveClass });
    }
    catch (error) {
        handleServiceError(res, error);
    }
};
exports.updateLiveClassStatus = updateLiveClassStatus;
// Delete a class session
const deleteLiveClass = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass) {
            return res.status(404).json({ success: false, error: "Class session not found" });
        }
        // Only creator/teacher/admin can delete
        if (req.user?.role !== "ADMIN" && String(liveClass.createdBy) !== String(req.user?.userId)) {
            return res.status(403).json({ success: false, error: "Unauthorized to delete this class" });
        }
        if (env_1.env.isLiveKitConfigured) {
            await (0, livekit_service_1.deleteRoomIfExists)(liveClass.roomName);
        }
        await LiveClass_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Class deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteLiveClass = deleteLiveClass;
// Issue a scoped LiveKit access token for the requesting user to join this class's room.
const generateJoinToken = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
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
            const opensAt = new Date(liveClass.scheduledAt.getTime() - livekit_service_1.JOIN_BUFFER_MINUTES * 60000);
            const closesAt = new Date(liveClass.scheduledAt.getTime() + (liveClass.duration + JOIN_GRACE_MINUTES) * 60000);
            if (now < opensAt || now > closesAt) {
                return res.status(403).json({ success: false, error: "This class is not within its scheduled join window." });
            }
            if (liveClass.status !== "LIVE") {
                return res.status(409).json({ success: false, error: "Waiting for the teacher to start the class.", waiting: true });
            }
            const participants = await (0, livekit_service_1.listRoomParticipants)(liveClass.roomName);
            if (participants.length >= liveClass.maxStudents) {
                return res.status(403).json({ success: false, error: "This class has reached its maximum number of students." });
            }
        }
        if ((role === "TEACHER" || role === "ADMIN") && liveClass.status !== "LIVE" && liveClass.status !== "SCHEDULED") {
            return res.status(409).json({ success: false, error: "This class is not currently active." });
        }
        // Room may not exist yet if a teacher/admin is joining ahead of "Start Class" - create it defensively.
        await (0, livekit_service_1.ensureRoomExists)(liveClass.roomName, liveClass.maxStudents);
        const user = await User_1.default.findById(userId).select("name");
        const ttlSeconds = Math.min(MAX_TOKEN_TTL_SECONDS, Math.max(MIN_TOKEN_TTL_SECONDS, Math.round((liveClass.scheduledAt.getTime() + (liveClass.duration + JOIN_GRACE_MINUTES) * 60000 - Date.now()) / 1000)));
        const token = await (0, livekit_service_1.issueRoomToken)({
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
        res.status(200).json({ success: true, token, url: env_1.env.livekitUrl, roomName: liveClass.roomName });
    }
    catch (error) {
        handleServiceError(res, error);
    }
};
exports.generateJoinToken = generateJoinToken;
// Lightweight participant count, used by dashboard cards for "Students Joined" - only meaningful once LIVE.
const getLiveClassParticipants = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass) {
            return res.status(404).json({ success: false, error: "Class session not found" });
        }
        if (liveClass.status !== "LIVE") {
            return res.status(200).json({ success: true, count: 0 });
        }
        const participants = await (0, livekit_service_1.listRoomParticipants)(liveClass.roomName);
        res.status(200).json({ success: true, count: participants.length });
    }
    catch (error) {
        handleServiceError(res, error);
    }
};
exports.getLiveClassParticipants = getLiveClassParticipants;
const assertModeratorAccess = async (req, liveClass) => {
    const role = req.user?.role;
    if (role === "ADMIN")
        return true;
    if (role === "TEACHER" && String(liveClass.teacher) === String(req.user?.userId))
        return true;
    return false;
};
const muteParticipant = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass)
            return res.status(404).json({ success: false, error: "Class session not found" });
        if (!(await assertModeratorAccess(req, liveClass))) {
            return res.status(403).json({ success: false, error: "Only the teacher or an admin can do this" });
        }
        const { muted } = req.body;
        await (0, livekit_service_1.muteRoomParticipant)(liveClass.roomName, String(req.params.identity), Boolean(muted));
        res.status(200).json({ success: true });
    }
    catch (error) {
        handleServiceError(res, error);
    }
};
exports.muteParticipant = muteParticipant;
const removeParticipantFromClass = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass)
            return res.status(404).json({ success: false, error: "Class session not found" });
        if (!(await assertModeratorAccess(req, liveClass))) {
            return res.status(403).json({ success: false, error: "Only the teacher or an admin can do this" });
        }
        await (0, livekit_service_1.removeRoomParticipant)(liveClass.roomName, String(req.params.identity));
        res.status(200).json({ success: true });
    }
    catch (error) {
        handleServiceError(res, error);
    }
};
exports.removeParticipantFromClass = removeParticipantFromClass;
// --- Chat ---
const getChatHistory = async (req, res) => {
    try {
        const messages = await LiveClassChatMessage_1.default.find({ liveClass: req.params.id })
            .sort({ createdAt: 1 })
            .limit(200);
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getChatHistory = getChatHistory;
const postChatMessage = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, error: "Message text is required" });
        }
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass)
            return res.status(404).json({ success: false, error: "Class session not found" });
        const user = await User_1.default.findById(req.user?.userId).select("name");
        const message = await LiveClassChatMessage_1.default.create({
            liveClass: liveClass._id,
            sender: req.user?.userId,
            senderName: user?.name || "Guest",
            senderRole: req.user?.role,
            text: text.trim().slice(0, 1000),
        });
        res.status(201).json({ success: true, message });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.postChatMessage = postChatMessage;
const deleteChatMessage = async (req, res) => {
    try {
        const liveClass = await LiveClass_1.default.findById(req.params.id);
        if (!liveClass)
            return res.status(404).json({ success: false, error: "Class session not found" });
        if (!(await assertModeratorAccess(req, liveClass))) {
            return res.status(403).json({ success: false, error: "Only the teacher or an admin can delete messages" });
        }
        const message = await LiveClassChatMessage_1.default.findOneAndUpdate({ _id: req.params.messageId, liveClass: liveClass._id }, { deleted: true }, { new: true });
        if (!message)
            return res.status(404).json({ success: false, error: "Message not found" });
        res.status(200).json({ success: true, message });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteChatMessage = deleteChatMessage;
// --- Webhook ---
// Mounted with express.raw() ahead of express.json() in server.ts, mirroring the Stripe webhook.
const liveKitWebhook = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"] || "";
        const body = req.body.toString("utf8");
        const event = await (0, livekit_service_1.verifyWebhookEvent)(body, authHeader);
        const roomName = event.room?.name;
        if (!roomName)
            return res.status(200).json({ received: true });
        if (event.event === "room_started") {
            await LiveClass_1.default.updateOne({ roomName, startedAt: null }, { startedAt: new Date() });
        }
        if (event.event === "room_finished") {
            await LiveClass_1.default.updateOne({ roomName, status: { $ne: "COMPLETED" } }, { status: "COMPLETED", endedAt: new Date() });
        }
        if (event.event === "participant_joined" && event.participant) {
            const liveClass = await LiveClass_1.default.findOne({ roomName });
            const identity = event.participant.identity;
            if (liveClass && mongoose_1.default.isValidObjectId(identity)) {
                const student = await User_1.default.findOne({ _id: identity, role: "STUDENT" }).select("_id");
                if (student) {
                    await LiveClassAttendance_1.default.create({
                        liveClass: liveClass._id,
                        student: student._id,
                        identity,
                        joinedAt: new Date(),
                    });
                }
            }
        }
        if (event.event === "participant_left" && event.participant) {
            const liveClass = await LiveClass_1.default.findOne({ roomName });
            if (liveClass) {
                await LiveClassAttendance_1.default.findOneAndUpdate({ liveClass: liveClass._id, identity: event.participant.identity, leftAt: null }, { leftAt: new Date() }, { sort: { joinedAt: -1 } });
            }
        }
        res.status(200).json({ received: true });
    }
    catch (error) {
        console.error("LiveKit webhook error:", error.message);
        res.status(400).json({ success: false, error: "Invalid webhook request" });
    }
};
exports.liveKitWebhook = liveKitWebhook;
