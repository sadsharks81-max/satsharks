import { Router } from "express";
import multer from "multer";
import path from "path";
import { uploadPracticeTest, getUploads, getUpload, triggerExtraction, reviewUpload, publishUpload, deleteUpload, uploadImage } from "../controllers/upload.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

const memoryStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: memoryStorage,
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PNG, JPG, JPEG, WEBP, and GIF images are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

const router = Router();

router.get("/", authenticate, requireAdmin(), getUploads);
router.get("/:id", authenticate, requireAdmin(), getUpload);
router.post("/practice-test", authenticate, requireAdmin(), upload.single("file"), uploadPracticeTest);
router.post("/image", authenticate, requireAdmin(), imageUpload.single("image"), uploadImage);
router.post("/:id/extract", authenticate, requireAdmin(), triggerExtraction);
router.put("/:id/review", authenticate, requireAdmin(), reviewUpload);
router.post("/:id/publish", authenticate, requireAdmin(), publishUpload);
router.delete("/:id", authenticate, requireAdmin(), deleteUpload);

export default router;
