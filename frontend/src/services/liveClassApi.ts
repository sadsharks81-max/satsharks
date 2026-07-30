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

export const liveClassApi = {
  getToken: (classId: string): Promise<JoinTokenResponse> => api.post(`/api/live-classes/${classId}/token`, {}),

  getParticipantCount: (classId: string): Promise<{ success: boolean; count: number }> =>
    api.get(`/api/live-classes/${classId}/participants`),

  muteParticipant: (classId: string, identity: string, muted: boolean) =>
    api.post(`/api/live-classes/${classId}/participants/${identity}/mute`, { muted }),

  removeParticipant: (classId: string, identity: string) =>
    api.post(`/api/live-classes/${classId}/participants/${identity}/remove`, {}),

  getChatHistory: (classId: string): Promise<{ success: boolean; messages: ChatMessage[] }> =>
    api.get(`/api/live-classes/${classId}/chat`),

  postChatMessage: (classId: string, text: string): Promise<{ success: boolean; message: ChatMessage }> =>
    api.post(`/api/live-classes/${classId}/chat`, { text }),

  deleteChatMessage: (classId: string, messageId: string) =>
    api.delete(`/api/live-classes/${classId}/chat/${messageId}`),
};
