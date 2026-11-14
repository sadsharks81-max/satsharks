import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  requireActiveUser,
  requireAdminOrTeacher,
} from "../middleware/role.middleware";
import {
  createLiveClass,
  getLiveClasses,
  getLiveClassById,
  updateLiveClassStatus,
  deleteLiveClass,
  generateJoinToken,
  getLiveClassParticipants,
  getRecordedLectures,
  muteParticipant,
  removeParticipantFromClass,
  getChatHistory,
  postChatMessage,
  createRecordingPlaybackSession,
  streamRecordedLecture,
  deleteChatMessage,
} from "../controllers/live-class.controller";
import {
  addWhiteboardStroke,
  abortRecordingUpload,
  clearWhiteboard,
  closePoll,
  createPoll,
  getPolls,
  getRecordingStatus,
  getWhiteboard,
  revealPollResults,
  startRecording,
  uploadRecordingChunk,
  voteOnPoll,
} from "../controllers/classroom-tools.controller";

const router = express.Router();

// Get list of classes (accessible to all logged in users, with role-based filtering inside)
router.get("/", authenticate, getLiveClasses);

// Recorded lectures must be declared before /:id so "recordings" is not treated as a class id.
router.get(
  "/recordings",
  authenticate,
  requireActiveUser(),
  getRecordedLectures,
);
router.post(
  "/recordings/:recordingId/playback-session",
  authenticate,
  requireActiveUser(),
  createRecordingPlaybackSession,
);
router.get("/recordings/:recordingId/stream", streamRecordedLecture);

// Get single class details
router.get("/:id", authenticate, getLiveClassById);

// Create class (only admins or teachers)
router.post("/", authenticate, requireAdminOrTeacher(), createLiveClass);

// Update status (only admins or teacher assigned to the class)
router.put(
  "/:id/status",
  authenticate,
  requireAdminOrTeacher(),
  updateLiveClassStatus,
);

// Delete class (only creator or admin)
router.delete("/:id", authenticate, requireAdminOrTeacher(), deleteLiveClass);

// Issue a LiveKit join token - role/paid/schedule/capacity checks happen inside the controller,
// since admin, teacher, and student all hit this same endpoint with different rules.
router.post("/:id/token", authenticate, requireActiveUser(), generateJoinToken);

// Live "Students Joined" count for dashboard cards
router.get("/:id/participants", authenticate, getLiveClassParticipants);

// Moderation (teacher of the class, or admin)
router.post(
  "/:id/participants/:identity/mute",
  authenticate,
  requireAdminOrTeacher(),
  muteParticipant,
);
router.post(
  "/:id/participants/:identity/remove",
  authenticate,
  requireAdminOrTeacher(),
  removeParticipantFromClass,
);

// Chat (persisted history backing LiveKit's realtime data channel)
router.get("/:id/chat", authenticate, getChatHistory);
router.post("/:id/chat", authenticate, postChatMessage);
router.delete(
  "/:id/chat/:messageId",
  authenticate,
  requireAdminOrTeacher(),
  deleteChatMessage,
);

// Shared whiteboard state, backed by LiveKit data-channel broadcasts on the client.
router.get("/:id/whiteboard", authenticate, requireActiveUser(), getWhiteboard);
router.post(
  "/:id/whiteboard/strokes",
  authenticate,
  requireActiveUser(),
  addWhiteboardStroke,
);
router.delete(
  "/:id/whiteboard",
  authenticate,
  requireAdminOrTeacher(),
  clearWhiteboard,
);

// Live polls. Any active participant may vote; only the assigned teacher/admin may create or close.
router.get("/:id/polls", authenticate, requireActiveUser(), getPolls);
router.post("/:id/polls", authenticate, requireAdminOrTeacher(), createPoll);
router.put(
  "/:id/polls/:pollId/vote",
  authenticate,
  requireActiveUser(),
  voteOnPoll,
);
router.put(
  "/:id/polls/:pollId/close",
  authenticate,
  requireAdminOrTeacher(),
  closePoll,
);
router.put(
  "/:id/polls/:pollId/reveal",
  authenticate,
  requireAdminOrTeacher(),
  revealPollResults,
);

// Teacher-browser screen recording, uploaded to Drive as a resumable stream.
router.get(
  "/:id/recording",
  authenticate,
  requireActiveUser(),
  getRecordingStatus,
);
router.post(
  "/:id/recording/start",
  authenticate,
  requireAdminOrTeacher(),
  startRecording,
);
router.put(
  "/:id/recording/uploads/:uploadId/chunk",
  authenticate,
  requireAdminOrTeacher(),
  express.raw({ type: "application/octet-stream", limit: "12mb" }),
  uploadRecordingChunk,
);
router.post(
  "/:id/recording/uploads/:uploadId/abort",
  authenticate,
  requireAdminOrTeacher(),
  abortRecordingUpload,
);

export default router;
