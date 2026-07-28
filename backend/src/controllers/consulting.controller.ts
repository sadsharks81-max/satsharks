import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import ConsultingRequest from "../models/ConsultingRequest";
import Notification from "../models/Notification";
import User from "../models/User";

export const submitConsultingRequest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const { 
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
      budgetRange 
    } = req.body;

    // Check usage limits
    const existingRequests = await ConsultingRequest.countDocuments({ student: userId });
    if (req.user?.subscription === "FREE" && existingRequests >= 1) {
      return res.status(403).json({
        success: false,
        error: "FREE users are limited to 1 consulting request. Please upgrade to a PAID plan for unlimited requests.",
      });
    }

    const request = new ConsultingRequest({
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
    await Notification.create({
      user: userId,
      type: "CONSULTING_SUBMITTED",
      title: "Consulting Profile Submitted",
      message: "Your application sent successfully to the admin for review.",
    });

    // Notify all admins
    const studentUser = await User.findById(userId);
    const studentName = studentUser?.name || "A student";
    const admins = await User.find({ role: "ADMIN" });
    const adminNotifications = admins.map(admin => ({
      user: admin._id,
      type: "CONSULTING_SUBMITTED",
      title: "New Consulting Request",
      message: `${studentName} submitted a profile for college counseling. Click to review.`,
    }));
    if (adminNotifications.length > 0) {
      await Notification.insertMany(adminNotifications);
    }

    return res.status(201).json({ success: true, data: request });
  } catch (error: any) {
    console.error("Submit Consulting Request Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getMyConsultingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const requests = await ConsultingRequest.find({ student: userId }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: requests });
  } catch (error: any) {
    console.error("Get My Consulting Requests Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getAllConsultingRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await ConsultingRequest.find()
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: requests });
  } catch (error: any) {
    console.error("Get All Consulting Requests Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const updateConsultingRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const request = await ConsultingRequest.findByIdAndUpdate(
      id,
      { status, adminNotes },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, error: "Request not found" });
    }

    return res.status(200).json({ success: true, data: request });
  } catch (error: any) {
    console.error("Update Consulting Request Error:", error);
    return res.status(500).json({ success: false, error: "Server Error" });
  }
};
