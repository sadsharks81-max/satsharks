import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Icon } from "../common/Icon";
import { Link } from "@tanstack/react-router";
import { resolveImageUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { getHomepageSuccessContent } from "../../services/publicContent";

const DEFAULT_FEATURE = {
  studentName: "Admitted Student",
  university: "Stanford University '28",
  score: "1580",
  improvement: "+210 Improvement",
  imageUrl: "",
};

interface HeroFeature {
  studentName: string;
  university: string;
  score: string;
  improvement: string;
  imageUrl: string;
}

const resolveHeroImageUrl = (url: string) => {
  return url ? resolveImageUrl(url) : "";
};

interface HeroProps {
  onReady?: () => void;
}

export function Hero({ onReady }: HeroProps) {
  const { user } = useAuth();
  const [feature, setFeature] = useState<HeroFeature | null>(null);
  const [heroImageLoaded, setHeroImageLoaded] = useState(false);
  const readyNotified = useRef(false);

  useEffect(() => {
    getHomepageSuccessContent()
      .then((res) => {
        if (res.success && res.feature) {
          setHeroImageLoaded(!res.feature.imageUrl);
          setFeature(res.feature);
        } else {
          setHeroImageLoaded(true);
          setFeature(DEFAULT_FEATURE);
        }
      })
      .catch((err) => {
        console.error("Error fetching featured success story:", err);
        setHeroImageLoaded(true);
        setFeature(DEFAULT_FEATURE);
      });
  }, []);

  useEffect(() => {
    if (!feature || !heroImageLoaded || readyNotified.current) return;

    const notifyReady = async () => {
      if (typeof document !== "undefined" && document.fonts) {
        await Promise.allSettled([
          document.fonts.load('400 16px "Material Symbols Outlined"'),
          document.fonts.load('600 16px "League Spartan"'),
        ]);
      }
      if (!readyNotified.current) {
        readyNotified.current = true;
        onReady?.();
      }
    };

    void notifyReady();
  }, [feature, heroImageLoaded, onReady]);

  return (
    <section
      id="top"
      className="relative pt-4 pb-28 md:pt-8 md:pb-40 overflow-hidden bg-background"
    >
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
            Gain entry into the world's most elite universities. Through personalized SAT mastery,
            bespoke admissions counseling, and strategic essay editing, we turn ambitions into
            acceptance letters.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            {user?.role === "ADMIN" || user?.role === "TEACHER" ? (
              <Link
                to={user.role === "ADMIN" ? "/admin" : "/teacher"}
                className="btn-shimmer inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-sm font-bold uppercase tracking-[0.1em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300"
              >
                Go to the {user.role === "TEACHER" ? "teacher " : ""}dashboard{" "}
                <Icon name="dashboard" className="text-[16px]" />
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
                  <Icon
                    name="play_circle"
                    className="text-[16px] text-accent group-hover:scale-110 transition-transform"
                  />{" "}
                  Free Trial
                </Link>
              </>
            )}
          </div>

          <div className="pt-6 border-t border-outline-variant/50 max-w-lg"></div>
        </motion.div>

        {/* Right Side: Multi-layered Creative Collage */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          {feature && (
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
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl border border-outline-variant/60 bg-surface shark-shadow">
                {!heroImageLoaded && (
                  <div
                    aria-label="Loading featured student image"
                    className="absolute inset-0 animate-pulse bg-surface-container-high"
                  />
                )}
                {feature.imageUrl && (
                  <img
                    src={resolveHeroImageUrl(feature.imageUrl)}
                    alt={feature.studentName}
                    width={420}
                    height={525}
                    fetchPriority="high"
                    loading="eager"
                    decoding="async"
                    onLoad={() => setHeroImageLoaded(true)}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                      setHeroImageLoaded(true);
                    }}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${
                      heroImageLoaded ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}
              </div>

              {/* Student identity, kept below the face on top of the portrait. */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                style={{ willChange: "transform, opacity" }}
                className="absolute bottom-4 left-4 glass-card shark-shadow px-2.5 py-2 rounded-lg max-w-[205px] border-l-2 border-l-accent"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary-container text-accent">
                    <Icon name="school" className="text-[16px]" />
                  </span>
                  <div>
                    <h4 className="font-display text-[13px] font-bold text-primary leading-tight">
                      {feature.studentName}
                    </h4>
                    <p className="font-body text-[10px] text-on-surface-variant font-medium">
                      {feature.university}
                    </p>
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
                  <span className="font-display text-[26px] font-extrabold text-accent leading-none">
                    {feature.score}
                  </span>
                  <div>
                    <h4 className="font-body text-[11px] font-bold uppercase tracking-[0.05em] leading-tight">
                      SAT Score
                    </h4>
                    <p className="font-body text-[10px] text-on-primary/70 font-medium">
                      {feature.improvement}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
