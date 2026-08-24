import { Response } from "express";
import { ReportedIssue } from "../models/ReportedIssue";
import { AuthRequest } from "../middleware/auth.middleware";
import { asFilterString, getPagination } from "../utils/query";

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
    // Constrained to the schema's enum so `?status[$ne]=RESOLVED` cannot inject
    // a query operator.
    const status = asFilterString(req.query.status);
    const query: Record<string, unknown> = {};
    if (status) query.status = status;

    const { limit, skip } = getPagination(req.query, 200, 500);
    const reports = await ReportedIssue.find(query)
      .populate("question")
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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

export const deleteResolvedReport = async (req: AuthRequest, res: Response) => {
  try {
    const report = await ReportedIssue.findById(req.params.id).select("status");
    if (!report) return res.status(404).json({ success: false, error: "Report not found" });
    if (report.status !== "RESOLVED") {
      return res.status(409).json({
        success: false,
        error: "Only resolved issues can be deleted. Resolve this issue first.",
      });
    }

    await report.deleteOne();
    res.status(200).json({ success: true, message: "Resolved issue deleted." });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};
