import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdminOrTeacher } from "../middleware/role.middleware";
import {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClassStatus,
  updateMeetLink,
  deleteLiveClass,
} from "../controllers/live-class.controller";

const router = express.Router();

// Get list of classes (accessible to all logged in users, with role-based filtering inside)
router.get("/", authenticate, getLiveClasses);

// Get single class details
router.get("/:id", authenticate, getLiveClassById);

// Create class (only admins or teachers)
router.post("/", authenticate, requireAdminOrTeacher(), createLiveClass);

// Update status (only admins or teacher assigned to the class)
router.put("/:id/status", authenticate, requireAdminOrTeacher(), updateLiveClassStatus);

// Set/update the Google Meet link (only admins or teacher assigned to the class)
router.put("/:id/meet-link", authenticate, requireAdminOrTeacher(), updateMeetLink);

// Delete class (only creator or admin)
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteLiveClass);

export default router;
