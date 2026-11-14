import express from "express";
import {
  completeGoogleDriveConnection,
  getGoogleDriveStatus,
  removeGoogleDriveConnection,
  startGoogleDriveConnection,
} from "../controllers/google-drive.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = express.Router();

router.get("/google-drive/callback", completeGoogleDriveConnection);
router.get(
  "/google-drive/status",
  authenticate,
  requireAdmin(),
  getGoogleDriveStatus,
);
router.post(
  "/google-drive/connect",
  authenticate,
  requireAdmin(),
  startGoogleDriveConnection,
);
router.delete(
  "/google-drive",
  authenticate,
  requireAdmin(),
  removeGoogleDriveConnection,
);

export default router;
