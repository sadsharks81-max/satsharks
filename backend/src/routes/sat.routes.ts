import { Router } from "express";
import {
  getSATTests,
  startSATTest,
  saveSATProgress,
  completeModule,
  endBreak,
  submitSATTest,
  getSATAttempt,
  getMySATAttempts,
  getAllSATTestsAdmin,
  updateSATTestAdmin,
  deleteSATTestAdmin,
} from "../controllers/sat.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin, requireActiveUser } from "../middleware/role.middleware";

const router = Router();

// Student routes
router.get("/", authenticate, requireActiveUser(), getSATTests);
router.get("/attempts", authenticate, getMySATAttempts);
router.get("/attempt/:id", authenticate, getSATAttempt);
router.post("/:id/start", authenticate, requireActiveUser(), startSATTest);
router.post("/attempt/:id/save", authenticate, saveSATProgress);
router.post("/attempt/:id/complete-module", authenticate, completeModule);
router.post("/attempt/:id/end-break", authenticate, endBreak);
router.post("/attempt/:id/submit", authenticate, submitSATTest);

// Admin routes
router.get("/admin/all", authenticate, requireAdmin(), getAllSATTestsAdmin);
router.put("/admin/:id", authenticate, requireAdmin(), updateSATTestAdmin);
router.delete("/admin/:id", authenticate, requireAdmin(), deleteSATTestAdmin);

export default router;
