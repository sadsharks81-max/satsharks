import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Notification from "../models/Notification";

export const getMyNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50); // limit to recent 50

    return res.status(200).json({ success: true, data: notifications });
  } catch (error: any) {
    console.error("Get My Notifications Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, error: "Notification not found" });
    }

    return res.status(200).json({ success: true, data: notification });
  } catch (error: any) {
    console.error("Mark Notification Read Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });

    return res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error: any) {
    console.error("Mark All Notifications Read Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const clearAllNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    await Notification.deleteMany({ user: userId });

    return res.status(200).json({ success: true, message: "All notifications cleared" });
  } catch (error: any) {
    console.error("Clear All Notifications Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
