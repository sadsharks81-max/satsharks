import { motion } from "framer-motion";
import { Icon } from "../common/Icon";
import { Link } from "@tanstack/react-router";

export function Services() {
  const services = [
    {
      icon: "menu_book",
      title: "SAT Prep & Mastery",
      desc: "Achieve score excellence with our proprietary curriculum, targeted question sets, and custom tutoring.",
    },
    {
      icon: "account_balance",
      title: "Admissions Consulting",
      desc: "Strategic guidance on university selection, application profiling, and mock interview preparations.",
    },
    {
      icon: "edit_note",
      title: "Premium Essay Advisory",
      desc: "Refine personal statements and college-specific supplements to make a memorable impression.",
    },
    {
      icon: "monitoring",
      title: "LUMS Counseling",
      desc: "Comprehensive counseling designed specifically for students aiming to secure admission into LUMS.",
    },
  ];

  const cardContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardItem = {
    hidden: { opacity: 0, y: 30 },
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
    <section id="services" className="py-24 md:py-36 bg-background relative overflow-hidden">
      {/* Decorative background visual cues */}
      <div className="absolute top-1/2 left-0 w-80 h-80 border border-accent/10 rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/3 right-0 w-96 h-96 border border-accent/10 rounded-full pointer-events-none translate-x-1/2" />

      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Academic Pathways
          </span>
          <h2 className="font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary">
            Elite Consulting Services
          </h2>
          <div className="h-[1px] w-16 bg-accent mx-auto my-2" />
          <p className="text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed">
            Every student journey is unique. We provide tailored academic mentorship designed to match your college ambitions.
          </p>
        </div>

        <motion.div 
          variants={cardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((s) => (
            <motion.article
              key={s.title}
              variants={cardItem}
              whileHover={{ y: -8 }}
              className="group relative rounded-xl border border-outline-variant/60 bg-surface p-8 shark-shadow transition-all duration-300 hover:border-accent hover:shadow-lg flex flex-col justify-between"
            >
              {/* Card content wrapper */}
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-surface-container-lowest text-accent group-hover:bg-accent group-hover:text-on-primary transition-all duration-300">
                  <Icon name={s.icon} className="text-[22px]" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold text-primary transition-colors group-hover:text-accent">
                  {s.title}
                </h3>
                <p className="mt-3 font-body text-sm font-light text-on-surface-variant leading-relaxed">
                  {s.desc}
                </p>
              </div>

              {/* Bottom Call to Action */}
              <div className="pt-6 mt-6 border-t border-outline-variant/30">
                <Link
                  to={s.title === "Admissions Consulting" ? "/counseling-abroad" : s.title === "LUMS Counseling" ? "/consulting" : s.title === "SAT Prep & Mastery" ? "/sat" : s.title === "Premium Essay Advisory" ? "/dashboard/essays" : "/booking"}
                  className="inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-accent group-hover:text-primary transition-all duration-300"
                >
                  Request Details 
                  <Icon name="arrow_forward" className="text-[14px] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
