import { motion } from "framer-motion";
import { Icon } from "../common/Icon";
import { CalendlyWidget } from "../common/CalendlyWidget";
import { useState } from "react";
import { openCalendly } from "../../lib/calendly";

export function Booking() {
  const [isOpeningCalendly, setIsOpeningCalendly] = useState(false);
  const [calendlyError, setCalendlyError] = useState("");

  const handleBookConsultation = async () => {
    setCalendlyError("");
    setIsOpeningCalendly(true);

    try {
      await openCalendly();
    } catch (error) {
      setCalendlyError(error instanceof Error ? error.message : "Unable to open Calendly.");
    } finally {
      setIsOpeningCalendly(false);
    }
  };

  return (
    <section id="booking" className="py-24 md:py-36 bg-background">
      <div className="mx-auto max-w-[1100px] px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl bg-primary text-on-primary p-8 md:p-16 shark-shadow relative overflow-hidden border border-accent/40"
        >
          {/* Subtle gold decorative glow */}
          <div
            aria-hidden
            className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl"
          />

          <div className="relative grid gap-12 md:grid-cols-12 md:items-center">
            {/* Text description side */}
            <div className="md:col-span-7 space-y-6">
              <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                Private Consultation
              </span>
              <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl leading-tight text-on-primary">
                Schedule Your Admissions Assessment
              </h2>
              <p className="font-body text-base font-light leading-relaxed text-on-primary/80">
                Align with an elite advisor to map your baseline scores, review target university lists, and design a strategic roadmap tailored to your admissions timeline.
              </p>
              
              <button
                type="button"
                onClick={handleBookConsultation}
                disabled={isOpeningCalendly}
                className="btn-shimmer inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.1em] text-primary shark-shadow hover:bg-on-primary hover:text-primary transition-all duration-300 cursor-pointer disabled:opacity-70"
              >
                <Icon name="calendar_month" className="text-[16px]" />
                {isOpeningCalendly ? "Initializing Secure Link..." : "Select Booking Slot"}
              </button>

              {calendlyError && (
                <p className="text-sm font-medium text-red-300 font-body flex items-center gap-1.5">
                  <Icon name="error" className="text-[16px]" /> {calendlyError}
                </p>
              )}
            </div>

            {/* Widget illustration side */}
            <div className="md:col-span-5">
              <CalendlyWidget />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
