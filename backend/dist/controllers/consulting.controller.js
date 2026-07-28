"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConsultingRequest = exports.getAllConsultingRequests = exports.getMyConsultingRequests = exports.submitConsultingRequest = void 0;
const ConsultingRequest_1 = __importDefault(require("../models/ConsultingRequest"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const submitConsultingRequest = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const { level, secondaryType, secondaryObtained, secondaryTotal, secondaryGrades, higherType, higherObtained, higherTotal, higherGrades, gpa, satScore, gradeYear, targetUniversities, selectedScholarship, extracurriculars, budgetRange } = req.body;
        // Check usage limits
        const existingRequests = await ConsultingRequest_1.default.countDocuments({ student: userId });
        if (req.user?.subscription === "FREE" && existingRequests >= 1) {
            return res.status(403).json({
                success: false,
                error: "FREE users are limited to 1 consulting request. Please upgrade to a PAID plan for unlimited requests.",
            });
        }
        const request = new ConsultingRequest_1.default({
            student: userId,
            level,
            secondaryType,
            secondaryObtained,
            secondaryTotal,
            secondaryGrades,
            higherType,
            higherObtained,
            higherTotal,
            higherGrades,
            gpa,
            satScore,
            gradeYear,
            targetUniversities,
            selectedScholarship,
            extracurriculars,
            budgetRange,
        });
        await request.save();
        // Notify user
        await Notification_1.default.create({
            user: userId,
            type: "CONSULTING_SUBMITTED",
            title: "Consulting Profile Submitted",
            message: "Your application sent successfully to the admin for review.",
        });
        // Notify all admins
        const studentUser = await User_1.default.findById(userId);
        const studentName = studentUser?.name || "A student";
        const admins = await User_1.default.find({ role: "ADMIN" });
        const adminNotifications = admins.map(admin => ({
            user: admin._id,
            type: "CONSULTING_SUBMITTED",
            title: "New Consulting Request",
            message: `${studentName} submitted a profile for college counseling. Click to review.`,
        }));
        if (adminNotifications.length > 0) {
            await Notification_1.default.insertMany(adminNotifications);
        }
        return res.status(201).json({ success: true, data: request });
    }
    catch (error) {
        console.error("Submit Consulting Request Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.submitConsultingRequest = submitConsultingRequest;
const getMyConsultingRequests = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const requests = await ConsultingRequest_1.default.find({ student: userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: requests });
    }
    catch (error) {
        console.error("Get My Consulting Requests Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getMyConsultingRequests = getMyConsultingRequests;
const getAllConsultingRequests = async (req, res) => {
    try {
        const requests = await ConsultingRequest_1.default.find()
            .populate("student", "name email")
            .sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: requests });
    }
    catch (error) {
        console.error("Get All Consulting Requests Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getAllConsultingRequests = getAllConsultingRequests;
const updateConsultingRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;
        const request = await ConsultingRequest_1.default.findByIdAndUpdate(id, { status, adminNotes }, { new: true });
        if (!request) {
            return res.status(404).json({ success: false, error: "Request not found" });
        }
        return res.status(200).json({ success: true, data: request });
    }
    catch (error) {
        console.error("Update Consulting Request Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.updateConsultingRequest = updateConsultingRequest;
