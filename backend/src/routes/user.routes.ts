import { Router } from "express";
import { getCurrentUser, getUsers, updateUserSubscription, updateUserStatus, updateUserSettings, updateUserRole, updateUserAccessDates, deleteUser, bulkDeleteUsers } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/me", authenticate, getCurrentUser);
router.put("/me/settings", authenticate, updateUserSettings);


// Admin Routes
router.get("/", authenticate, requireAdmin(), getUsers);
router.post("/bulk-delete", authenticate, requireAdmin(), bulkDeleteUsers);
router.put("/:id/subscription", authenticate, requireAdmin(), updateUserSubscription);
router.put("/:id/status", authenticate, requireAdmin(), updateUserStatus);
router.put("/:id/role", authenticate, requireAdmin(), updateUserRole);
router.put("/:id/access-dates", authenticate, requireAdmin(), updateUserAccessDates);
router.delete("/:id", authenticate, requireAdmin(), deleteUser);

export default router;
