import { motion } from "framer-motion";
import { Icon } from "../../components/common/Icon";
import { ChatPanel } from "./ChatPanel";
import { ParticipantsPanel } from "./ParticipantsPanel";
import { NotesPanel } from "./NotesPanel";

export type PanelKind = "chat" | "participants" | "notes";

const TABS: { key: PanelKind; label: string; icon: string }[] = [
  { key: "chat", label: "Chat", icon: "chat" },
  { key: "participants", label: "Participants", icon: "group" },
  { key: "notes", label: "Notes", icon: "edit_note" },
];

interface SidePanelProps {
  activePanel: PanelKind;
  onChangeTab: (panel: PanelKind) => void;
  onClose: () => void;
  classId: string;
  currentUserId?: string;
  teacherIdentity?: string;
  canModerate: boolean;
}

export function SidePanel({ activePanel, onChangeTab, onClose, classId, currentUserId, teacherIdentity, canModerate }: SidePanelProps) {
  return (
    <motion.div
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full w-full flex-col border-l border-white/10 bg-[#0e1729] sm:w-80 md:w-96"
    >
      <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-2">
        <div className="flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex items-center gap-1.5 border-b-2 px-3.5 py-3 text-xs font-bold uppercase tracking-wide transition-colors cursor-pointer ${
                activePanel === tab.key
                  ? "border-primary text-white"
                  : "border-transparent text-white/40 hover:text-white/70"
              }`}
            >
              <Icon name={tab.icon} className="text-[16px]" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
        >
          <Icon name="close" className="text-[18px]" />
        </button>
      </div>

      <div className="min-h-0 flex-1">
        {activePanel === "chat" && <ChatPanel classId={classId} currentUserId={currentUserId} canModerate={canModerate} />}
        {activePanel === "participants" && (
          <ParticipantsPanel classId={classId} teacherIdentity={teacherIdentity} canModerate={canModerate} />
        )}
        {activePanel === "notes" && <NotesPanel classId={classId} />}
      </div>
    </motion.div>
  );
}
