import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Icon } from "../common/Icon";
import studentHero from "../../assets/student_hero.png";
import { Link } from "@tanstack/react-router";
import { api, resolveImageUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

const DEFAULT_FEATURE = {
  studentName: "Admitted Student",
  university: "Stanford University '28",
  score: "1580",
  improvement: "+210 Improvement",
  tag: "Top 1% Worldwide",
  imageUrl: ""
};

const resolveHeroImageUrl = (url: string) => {
  if (!url) return studentHero;
  return resolveImageUrl(url);
};

const CollageSkeleton = () => (
  <div className="relative mx-auto max-w-[420px]">
    {/* Background Luxury Frame Layer */}
    <div className="absolute -inset-4 rounded-2xl border border-accent/15 -z-10 animate-pulse" />
    <div className="absolute -inset-2 rounded-2xl border border-accent/25 -z-10 translate-x-1.5 translate-y-1.5 animate-pulse" />

    {/* Main Student Portrait Placeholder */}
    <div className="w-full aspect-[4/5] bg-surface-container-low rounded-xl border border-outline-variant/30 animate-pulse" />

    {/* Floating Badge 1: Stanford Acceptance Placeholder */}
    <div className="absolute -left-8 top-12 bg-surface/85 backdrop-blur-md p-4 rounded-xl w-[200px] border border-outline-variant/30 flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-surface-container-high shrink-0 animate-pulse" />
      <div className="flex-grow space-y-2">
        <div className="h-3 bg-surface-container-high rounded w-3/4 animate-pulse" />
        <div className="h-2 bg-surface-container-high rounded w-1/2 animate-pulse" />
      </div>
    </div>

    {/* Floating Badge 2: SAT Score card Placeholder */}
    <div className="absolute -right-8 bottom-12 bg-surface/85 backdrop-blur-md p-4 rounded-xl w-[190px] border border-outline-variant/30 flex items-center gap-3">
      <div className="h-6 w-10 bg-surface-container-high rounded shrink-0 animate-pulse" />
      <div className="flex-grow space-y-2">
        <div className="h-3 bg-surface-container-high rounded w-1/2 animate-pulse" />
        <div className="h-2 bg-surface-container-high rounded w-3/4 animate-pulse" />
      </div>
    </div>
  </div>
);

export function Hero() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [feature, setFeature] = useState<any>({
    studentName: "Admitted Student",
    university: "Stanford University '28",
    score: "1580",
    improvement: "+210 Improvement",
    tag: "Top 1% Worldwide",
    imageUrl: ""
  });

  useEffect(() => {
    api.get("/api/success-stories/featured")
      .then((res) => {
        if (res.success && res.feature) {
          const imgUrl = resolveHeroImageUrl(res.feature.imageUrl);

          // Preload image before completing load state so it renders immediately
          const img = new Image();
          img.src = imgUrl;
          img.onload = () => {
            setFeature(res.feature);
            setIsLoading(false);
          };
          img.onerror = () => {
            setFeature(res.feature);
            setIsLoading(false);
          };
        } else {
          setFeature(DEFAULT_FEATURE);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching featured success story:", err);
        setFeature(DEFAULT_FEATURE);
        setIsLoading(false);
      });
  }, []);

  return (
    <section id="top" className="relative pt-4 pb-28 md:pt-8 md:pb-40 overflow-hidden bg-background">
      {/* Background Subtle Textures */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-[32rem] w-[32rem] rounded-full bg-secondary-container/40 blur-3xl opacity-60" />
        <div className="absolute -top-40 -right-20 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-3xl opacity-40" />
      </div>

      <div className="mx-auto grid max-w-[1560px] grid-cols-1 items-center gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-10 xl:px-12">
        {/* Left Side: Elite Admissions Copy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-8 text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface px-4 py-2 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
            <Icon name="verified" className="text-[14px]" />
            The Gold Standard of Ivy League Admissions
          </span>

          <h1 className="font-display text-5xl font-bold leading-[1.08] tracking-[-0.01em] text-on-surface sm:text-6xl lg:text-7xl">
            Elevate Your <br />
            <span className="text-accent font-display font-bold">Academic Destiny</span>
          </h1>

          <p className="max-w-xl text-lg md:text-xl text-on-surface-variant font-body font-light leading-relaxed">
            Gain entry into the world's most elite universities. Through personalized SAT mastery, bespoke admissions counseling, and strategic essay editing, we turn ambitions into acceptance letters.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {user?.role === "ADMIN" ? (
              <Link
                to="/admin"
                className="btn-shimmer inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300"
              >
                Go to the dashboard <Icon name="dashboard" className="text-[16px]" />
              </Link>
            ) : (
              <>
                <Link
                  to="/sat"
                  className="btn-shimmer inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300"
                >
                  Book Class <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
                <Link
                  to={user ? "/sat" : "/auth/login"}
                  className="inline-flex items-center gap-3 rounded-xl border border-outline-variant bg-surface px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-surface hover:bg-surface-container-low transition-all duration-300 group cursor-pointer"
                >
                  <Icon name="play_circle" className="text-[16px] text-accent group-hover:scale-110 transition-transform" /> Free Trial
                </Link>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-outline-variant/50 max-w-lg">
          </div>
        </motion.div>

        {/* Right Side: Multi-layered Creative Collage */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          {isLoading || !feature ? (
            <CollageSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative mx-auto max-w-[420px]"
            >
              {/* Background Luxury Frame Layer */}
              <div className="absolute -inset-4 rounded-2xl border border-accent/20 -z-10" />
              <div className="absolute -inset-2 rounded-2xl border border-accent/40 -z-10 translate-x-1.5 translate-y-1.5" />
              <div className="absolute -right-6 -bottom-6 w-32 h-32 border-r border-b border-accent/60 -z-10" />
              <div className="absolute -left-6 -top-6 w-32 h-32 border-l border-t border-accent/60 -z-10" />

              {/* Glowing Accent */}
              <div className="absolute -inset-6 rounded-2xl bg-linear-to-br from-accent/20 via-transparent to-primary/30 blur-2xl -z-10" />

              {/* Main Student Portrait */}
              <img
                src={resolveHeroImageUrl(feature.imageUrl)}
                alt={feature.studentName}
                width={420}
                height={525}
                fetchPriority="high"
                style={{ aspectRatio: "4/5" }}
                className="w-full h-auto object-cover rounded-xl shark-shadow border border-outline-variant/60"
              />

              {/* Floating Badge 1: Stanford Acceptance */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ willChange: "transform, opacity" }}
                className="absolute -left-8 top-12 glass-card shark-shadow p-4 rounded-xl max-w-[200px] border-l-4 border-l-accent"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-secondary-container text-accent">
                    <Icon name="school" className="text-[18px]" />
                  </span>
                  <div>
                    <h4 className="font-display text-[14px] font-bold text-primary leading-tight">{feature.studentName}</h4>
                    <p className="font-body text-[10px] text-on-surface-variant font-medium">{feature.university}</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating Badge 2: SAT Score card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                style={{ willChange: "transform, opacity" }}
                className="absolute -right-8 bottom-12 bg-primary text-on-primary p-4 rounded-xl shark-shadow max-w-[190px]"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-display text-[26px] font-extrabold text-accent leading-none">{feature.score}</span>
                  <div>
                    <h4 className="font-body text-[11px] font-bold uppercase tracking-[0.05em] leading-tight">SAT Score</h4>
                    <p className="font-body text-[10px] text-on-primary/70 font-medium">{feature.improvement}</p>
                  </div>
                </div>
              </motion.div>

              {/* Bottom mini credential badge */}
              <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/60 text-[10px] font-bold uppercase tracking-[0.08em] text-accent flex items-center gap-1">
                <Icon name="star" className="text-[12px] fill-accent" /> {feature.tag}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
