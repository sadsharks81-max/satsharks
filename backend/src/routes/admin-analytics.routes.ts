import { Router } from "express";
import { getAdminOverview } from "../controllers/admin-analytics.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/overview", authenticate, requireAdmin(), getAdminOverview);

export default router;
