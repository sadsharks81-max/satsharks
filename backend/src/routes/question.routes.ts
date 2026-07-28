import { Router } from "express";
import { getQuestions, getQuestion, createQuestion, updateQuestion, deleteQuestion, bulkCreateQuestions, getAllQuestionsAdmin } from "../controllers/question.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { questionValidator, bulkQuestionValidator } from "../validators/question.validator";

const router = Router();

router.get("/", authenticate, getQuestions);
router.get("/admin", authenticate, requireAdmin(), getAllQuestionsAdmin);
router.get("/:id", authenticate, getQuestion);
router.post("/", authenticate, requireAdmin(), questionValidator, validate, createQuestion);
router.post("/bulk", authenticate, requireAdmin(), bulkQuestionValidator, validate, bulkCreateQuestions);
router.put("/:id", authenticate, requireAdmin(), updateQuestion);
router.delete("/:id", authenticate, requireAdmin(), deleteQuestion);

export default router;
