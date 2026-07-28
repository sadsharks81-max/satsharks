import { Router } from "express";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../controllers/category.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { categoryValidator } from "../validators/category.validator";

const router = Router();

// public: allow frontend to fetch categories without auth
router.get("/", getCategories);
router.post("/", authenticate, requireAdmin(), categoryValidator, validate, createCategory);
router.put("/:id", authenticate, requireAdmin(), categoryValidator, validate, updateCategory);
router.delete("/:id", authenticate, requireAdmin(), deleteCategory);

export default router;
