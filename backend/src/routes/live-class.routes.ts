import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import { requireActiveUser, requireAdminOrTeacher } from "../middleware/role.middleware";
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
import {
  addWhiteboardStroke,
  clearWhiteboard,
  closePoll,
  createPoll,
  getPolls,
  getRecordingStatus,
  getWhiteboard,
  startRecording,
  stopRecording,
  voteOnPoll,
} from "../controllers/classroom-tools.controller";

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
router.post("/:id/token", authenticate, requireActiveUser(), generateJoinToken);

// Live "Students Joined" count for dashboard cards
router.get("/:id/participants", authenticate, getLiveClassParticipants);

// Moderation (teacher of the class, or admin)
router.post("/:id/participants/:identity/mute", authenticate, requireAdminOrTeacher(), muteParticipant);
router.post("/:id/participants/:identity/remove", authenticate, requireAdminOrTeacher(), removeParticipantFromClass);

// Chat (persisted history backing LiveKit's realtime data channel)
router.get("/:id/chat", authenticate, getChatHistory);
router.post("/:id/chat", authenticate, postChatMessage);
router.delete("/:id/chat/:messageId", authenticate, requireAdminOrTeacher(), deleteChatMessage);

// Shared whiteboard state, backed by LiveKit data-channel broadcasts on the client.
router.get("/:id/whiteboard", authenticate, requireActiveUser(), getWhiteboard);
router.post("/:id/whiteboard/strokes", authenticate, requireActiveUser(), addWhiteboardStroke);
router.delete("/:id/whiteboard", authenticate, requireAdminOrTeacher(), clearWhiteboard);

// Live polls. Any active participant may vote; only the assigned teacher/admin may create or close.
router.get("/:id/polls", authenticate, requireActiveUser(), getPolls);
router.post("/:id/polls", authenticate, requireAdminOrTeacher(), createPoll);
router.put("/:id/polls/:pollId/vote", authenticate, requireActiveUser(), voteOnPoll);
router.put("/:id/polls/:pollId/close", authenticate, requireAdminOrTeacher(), closePoll);

// Server-side LiveKit recording and Drive delivery.
router.get("/:id/recording", authenticate, requireActiveUser(), getRecordingStatus);
router.post("/:id/recording/start", authenticate, requireAdminOrTeacher(), startRecording);
router.post("/:id/recording/stop", authenticate, requireAdminOrTeacher(), stopRecording);

export default router;
