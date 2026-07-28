import { Router } from "express";
import { getTests, getTest, createTest, updateTest, deleteTest, getAllTestsAdmin, startTest, submitTest, getAttempt } from "../controllers/test.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireActiveUser } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { testValidator, submitTestValidator } from "../validators/test.validator";

const router = Router();

// Student routes
router.get("/", authenticate, requireActiveUser(), getTests);
router.get("/attempt/:id", authenticate, getAttempt);
router.post("/:id/start", authenticate, requireActiveUser(), startTest);
router.put("/attempt/:id/submit", authenticate, submitTestValidator, validate, submitTest);

// Admin routes
router.get("/admin/all", authenticate, requireAdmin(), getAllTestsAdmin);
router.get("/:id", authenticate, getTest);
router.post("/", authenticate, requireAdmin(), testValidator, validate, createTest);
router.put("/:id", authenticate, requireAdmin(), updateTest);
router.delete("/:id", authenticate, requireAdmin(), deleteTest);

export default router;
