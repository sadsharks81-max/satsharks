import { Router } from "express";
import { getDashboardStats, getTestHistory, getUnifiedHistory, getPerformanceData, getCategoryBreakdown, getPredictedScore, getErrorAnalysis, getTimingAnalysis, getLeaderboard, getStudentProgressReports } from "../controllers/analytics.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireActiveUser, requireAdminOrTeacher } from "../middleware/role.middleware";

const router = Router();

router.get("/dashboard", authenticate, requireActiveUser(), getDashboardStats);
router.get("/history", authenticate, requireActiveUser(), getTestHistory);
router.get("/history/all", authenticate, requireActiveUser(), getUnifiedHistory);
router.get("/performance", authenticate, requireActiveUser(), getPerformanceData);
router.get("/category-breakdown", authenticate, requireActiveUser(), getCategoryBreakdown);
router.get("/predicted-score", authenticate, requireActiveUser(), getPredictedScore);
router.get("/error-analysis", authenticate, requireActiveUser(), getErrorAnalysis);
router.get("/timing-analysis", authenticate, requireActiveUser(), getTimingAnalysis);
router.get("/leaderboard", authenticate, requireActiveUser(), getLeaderboard);
router.get("/student-reports", authenticate, requireAdminOrTeacher(), getStudentProgressReports);


export default router;
