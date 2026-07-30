import { useEffect, useState } from "react";
import { useParticipants, useConnectionQualityIndicator, useLocalParticipant } from "@livekit/components-react";
import { Icon } from "../../components/common/Icon";
import logoImg from "@/assets/logo.png";
import { QUALITY_DOT_COLOR, QUALITY_LABEL } from "./connectionQuality";

const formatElapsed = (secs: number) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

interface TopBarProps {
  title: string;
  startedAt?: string | null;
  durationMinutes: number;
  onLeave: () => void;
}

export function TopBar({ title, startedAt, durationMinutes, onLeave }: TopBarProps) {
  const participants = useParticipants();
  const { localParticipant } = useLocalParticipant();
  const { quality } = useConnectionQualityIndicator({ participant: localParticipant });
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startMs = startedAt ? new Date(startedAt).getTime() : Date.now();
    const tick = () => setElapsed(Math.max(0, Math.round((Date.now() - startMs) / 1000)));
    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  }, [startedAt]);

  return (
    <div className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-white/10 bg-[#0B1120] px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <img src={logoImg} alt="SAT Sharks" className="h-7 w-auto shrink-0" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="hidden sm:block h-6 w-[1px] bg-white/15 shrink-0" />
        <span className="truncate text-sm font-bold text-white">{title}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/90">
          <Icon name="timer" className="text-[15px] text-accent" />
          <span className="font-mono">{formatElapsed(elapsed)}</span>
          <span className="text-white/40">/ {durationMinutes} min</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/90">
          <Icon name="groups" className="text-[15px] text-accent" />
          {participants.length}
        </div>

        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-bold text-white/90">
          <span className={`h-2 w-2 rounded-full ${QUALITY_DOT_COLOR[quality]}`} />
          {QUALITY_LABEL[quality]}
        </div>

        <button
          onClick={onLeave}
          className="flex items-center gap-1.5 rounded-lg bg-error px-3 py-2 text-xs font-bold text-white hover:bg-error/90 transition-colors cursor-pointer border-none"
        >
          <Icon name="call_end" className="text-[16px]" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
}
