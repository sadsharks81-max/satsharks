"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLiveClass = exports.updateLiveClassStatus = exports.getLiveClassById = exports.getLiveClasses = exports.createLiveClass = void 0;
const LiveClass_1 = __importDefault(require("../models/LiveClass"));
// Create a new online class session
const createLiveClass = async (req, res) => {
    try {
        const { title, description, scheduledAt, duration, teacherId } = req.body;
        if (!title || !scheduledAt || !teacherId) {
            return res.status(400).json({ success: false, error: "Title, scheduled time, and teacher are required" });
        }
        // Generate a unique clean Jitsi room name
        const randomSuffix = Math.floor(100000 + Math.random() * 900000);
        const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").substring(0, 20);
        const roomName = `satsharks-${cleanTitle || "class"}-${randomSuffix}`;
        const newClass = await LiveClass_1.default.create({
            title,
            description,
            scheduledAt: new Date(scheduledAt),
            duration: duration || 60,
            roomName,
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
            // Students only see SCHEDULED or LIVE classes
            query.status = { $in: ["SCHEDULED", "LIVE"] };
        }
        else if (role === "TEACHER") {
            // Teachers only see their assigned classes
            query.teacher = userId;
        }
        // Admins see all classes
        const classes = await LiveClass_1.default.find(query)
            .populate("teacher", "name email")
            .populate("createdBy", "name email")
            .sort({ scheduledAt: 1 });
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
        liveClass.status = status;
        await liveClass.save();
        res.status(200).json({ success: true, liveClass });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
        await LiveClass_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Class deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.deleteLiveClass = deleteLiveClass;
