"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateInquiryStatus = exports.getInquiries = exports.submitInquiry = void 0;
const Inquiry_1 = __importDefault(require("../models/Inquiry"));
const Notification_1 = __importDefault(require("../models/Notification"));
const User_1 = __importDefault(require("../models/User"));
const env_1 = require("../config/env");
const submitInquiry = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { firstName, lastName, email, category, message } = req.body;
        if (!env_1.env.isDatabaseConfigured && env_1.env.allowMockAuth) {
            // Mock mode: just return success
            return res.status(201).json({ success: true, message: "Inquiry submitted successfully (mock)" });
        }
        if (!env_1.env.isDatabaseConfigured) {
            return res.status(503).json({ success: false, error: "Database is not configured" });
        }
        const inquiry = await Inquiry_1.default.create({
            user: userId,
            firstName, lastName, email, category, message
        });
        // Notify all admins
        const admins = await User_1.default.find({ role: "ADMIN" });
        const notifications = admins.map(admin => ({
            user: admin._id,
            type: "CONTACT_INQUIRY",
            title: "New Contact Inquiry",
            message: `You received an inquiry from ${email} (${firstName} ${lastName}). Category: ${category}`,
        }));
        if (notifications.length > 0) {
            await Notification_1.default.insertMany(notifications);
        }
        res.status(201).json({ success: true, message: "Inquiry submitted successfully", inquiryId: inquiry.id });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.submitInquiry = submitInquiry;
const getInquiries = async (req, res) => {
    try {
        if (!process.env.DATABASE_URL) {
            return res.status(200).json({ success: true, inquiries: [] });
        }
        const inquiries = await Inquiry_1.default.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, inquiries });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.getInquiries = getInquiries;
const updateInquiryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminReply } = req.body;
        if (!process.env.DATABASE_URL) {
            return res.status(200).json({ success: true, message: "Status updated (mock)" });
        }
        const updateData = { status };
        if (adminReply !== undefined) {
            updateData.adminReply = adminReply;
            // If admin replies, we can auto set status to RESOLVED or IN_PROGRESS
            if (adminReply && status === "NEW") {
                updateData.status = "RESOLVED";
            }
        }
        const inquiry = await Inquiry_1.default.findByIdAndUpdate(id, updateData, { new: true });
        if (!inquiry)
            return res.status(404).json({ success: false, error: "Inquiry not found" });
        // Notify user if admin replied
        if (adminReply && inquiry.user) {
            await Notification_1.default.create({
                user: inquiry.user,
                type: "ADMIN_REPLY",
                title: "Admin Replied to Your Inquiry",
                message: adminReply,
            });
        }
        res.status(200).json({ success: true, inquiry });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
exports.updateInquiryStatus = updateInquiryStatus;
