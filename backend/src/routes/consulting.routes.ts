import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireActiveUser } from "../middleware/role.middleware";
import {
  submitConsultingRequest,
  getMyConsultingRequests,
  getAllConsultingRequests,
  updateConsultingRequest,
} from "../controllers/consulting.controller";

const router = Router();

router.post("/submit", authenticate, requireActiveUser(), submitConsultingRequest);
router.get("/my", authenticate, requireActiveUser(), getMyConsultingRequests);

router.get("/admin/all", authenticate, requireAdmin(), getAllConsultingRequests);
router.put("/admin/:id", authenticate, requireAdmin(), updateConsultingRequest);

export default router;
