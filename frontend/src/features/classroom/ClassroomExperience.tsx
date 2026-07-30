import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalParticipant, useDataChannel, useParticipantAttributes } from "@livekit/components-react";
import { TopBar } from "./TopBar";
import { VideoStage } from "./VideoStage";
import { BottomToolbar } from "./BottomToolbar";
import { SidePanel, type PanelKind } from "./SidePanelTabs";
import { WhiteboardPlaceholder } from "./WhiteboardPlaceholder";
import { CHAT_TOPIC_MESSAGE } from "./chatTopics";
import type { LiveClassDetails } from "./useClassStatusPoll";

interface ClassroomExperienceProps {
  liveClass: LiveClassDetails;
  classId: string;
  currentUserId?: string;
  canModerate: boolean;
  onLeave: () => void;
}

const isTypingInField = () => {
  const tag = document.activeElement?.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
};

export function ClassroomExperience({ liveClass, classId, currentUserId, canModerate, onLeave }: ClassroomExperienceProps) {
  const [activePanel, setActivePanel] = useState<PanelKind | null>(null);
  const [unreadChat, setUnreadChat] = useState(0);
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { localParticipant } = useLocalParticipant();
  const { attributes } = useParticipantAttributes({ participant: localParticipant });
  const handRaised = attributes?.handRaised === "true";

  // Always-mounted listener so the unread badge keeps counting while the chat tab is closed.
  useDataChannel(CHAT_TOPIC_MESSAGE, () => {
    setActivePanel((current) => {
      if (current !== "chat") setUnreadChat((n) => n + 1);
      return current;
    });
  });

  const handleTogglePanel = useCallback((panel: PanelKind) => {
    setActivePanel((current) => {
      const next = current === panel ? null : panel;
      if (next === "chat") setUnreadChat(0);
      return next;
    });
  }, []);

  const handleToggleRaiseHand = useCallback(() => {
    localParticipant.setAttributes({ handRaised: handRaised ? "false" : "true" });
  }, [localParticipant, handRaised]);

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Keyboard shortcuts - ignored while the user is typing in chat/notes.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isTypingInField() || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "m") document.getElementById("cr-toggle-mic")?.click();
      else if (key === "v") document.getElementById("cr-toggle-cam")?.click();
      else if (key === "h") handleToggleRaiseHand();
      else if (key === "f") handleToggleFullscreen();
      else if (key === "escape" && activePanel) setActivePanel(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activePanel, handleToggleRaiseHand, handleToggleFullscreen]);

  return (
    <div ref={containerRef} className="flex h-full w-full flex-col bg-[#0B1120]">
      <TopBar title={liveClass.title} startedAt={liveClass.startedAt} durationMinutes={liveClass.duration} onLeave={onLeave} />

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <div className="min-w-0 flex-1">
          <VideoStage teacherIdentity={liveClass.teacher?._id} />
        </div>
        {activePanel && (
          <div className="absolute inset-0 z-10 sm:static sm:inset-auto sm:z-auto">
            <SidePanel
              activePanel={activePanel}
              onChangeTab={handleTogglePanel}
              onClose={() => setActivePanel(null)}
              classId={classId}
              currentUserId={currentUserId}
              teacherIdentity={liveClass.teacher?._id}
              canModerate={canModerate}
            />
          </div>
        )}
      </div>

      <BottomToolbar
        activePanel={activePanel}
        onTogglePanel={handleTogglePanel}
        unreadChatCount={unreadChat}
        handRaised={handRaised}
        onToggleRaiseHand={handleToggleRaiseHand}
        onOpenWhiteboard={() => setWhiteboardOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onLeave={onLeave}
      />

      <WhiteboardPlaceholder open={whiteboardOpen} onClose={() => setWhiteboardOpen(false)} />
    </div>
  );
}
