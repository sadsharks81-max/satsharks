import { motion } from "framer-motion";
import { Icon } from "../../components/common/Icon";
import type { LiveClassDetails } from "./useClassStatusPoll";

interface WaitingRoomProps {
  liveClass: LiveClassDetails;
  onLeave: () => void;
}

export function WaitingRoom({ liveClass, onLeave }: WaitingRoomProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1120] p-6">
      <div className="w-full max-w-md rounded-3xl bg-surface p-10 text-center shark-shadow border border-outline-variant/40">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute inset-2 rounded-full bg-primary/25"
            animate={{ scale: [1, 1.3, 1], opacity: [0.7, 0.1, 0.7] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary text-on-primary">
            <Icon name="hourglass_top" className="text-2xl" />
          </div>
        </div>

        <h2 className="font-display text-xl font-bold text-on-surface mb-2">{liveClass.title}</h2>
        <p className="text-sm font-semibold text-primary mb-1">
          Teacher has not started the class yet.
        </p>
        <p className="text-xs text-on-surface-variant leading-relaxed mb-8">
          Please wait &mdash; you'll be brought in automatically the moment{" "}
          {liveClass.teacher?.name ? liveClass.teacher.name : "your teacher"} starts the session.
        </p>

        <button
          onClick={onLeave}
          className="w-full py-3 rounded-xl border border-outline-variant/40 hover:bg-surface-container-low text-sm font-bold text-on-surface-variant transition-colors cursor-pointer"
        >
          Leave Waiting Room
        </button>
      </div>
    </div>
  );
}
