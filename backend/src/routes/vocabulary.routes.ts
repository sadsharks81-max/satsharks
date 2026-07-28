import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireActiveUser, requireAdmin, requireStudent } from "../middleware/role.middleware";
import {
  createVocabularyWord,
  deleteVocabularyWord,
  getAdminVocabularyWords,
  getVocabularyGame,
  recordVocabularyAnswer,
  resetVocabularyProgress,
  updateVocabularyWord,
} from "../controllers/vocabulary.controller";

const router = Router();

router.get("/", authenticate, requireActiveUser(), requireStudent(), getVocabularyGame);
router.post("/answer", authenticate, requireActiveUser(), requireStudent(), recordVocabularyAnswer);
router.delete("/progress", authenticate, requireActiveUser(), requireStudent(), resetVocabularyProgress);

router.get("/admin", authenticate, requireAdmin(), getAdminVocabularyWords);
router.post("/admin", authenticate, requireAdmin(), createVocabularyWord);
router.put("/admin/:id", authenticate, requireAdmin(), updateVocabularyWord);
router.delete("/admin/:id", authenticate, requireAdmin(), deleteVocabularyWord);

export default router;
