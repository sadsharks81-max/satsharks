"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllNotifications = exports.markAllAsRead = exports.markAsRead = exports.getMyNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        const notifications = await Notification_1.default.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50); // limit to recent 50
        return res.status(200).json({ success: true, data: notifications });
    }
    catch (error) {
        console.error("Get My Notifications Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getMyNotifications = getMyNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const notification = await Notification_1.default.findOneAndUpdate({ _id: id, user: userId }, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ success: false, error: "Notification not found" });
        }
        return res.status(200).json({ success: true, data: notification });
    }
    catch (error) {
        console.error("Mark Notification Read Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        await Notification_1.default.updateMany({ user: userId, isRead: false }, { isRead: true });
        return res.status(200).json({ success: true, message: "All notifications marked as read" });
    }
    catch (error) {
        console.error("Mark All Notifications Read Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.markAllAsRead = markAllAsRead;
const clearAllNotifications = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }
        await Notification_1.default.deleteMany({ user: userId });
        return res.status(200).json({ success: true, message: "All notifications cleared" });
    }
    catch (error) {
        console.error("Clear All Notifications Error:", error);
        return res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.clearAllNotifications = clearAllNotifications;
