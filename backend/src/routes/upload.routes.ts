import { Router } from "express";
import { uploadPracticeTest, uploadPracticeQuestions, getUploads, getUpload, triggerExtraction, reviewUpload, publishUpload, deleteUpload, uploadImage } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";
import {
  memoryImageUpload as imageUpload,
  practiceTestUpload as upload,
} from "../middleware/upload.middleware";

const router = Router();

router.get("/", authenticate, requireAdmin(), getUploads);
router.get("/:id", authenticate, requireAdmin(), getUpload);
router.post("/practice-test", authenticate, requireAdmin(), upload.single("file"), uploadPracticeTest);
router.post("/practice-questions", authenticate, requireAdmin(), upload.single("file"), uploadPracticeQuestions);
router.post("/image", authenticate, requireAdmin(), imageUpload.single("image"), uploadImage);
router.post("/:id/extract", authenticate, requireAdmin(), triggerExtraction);
router.put("/:id/review", authenticate, requireAdmin(), reviewUpload);
router.post("/:id/publish", authenticate, requireAdmin(), publishUpload);
router.delete("/:id", authenticate, requireAdmin(), deleteUpload);

export default router;
