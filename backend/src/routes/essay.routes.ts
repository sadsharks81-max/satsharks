import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireActiveUser } from "../middleware/role.middleware";
import {
  submitEssay,
  getMyEssays,
  getAllEssays,
  updateEssay,
  deleteEssay,
} from "../controllers/essay.controller";

const router = Router();

router.post("/submit", authenticate, requireActiveUser(), submitEssay);
router.get("/my", authenticate, requireActiveUser(), getMyEssays);

router.get("/admin/all", authenticate, requireAdmin(), getAllEssays);
router.put("/admin/:id", authenticate, requireAdmin(), updateEssay);
router.delete("/admin/:id", authenticate, requireAdmin(), deleteEssay);

export default router;
