import { useCallback, useEffect, useRef, useState } from "react";
import { useLocalParticipant, useDataChannel, useParticipantAttributes, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { TopBar } from "./TopBar";
import { VideoStage } from "./VideoStage";
import { BottomToolbar } from "./BottomToolbar";
import { SidePanel, type PanelKind } from "./SidePanelTabs";
import { WhiteboardPlaceholder } from "./WhiteboardPlaceholder";
import { CHAT_TOPIC_MESSAGE } from "./chatTopics";
import type { LiveClassDetails } from "./useClassStatusPoll";
import { Icon } from "../../components/common/Icon";

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

  const tracks = useTracks([
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const isScreenSharing = tracks.some((t) => t.source === Track.Source.ScreenShare);

  const [topBarVisible, setTopBarVisible] = useState(true);
  const [bottomBarVisible, setBottomBarVisible] = useState(true);

  if (isScreenSharing) {
    return (
      <div
        ref={containerRef}
        className="relative h-full w-full bg-[#0B1120] overflow-hidden"
      >
        {/* TopBar Overlay */}
        <div
          className={`absolute top-0 left-0 right-0 z-30 transition-all duration-300 ${
            topBarVisible
              ? "translate-y-0 opacity-100"
              : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative">
            <TopBar title={liveClass.title} startedAt={liveClass.startedAt} durationMinutes={liveClass.duration} onLeave={onLeave} />
            <button
              type="button"
              onClick={() => setTopBarVisible(false)}
              className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 bg-[#0F172A] hover:bg-[#1E293B] text-white border-b border-x border-white/10 rounded-b-xl px-4 py-1 cursor-pointer z-40 transition-colors shadow-lg flex items-center justify-center"
              title="Collapse Top Bar"
            >
              <Icon name="keyboard_arrow_up" className="text-base" />
            </button>
          </div>
        </div>

        {/* Floating expand arrow when TopBar is collapsed */}
        {!topBarVisible && (
          <button
            type="button"
            onClick={() => setTopBarVisible(true)}
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#0F172A] hover:bg-[#1E293B] text-white border-b border-x border-white/10 rounded-b-xl px-4 py-1 cursor-pointer z-40 transition-colors shadow-lg flex items-center justify-center animate-bounce"
            title="Expand Top Bar"
          >
            <Icon name="keyboard_arrow_down" className="text-base" />
          </button>
        )}

        {/* Full-bleed Video Stage */}
        <div className="h-full w-full">
          <VideoStage teacherIdentity={liveClass.teacher?._id} controlsVisible={topBarVisible} />
        </div>

        {/* Side Panel overlay */}
        {activePanel && (
          <div className="absolute right-0 top-16 bottom-20 z-40 w-80 bg-[#111827] border-l border-white/10 shadow-2xl">
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

        {/* BottomToolbar Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 transition-all duration-300 ${
            bottomBarVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setBottomBarVisible(false)}
              className="absolute top-[-24px] left-1/2 -translate-x-1/2 bg-[#0F172A] hover:bg-[#1E293B] text-white border-t border-x border-white/10 rounded-t-xl px-4 py-1 cursor-pointer z-40 transition-colors shadow-lg flex items-center justify-center"
              title="Collapse Toolbar"
            >
              <Icon name="keyboard_arrow_down" className="text-base" />
            </button>
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
          </div>
        </div>

        {/* Floating expand arrow when BottomToolbar is collapsed */}
        {!bottomBarVisible && (
          <button
            type="button"
            onClick={() => setBottomBarVisible(true)}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#0F172A] hover:bg-[#1E293B] text-white border-t border-x border-white/10 rounded-t-xl px-4 py-1 cursor-pointer z-40 transition-colors shadow-lg flex items-center justify-center animate-bounce"
            title="Expand Toolbar"
          >
            <Icon name="keyboard_arrow_up" className="text-base" />
          </button>
        )}

        <WhiteboardPlaceholder open={whiteboardOpen} onClose={() => setWhiteboardOpen(false)} />
      </div>
    );
  }

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
