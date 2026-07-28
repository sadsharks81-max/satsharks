import { Request, Response } from "express";
import { ReportedIssue } from "../models/ReportedIssue";
import { AuthRequest } from "../middleware/auth.middleware";

export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { questionId, testContext, reason } = req.body;
    
    if (!questionId || !reason) {
      return res.status(400).json({ success: false, error: "Question ID and reason are required" });
    }

    const report = await ReportedIssue.create({
      question: questionId,
      reportedBy: req.user?.userId,
      testContext,
      reason,
      status: "OPEN"
    });

    res.status(201).json({ success: true, report });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;
    let query: any = {};
    if (status) query.status = status;

    const reports = await ReportedIssue.find(query)
      .populate("question")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reports });
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getReportById = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ReportedIssue.findById(req.params.id)
      .populate("question")
      .populate("reportedBy", "name email");
      
    if (!report) return res.status(404).json({ success: false, error: "Report not found" });
    
    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const getReportCount = async (req: AuthRequest, res: Response) => {
  try {
    const count = await ReportedIssue.countDocuments({ status: "OPEN" });
    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("Error fetching report count:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await ReportedIssue.findByIdAndUpdate(
      id,
      {
        status: "RESOLVED",
        resolvedAt: new Date(),
        resolvedBy: req.user?.userId,
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    res.status(200).json({ success: true, report });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
