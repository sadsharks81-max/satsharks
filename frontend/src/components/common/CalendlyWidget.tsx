import { Icon } from "./Icon";
import { motion } from "framer-motion";

export function CalendlyWidget() {
  // Available slots for demonstration purposes
  const availableSlots = [3, 8, 15, 22];

  return (
    <div className="rounded-xl border border-accent/30 bg-surface/5 p-6 backdrop-blur-md shark-shadow">
      <div className="flex items-center gap-3 text-accent pb-4 border-b border-white/15">
        <Icon name="calendar_month" className="text-[22px]" />
        <span className="font-body text-[11px] font-bold uppercase tracking-[0.15em]">
          Available Consultations
        </span>
      </div>
      
      <div className="mt-6 grid grid-cols-7 gap-2">
        {/* Days labels */}
        {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
          <div key={idx} className="text-center font-body text-[9px] font-bold text-on-primary/60">
            {day}
          </div>
        ))}

        {/* Days grid */}
        {Array.from({ length: 28 }).map((_, i) => {
          const isAvailable = availableSlots.includes(i + 1);
          return (
            <motion.div
              key={i}
              whileHover={isAvailable ? { scale: 1.15 } : {}}
              className={`aspect-square rounded-full text-center text-[10px] leading-none flex items-center justify-center font-mono transition-colors duration-300 cursor-pointer ${
                isAvailable
                  ? "bg-accent text-primary font-bold shadow-md hover:bg-on-primary"
                  : "bg-white/5 text-on-primary/30"
              }`}
            >
              {i + 1}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] font-body text-on-primary/60 tracking-wide">
        <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
        <span>Selectable consulting slots highlighted in Gold</span>
      </div>
    </div>
  );
}
