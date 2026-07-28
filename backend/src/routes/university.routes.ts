import { Router } from "express";
import { authenticate, isAdmin } from "../middleware/auth.middleware";
import { getAllUniversities, syncUniversities } from "../controllers/university.controller";

const router = Router();

router.get("/", getAllUniversities);
router.put("/sync", authenticate, isAdmin, syncUniversities);

export default router;
