import { useEffect, useRef, useState } from "react";
import { useDataChannel } from "@livekit/components-react";
import { Icon } from "../../components/common/Icon";
import { liveClassApi, type ChatMessage } from "../../services/liveClassApi";
import { CHAT_TOPIC_MESSAGE, CHAT_TOPIC_DELETE } from "./chatTopics";

const QUICK_EMOJIS = ["\u{1F44D}", "\u{1F44F}", "\u{2764}\u{FE0F}", "\u{1F602}", "\u{1F914}", "\u{1F64C}"];

const decode = (payload: Uint8Array): any => {
  try {
    return JSON.parse(new TextDecoder().decode(payload));
  } catch {
    return null;
  }
};

const encode = (data: unknown) => new TextEncoder().encode(JSON.stringify(data));

interface ChatPanelProps {
  classId: string;
  currentUserId?: string;
  canModerate: boolean;
}

export function ChatPanel({ classId, currentUserId, canModerate }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    liveClassApi.getChatHistory(classId).then((res) => {
      if (res.success) setMessages(res.messages.filter((m) => !m.deleted));
      setLoading(false);
    });
  }, [classId]);

  const { send: broadcastMessage } = useDataChannel(CHAT_TOPIC_MESSAGE, (msg) => {
    const payload = decode(msg.payload);
    if (!payload?._id) return;
    setMessages((prev) => (prev.some((m) => m._id === payload._id) ? prev : [...prev, payload]));
  });

  const { send: broadcastDelete } = useDataChannel(CHAT_TOPIC_DELETE, (msg) => {
    const payload = decode(msg.payload);
    if (!payload?.messageId) return;
    setMessages((prev) => prev.filter((m) => m._id !== payload.messageId));
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    setText("");
    try {
      const res = await liveClassApi.postChatMessage(classId, trimmed);
      if (res.success) {
        setMessages((prev) => [...prev, res.message]);
        await broadcastMessage(encode(res.message), { reliable: true });
      }
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    setMessages((prev) => prev.filter((m) => m._id !== messageId));
    const res = await liveClassApi.deleteChatMessage(classId, messageId);
    if (res.success) {
      await broadcastDelete(encode({ messageId }), { reliable: true });
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {loading ? (
          <div className="py-8 text-center text-xs text-white/40">Loading chat...</div>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-xs text-white/40">No messages yet. Say hello!</div>
        ) : (
          messages.map((m) => {
            const isMine = m.sender === currentUserId;
            return (
              <div key={m._id} className={`group flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                <div className="flex items-center gap-1.5 px-1 text-[10px] text-white/40">
                  <span className="font-semibold text-white/60">{isMine ? "You" : m.senderName}</span>
                  <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                </div>
                <div
                  className={`relative max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    isMine ? "bg-primary text-on-primary" : "bg-white/10 text-white"
                  }`}
                >
                  {m.text}
                  {canModerate && (
                    <button
                      onClick={() => handleDelete(m._id)}
                      title="Delete message"
                      className="absolute -right-2 -top-2 hidden h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-error text-white group-hover:flex"
                    >
                      <Icon name="close" className="text-[12px]" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="relative shrink-0 border-t border-white/10 p-3">
        {emojiOpen && (
          <div className="absolute bottom-full left-3 mb-2 flex gap-1 rounded-xl border border-white/10 bg-[#101a2c] p-2 shadow-xl">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setText((t) => t + emoji);
                  setEmojiOpen(false);
                }}
                className="cursor-pointer rounded-lg p-1.5 text-lg hover:bg-white/10"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEmojiOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-white/10"
          >
            <Icon name="mood" className="text-[20px]" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Send a message..."
            className="h-9 min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/60"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary transition-transform hover:scale-105 disabled:opacity-40"
          >
            <Icon name="send" className="text-[18px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
