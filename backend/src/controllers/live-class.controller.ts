import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import LiveClass from "../models/LiveClass";

const isValidHttpsUrl = (value: string): boolean => {
  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
};

// Create a new online class session
export const createLiveClass = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, scheduledAt, duration, teacherId, meetLink } = req.body;

    if (!title || !scheduledAt || !teacherId) {
      return res.status(400).json({ success: false, error: "Title, scheduled time, and teacher are required" });
    }

    if (meetLink && !isValidHttpsUrl(meetLink)) {
      return res.status(400).json({ success: false, error: "Google Meet link must be a valid https:// URL" });
    }

    const newClass = await LiveClass.create({
      title,
      description,
      scheduledAt: new Date(scheduledAt),
      duration: duration || 60,
      meetLink: meetLink || null,
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
      // Students only see SCHEDULED or LIVE classes
      query.status = { $in: ["SCHEDULED", "LIVE"] };
    } else if (role === "TEACHER") {
      // Teachers only see their assigned classes
      query.teacher = userId;
    }
    // Admins see all classes

    const classes = await LiveClass.find(query)
      .populate("teacher", "name email")
      .populate("createdBy", "name email")
      .sort({ scheduledAt: 1 });

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

    liveClass.status = status;
    await liveClass.save();

    res.status(200).json({ success: true, liveClass });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Set or update the Google Meet link for a class
export const updateMeetLink = async (req: AuthRequest, res: Response) => {
  try {
    const { meetLink } = req.body;

    if (!meetLink || !isValidHttpsUrl(meetLink)) {
      return res.status(400).json({ success: false, error: "A valid https:// Google Meet link is required" });
    }

    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass) {
      return res.status(404).json({ success: false, error: "Class session not found" });
    }

    // Security check: only teacher or admin can modify this class
    if (req.user?.role !== "ADMIN" && String(liveClass.teacher) !== String(req.user?.userId)) {
      return res.status(403).json({ success: false, error: "Unauthorized to update this class" });
    }

    liveClass.meetLink = meetLink;
    await liveClass.save();

    res.status(200).json({ success: true, liveClass });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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

    await LiveClass.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Class deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
