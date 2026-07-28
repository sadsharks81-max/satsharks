import { Request, Response } from "express";
import Inquiry from "../models/Inquiry";
import Notification from "../models/Notification";
import User from "../models/User";
import { env } from "../config/env";

export const submitInquiry = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { firstName, lastName, email, category, message } = req.body;

    if (!env.isDatabaseConfigured && env.allowMockAuth) {
      // Mock mode: just return success
      return res.status(201).json({ success: true, message: "Inquiry submitted successfully (mock)" });
    }

    if (!env.isDatabaseConfigured) {
      return res.status(503).json({ success: false, error: "Database is not configured" });
    }

    const inquiry = await Inquiry.create({ 
      user: userId,
      firstName, lastName, email, category, message 
    });

    // Notify all admins
    const admins = await User.find({ role: "ADMIN" });
    const notifications = admins.map(admin => ({
      user: admin._id,
      type: "CONTACT_INQUIRY",
      title: "New Contact Inquiry",
      message: `You received an inquiry from ${email} (${firstName} ${lastName}). Category: ${category}`,
    }));
    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ success: true, message: "Inquiry submitted successfully", inquiryId: inquiry.id });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getInquiries = async (req: Request, res: Response) => {
  try {
    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, inquiries: [] });
    }

    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, inquiries });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateInquiryStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminReply } = req.body;

    if (!process.env.DATABASE_URL) {
      return res.status(200).json({ success: true, message: "Status updated (mock)" });
    }

    const updateData: any = { status };
    if (adminReply !== undefined) {
      updateData.adminReply = adminReply;
      // If admin replies, we can auto set status to RESOLVED or IN_PROGRESS
      if (adminReply && status === "NEW") {
        updateData.status = "RESOLVED";
      }
    }

    const inquiry = await Inquiry.findByIdAndUpdate(id, updateData, { new: true });
    if (!inquiry) return res.status(404).json({ success: false, error: "Inquiry not found" });

    // Notify user if admin replied
    if (adminReply && inquiry.user) {
      await Notification.create({
        user: inquiry.user,
        type: "ADMIN_REPLY",
        title: "Admin Replied to Your Inquiry",
        message: adminReply,
      });
    }

    res.status(200).json({ success: true, inquiry });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
