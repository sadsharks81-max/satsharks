import express from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import {
  createReport,
  getReports,
  getReportCount,
  getReportById,
  resolveReport
} from "../controllers/report.controller";

const router = express.Router();

// Student routes
router.post("/", authenticate, createReport);

// Admin routes
router.get("/", authenticate, isAdmin, getReports);
router.get("/count", authenticate, isAdmin, getReportCount);
router.get("/:id", authenticate, isAdmin, getReportById);
router.put("/:id/resolve", authenticate, isAdmin, resolveReport);

export default router;
