import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import Essay from "../models/Essay";
import Notification from "../models/Notification";
import User from "../models/User";
import { appendEssayToSheet } from "../services/googleSheets.service";

export const submitEssay = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { type, targetUniversity, essayText, fileUrl } = req.body;

    // Check usage limits
    const existingEssaysCount = await Essay.countDocuments({ student: userId });
    
    if (req.user?.subscription === "FREE") {
      if (existingEssaysCount >= 2) {
        return res.status(403).json({
          success: false,
          error: "FREE users are limited to 2 essay reviews. Please upgrade to a PAID plan for more reviews.",
        });
      }
    } else {
      if (existingEssaysCount >= 7) {
        return res.status(403).json({
          success: false,
          error: "You have reached the maximum limit of 7 essay reviews.",
        });
      }
    }

    const essay = new Essay({
      student: userId,
      type,
      targetUniversity,
      essayText,
      fileUrl,
    });

    await essay.save();

    // Trigger Notification for essay submission
    await Notification.create({
      user: userId,
      type: "ESSAY_SUBMITTED",
      title: "Essay Submitted Successfully",
      message: "Your essay has been submitted and is currently pending review by our experts.",
    });

    // Notify all admins
    const studentUser = await User.findById(userId);
    const studentName = studentUser?.name || "A student";
    const admins = await User.find({ role: "ADMIN" });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      type: "ESSAY_SUBMITTED",
      title: "New Essay Review Request",
      message: `${studentName} submitted a request for essay review. Click to review.`,
    }));
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }

    // Backup to Google Sheets asynchronously in background
    appendEssayToSheet(
      studentUser?.name || "A student",
      studentUser?.email || "N/A",
      essayText || ""
    ).catch(err => console.error("Error backing up essay to Google Sheets:", err));

    return res.status(201).json({ success: true, data: essay });
  } catch (error: any) {
    console.error("Submit Essay Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getMyEssays = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const essays = await Essay.find({ student: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: essays });
  } catch (error: any) {
    console.error("Get My Essays Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getAllEssays = async (req: AuthRequest, res: Response) => {
  try {
    const essays = await Essay.find()
      .populate("student", "name email")
      .populate("reviewedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: essays });
  } catch (error: any) {
    console.error("Get All Essays Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const updateEssay = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminFeedback } = req.body;
    const adminId = req.user?.userId;

    const updateData: any = { status, adminFeedback };
    
    if (status === "REVIEWED") {
      updateData.reviewedBy = adminId;
      updateData.reviewedAt = new Date();
    }

    const essay = await Essay.findByIdAndUpdate(id, updateData, { new: true });

    if (!essay) {
      return res.status(404).json({ success: false, error: "Essay not found" });
    }

    if (status === "REVIEWED") {
      // Trigger Notification for essay review
      await Notification.create({
        user: essay.student,
        type: "ESSAY_REVIEWED",
        title: "Essay Review Completed",
        message: "Your essay has been reviewed by an expert. You can now read their feedback in your dashboard.",
      });
    }

    return res.status(200).json({ success: true, data: essay });
  } catch (error: any) {
    console.error("Update Essay Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const deleteEssay = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const essay = await Essay.findByIdAndDelete(id);

    if (!essay) {
      return res.status(404).json({ success: false, error: "Essay not found" });
    }

    return res.status(200).json({ success: true, message: "Essay deleted successfully" });
  } catch (error: any) {
    console.error("Delete Essay Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
