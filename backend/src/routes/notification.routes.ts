import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireActiveUser } from "../middleware/role.middleware";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from "../controllers/notification.controller";

const router = Router();

router.get("/my", authenticate, requireActiveUser(), getMyNotifications);
router.put("/read-all", authenticate, requireActiveUser(), markAllAsRead);
router.delete("/clear-all", authenticate, requireActiveUser(), clearAllNotifications);
router.put("/:id/read", authenticate, requireActiveUser(), markAsRead);

export default router;
