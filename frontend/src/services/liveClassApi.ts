import { api } from "./api";

export interface JoinTokenResponse {
  success: boolean;
  token?: string;
  url?: string;
  roomName?: string;
  error?: string;
  waiting?: boolean;
  upgradeRequired?: boolean;
}

export interface ChatMessage {
  _id: string;
  liveClass: string;
  sender: string;
  senderName: string;
  senderRole: "ADMIN" | "STUDENT" | "TEACHER";
  text: string;
  deleted: boolean;
  createdAt: string;
}

export interface WhiteboardStroke {
  strokeId: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
  tool: "PEN" | "ERASER";
  createdAt?: string;
}

export interface ClassroomPoll {
  _id: string;
  question: string;
  options: { id: string; text: string }[];
  status: "ACTIVE" | "CLOSED";
  counts: Record<string, number>;
  responseCount: number;
  selectedOptionId: string | null;
  createdAt: string;
  closedAt?: string | null;
}

export type RecordingStatus = "NONE" | "STARTING" | "ACTIVE" | "PROCESSING" | "READY" | "FAILED";

export interface ClassRecording {
  status: RecordingStatus;
  driveUrl?: string | null;
  error?: string | null;
}

export const liveClassApi = {
  getToken: (classId: string): Promise<JoinTokenResponse> =>
    api.post(`/api/live-classes/${classId}/token`, {}),

  getParticipantCount: (classId: string): Promise<{ success: boolean; count: number }> =>
    api.get(`/api/live-classes/${classId}/participants`),

  muteParticipant: (classId: string, identity: string, muted: boolean) =>
    api.post(`/api/live-classes/${classId}/participants/${identity}/mute`, { muted }),

  removeParticipant: (classId: string, identity: string) =>
    api.post(`/api/live-classes/${classId}/participants/${identity}/remove`, {}),

  getChatHistory: (classId: string): Promise<{ success: boolean; messages: ChatMessage[] }> =>
    api.get(`/api/live-classes/${classId}/chat`),

  postChatMessage: (
    classId: string,
    text: string,
  ): Promise<{ success: boolean; message: ChatMessage }> =>
    api.post(`/api/live-classes/${classId}/chat`, { text }),

  deleteChatMessage: (classId: string, messageId: string) =>
    api.delete(`/api/live-classes/${classId}/chat/${messageId}`),

  getWhiteboard: (
    classId: string,
  ): Promise<{ success: boolean; strokes: WhiteboardStroke[]; error?: string }> =>
    api.get(`/api/live-classes/${classId}/whiteboard`),

  addWhiteboardStroke: (
    classId: string,
    stroke: WhiteboardStroke,
  ): Promise<{ success: boolean; stroke: WhiteboardStroke; error?: string }> =>
    api.post(`/api/live-classes/${classId}/whiteboard/strokes`, stroke),

  clearWhiteboard: (classId: string) => api.delete(`/api/live-classes/${classId}/whiteboard`),

  getPolls: (
    classId: string,
  ): Promise<{ success: boolean; polls: ClassroomPoll[]; error?: string }> =>
    api.get(`/api/live-classes/${classId}/polls`),

  createPoll: (
    classId: string,
    question: string,
    options: string[],
  ): Promise<{ success: boolean; poll: ClassroomPoll; error?: string }> =>
    api.post(`/api/live-classes/${classId}/polls`, { question, options }),

  voteOnPoll: (
    classId: string,
    pollId: string,
    optionId: string,
  ): Promise<{ success: boolean; poll: ClassroomPoll; error?: string }> =>
    api.put(`/api/live-classes/${classId}/polls/${pollId}/vote`, { optionId }),

  closePoll: (
    classId: string,
    pollId: string,
  ): Promise<{ success: boolean; poll: ClassroomPoll; error?: string }> =>
    api.put(`/api/live-classes/${classId}/polls/${pollId}/close`, {}),

  getRecording: (
    classId: string,
  ): Promise<{ success: boolean; recording: ClassRecording; error?: string }> =>
    api.get(`/api/live-classes/${classId}/recording`),

  startRecording: (
    classId: string,
  ): Promise<{ success: boolean; recording?: ClassRecording; error?: string }> =>
    api.post(`/api/live-classes/${classId}/recording/start`, {}),

  stopRecording: (
    classId: string,
  ): Promise<{ success: boolean; recording?: ClassRecording; error?: string }> =>
    api.post(`/api/live-classes/${classId}/recording/stop`, {}),
};
