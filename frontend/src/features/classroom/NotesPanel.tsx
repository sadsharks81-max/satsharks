import { useEffect, useRef, useState } from "react";
import { Icon } from "../../components/common/Icon";

interface NotesPanelProps {
  classId: string;
}

/**
 * Private, per-student scratch notes for the session. Kept in localStorage only -
 * there was no requirement for these to be shared or persisted server-side.
 */
export function NotesPanel({ classId }: NotesPanelProps) {
  const storageKey = `sat-sharks-classroom-notes-${classId}`;
  const [text, setText] = useState("");
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setText(localStorage.getItem(storageKey) || "");
  }, [storageKey]);

  const handleChange = (value: string) => {
    setText(value);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      localStorage.setItem(storageKey, value);
      setSavedAt(new Date());
    }, 500);
  };

  return (
    <div className="flex h-full min-h-0 flex-col p-3">
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Jot down notes for this class - only you can see these."
        className="flex-1 resize-none rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-primary/60"
      />
      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/40">
        <Icon name="lock" className="text-[12px]" />
        Private to you
        {savedAt && <span>&middot; Saved {savedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>}
      </div>
    </div>
  );
}
