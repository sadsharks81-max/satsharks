import { motion } from "framer-motion";
import { Icon } from "../common/Icon";

export function Process() {
  const steps = [
    {
      icon: "query_stats",
      t: "Strategic Diagnostic",
      d: "We conduct a comprehensive review of your test history and strengths to build a baseline profile.",
    },
    {
      icon: "route",
      t: "Bespoke Study Plan",
      d: "A custom-tailored curriculum path targeting specific weakness clusters and reinforcing core skills.",
    },
    {
      icon: "fitness_center",
      t: "Targeted Practice",
      d: "High-intensity section drills, timed diagnostic assessments, and direct expert counseling.",
    },
    {
      icon: "workspace_premium",
      t: "Elite Admissions",
      d: "Ongoing personal advisory through essay submissions, interviews, and final application strategies.",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="timeline" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Decorative vertical grid lines to look like an agency website */}
      <div className="absolute top-0 bottom-0 left-[10%] w-[1px] bg-outline-variant/15 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-[10%] w-[1px] bg-outline-variant/15 pointer-events-none" />

      <div className="mx-auto max-w-[1200px] px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            The Methodology
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary">
            Our Strategy For Success
          </h2>
          <div className="h-[1px] w-16 bg-accent mx-auto my-2" />
          <p className="text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed">
            A precise, results-oriented framework designed to help students exceed score boundaries and secure Ivy League entries.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="relative mt-24">
          {/* Horizontal Line connector (Desktop only) */}
          <div className="hidden lg:block absolute top-[48px] left-[6%] right-[6%] h-[1px] bg-accent/30 -z-10" />

          <motion.ol 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {steps.map((s, i) => (
              <motion.li
                key={s.t}
                variants={item}
                className="relative rounded-xl border border-outline-variant/50 bg-surface p-8 shark-shadow transition-all duration-300 hover:border-accent"
              >
                {/* Step badge */}
                <div className="absolute -top-4 left-6 inline-flex h-8 items-center rounded-full border border-accent/40 bg-surface px-4 font-body text-[10px] font-bold tracking-[0.12em] text-accent uppercase">
                  Phase 0{i + 1}
                </div>

                <div className="flex justify-between items-start mt-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-accent border border-accent/20">
                    <Icon name={s.icon} className="text-[22px]" />
                  </div>
                  
                  {/* Elegant big background number */}
                  <span className="font-display text-4xl italic font-extralight text-outline-variant/40 leading-none">
                    0{i + 1}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold text-primary">
                  {s.t}
                </h3>
                
                <p className="mt-3 font-body text-sm font-light text-on-surface-variant leading-relaxed">
                  {s.d}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
}
