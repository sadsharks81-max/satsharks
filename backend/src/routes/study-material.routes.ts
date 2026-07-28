import { Router } from "express";
import multer from "multer";
import path from "path";
import { getStudyMaterials, uploadStudyMaterial, deleteStudyMaterial } from "../controllers/study-material.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdminOrTeacher } from "../middleware/role.middleware";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../uploads"),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `notes-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const router = Router();

router.get("/", authenticate, getStudyMaterials);
router.post("/", authenticate, requireAdminOrTeacher(), upload.single("file"), uploadStudyMaterial);
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteStudyMaterial);

export default router;
