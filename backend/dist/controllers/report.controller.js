"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveReport = exports.getReportCount = exports.getReportById = exports.getReports = exports.createReport = void 0;
const ReportedIssue_1 = require("../models/ReportedIssue");
const createReport = async (req, res) => {
    try {
        const { questionId, testContext, reason } = req.body;
        if (!questionId || !reason) {
            return res.status(400).json({ success: false, error: "Question ID and reason are required" });
        }
        const report = await ReportedIssue_1.ReportedIssue.create({
            question: questionId,
            reportedBy: req.user?.userId,
            testContext,
            reason,
            status: "OPEN"
        });
        res.status(201).json({ success: true, report });
    }
    catch (error) {
        console.error("Error creating report:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.createReport = createReport;
const getReports = async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status)
            query.status = status;
        const reports = await ReportedIssue_1.ReportedIssue.find(query)
            .populate("question")
            .populate("reportedBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, reports });
    }
    catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getReports = getReports;
const getReportById = async (req, res) => {
    try {
        const report = await ReportedIssue_1.ReportedIssue.findById(req.params.id)
            .populate("question")
            .populate("reportedBy", "name email");
        if (!report)
            return res.status(404).json({ success: false, error: "Report not found" });
        res.status(200).json({ success: true, report });
    }
    catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getReportById = getReportById;
const getReportCount = async (req, res) => {
    try {
        const count = await ReportedIssue_1.ReportedIssue.countDocuments({ status: "OPEN" });
        res.status(200).json({ success: true, count });
    }
    catch (error) {
        console.error("Error fetching report count:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.getReportCount = getReportCount;
const resolveReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await ReportedIssue_1.ReportedIssue.findByIdAndUpdate(id, {
            status: "RESOLVED",
            resolvedAt: new Date(),
            resolvedBy: req.user?.userId,
        }, { new: true });
        if (!report) {
            return res.status(404).json({ success: false, error: "Report not found" });
        }
        res.status(200).json({ success: true, report });
    }
    catch (error) {
        console.error("Error resolving report:", error);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
exports.resolveReport = resolveReport;
