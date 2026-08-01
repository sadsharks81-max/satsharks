import { Router } from "express";
import { getStudyMaterials, uploadStudyMaterial, deleteStudyMaterial } from "../controllers/study-material.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdminOrTeacher } from "../middleware/role.middleware";
import { studyMaterialUpload as upload } from "../middleware/upload.middleware";

const router = Router();

router.get("/", authenticate, getStudyMaterials);
router.post("/", authenticate, requireAdminOrTeacher(), upload.single("file"), uploadStudyMaterial);
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteStudyMaterial);

export default router;
