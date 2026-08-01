import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { getHomepageStats, updateHomepageStats } from "../controllers/homepage-stats.controller";

const router = Router();

// GET /api/homepage-stats - Public
router.get("/", getHomepageStats);

// PUT /api/homepage-stats - Admin only
router.put("/", authenticate, requireAdmin(), updateHomepageStats);

export default router;
