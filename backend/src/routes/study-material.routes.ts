import { Router } from "express";
import { deleteStudyMaterial, getStudyMaterials, streamStudyMaterial, uploadStudyMaterial } from "../controllers/study-material.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdminOrTeacher } from "../middleware/role.middleware";
import { studyMaterialUpload as upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", authenticate, getStudyMaterials);
router.post("/", authenticate, requireAdminOrTeacher(), upload.single("file"), uploadStudyMaterial);
router.get("/:id/file", authenticate, streamStudyMaterial);
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteStudyMaterial);

export default router;
