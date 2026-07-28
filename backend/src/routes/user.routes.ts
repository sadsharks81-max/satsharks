import { Router } from "express";
import { getCurrentUser, getUsers, updateUserSubscription, updateUserStatus, updateUserSettings, updateUserRole } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/me/settings", authenticate, updateUserSettings);


// Admin Routes
router.get("/", authenticate, requireAdmin(), getUsers);
router.put("/:id/subscription", authenticate, requireAdmin(), updateUserSubscription);
router.put("/:id/status", authenticate, requireAdmin(), updateUserStatus);
router.put("/:id/role", authenticate, requireAdmin(), updateUserRole);

export default router;
