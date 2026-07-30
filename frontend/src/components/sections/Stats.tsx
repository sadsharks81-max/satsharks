import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../../services/api";

export function Stats() {
  const [data, setData] = useState({
    successRate: "98%",
    studentsMentored: "1,500+",
    eliteAdmissions: "250+",
    avgSatGain: "+220"
  });

  useEffect(() => {
    api.get("/api/homepage-stats")
      .then(res => {
        if (res.success && res.stats) {
          setData(res.stats);
        }
      })
      .catch(err => console.error("Error loading stats:", err));
  }, []);

  const stats = [
    { v: data.successRate, l: "Success Rate" },
    { v: data.studentsMentored, l: "Students Mentored" },
    { v: data.eliteAdmissions, l: "Elite Admissions" },
    { v: data.avgSatGain, l: "Average SAT Gain" },
  ];

  const container = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative z-10 -mt-12 md:-mt-16">
      <div className="mx-auto max-w-[1200px] px-6">
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          style={{ willChange: "opacity, transform" }}
          className="glass-card shark-shadow grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12 rounded-2xl bg-surface/90"
        >
          {stats.map((s, idx) => (
            <motion.div 
              key={s.l} 
              variants={item}
              className={`text-center px-4 ${
                idx < 3 ? "md:border-r md:border-outline-variant/50" : ""
              }`}
            >
              <div className="font-sans text-4xl md:text-5xl font-bold tracking-tight text-primary/90">
                {s.v}
              </div>
              <div className="mt-2 font-body text-[12px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                {s.l}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
