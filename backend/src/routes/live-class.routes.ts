import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdminOrTeacher } from "../middleware/role.middleware";
import {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClassStatus,
  deleteLiveClass,
  generateJoinToken,
  getLiveClassParticipants,
  muteParticipant,
  removeParticipantFromClass,
  getChatHistory,
  postChatMessage,
  deleteChatMessage,
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

// Delete class (only creator or admin)
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteLiveClass);

// Issue a LiveKit join token - role/paid/schedule/capacity checks happen inside the controller,
// since admin, teacher, and student all hit this same endpoint with different rules.
router.post("/:id/token", authenticate, generateJoinToken);

// Live "Students Joined" count for dashboard cards
router.get("/:id/participants", authenticate, getLiveClassParticipants);

// Moderation (teacher of the class, or admin)
router.post("/:id/participants/:identity/mute", authenticate, requireAdminOrTeacher(), muteParticipant);
router.post("/:id/participants/:identity/remove", authenticate, requireAdminOrTeacher(), removeParticipantFromClass);

// Chat (persisted history backing LiveKit's realtime data channel)
router.get("/:id/chat", authenticate, getChatHistory);
router.post("/:id/chat", authenticate, postChatMessage);
router.delete("/:id/chat/:messageId", authenticate, requireAdminOrTeacher(), deleteChatMessage);

export default router;
