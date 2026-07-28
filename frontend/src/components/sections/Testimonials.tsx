import { motion } from "framer-motion";
import { Icon } from "../common/Icon";
import { useState, useEffect } from "react";
import { api, resolveImageUrl } from "../../services/api";
import { Link } from "@tanstack/react-router";

export function Testimonials() {
  const [stories, setStories] = useState<any[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    api.get("/api/success-stories")
      .then((res) => {
        if (res.success && res.stories && res.stories.length > 0) {
          setStories(res.stories.slice(0, 3));
        } else {
          setStories([]);
        }
      })
      .catch(() => {
        setStories([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const isEmbeddable = (url: string) => {
    const embedUrl = getEmbedUrl(url);
    return embedUrl.includes("youtube.com/embed") || embedUrl.includes("vimeo.com/video");
  };

  const TestimonialSkeleton = () => (
    <div className="relative rounded-2xl bg-surface p-8 md:p-10 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px] animate-pulse">
      <div className="flex flex-col items-center w-full">
        {/* Avatar skeleton */}
        <div className="h-36 w-full rounded-xl bg-surface-container-high mb-5" />
        {/* Name skeleton */}
        <div className="h-4 w-24 bg-surface-container-high rounded mb-2" />
        {/* Score skeleton */}
        <div className="h-3 w-32 bg-surface-container-high rounded mb-2" />
        {/* Destination skeleton */}
        <div className="h-3 w-40 bg-surface-container-high rounded mb-4" />
      </div>
      <div className="w-full">
        <div className="h-[1px] w-full bg-outline-variant/20 my-4" />
        {/* Quote lines skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-surface-container-low rounded" />
          <div className="h-3 w-5/6 bg-surface-container-low rounded mx-auto" />
          <div className="h-3 w-4/6 bg-surface-container-low rounded mx-auto" />
        </div>
      </div>
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section id="testimonials" className="bg-surface-container-low py-24 md:py-36 relative overflow-hidden border-t border-b border-outline-variant/60">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mx-auto max-w-2xl text-center space-y-4">
          <span className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            Proven Results
          </span>
          <h2
            id="results"
            className="font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary"
          >
            Student Success Stories
          </h2>
          <div className="h-[1px] w-16 bg-accent mx-auto my-2" />
          <p className="text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed">
            Real stories of score transformations and letters of acceptance from top-tier universities.
          </p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 grid gap-8 md:grid-cols-3 items-start"
        >
          {isLoading ? (
            <>
              <TestimonialSkeleton />
              <TestimonialSkeleton />
              <TestimonialSkeleton />
            </>
          ) : (
            stories.map((t) => (
              <motion.figure
                key={t._id || t.name}
                variants={item}
                whileHover={{ y: -6 }}
                className="relative rounded-2xl bg-surface p-8 md:p-10 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px]"
              >
                <div className="flex flex-col items-center w-full">
                  {/* Centered Large Student Avatar on Top */}
                  {t.imageUrl ? (
                    <img
                      src={resolveImageUrl(t.imageUrl)}
                      alt={t.name}
                      className="h-40 w-full rounded-xl object-cover object-center border-2 border-primary/20 shadow-md mb-5"
                    />
                  ) : (
                    <div className="grid h-40 w-full place-items-center rounded-xl bg-primary text-accent font-display text-5xl font-bold border-2 border-accent/30 shadow-md mb-5">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  
                  {/* Student Info */}
                  <div className="font-body text-base font-bold text-primary">{t.name}</div>
                  <div className="font-body text-xs font-bold uppercase tracking-[0.05em] text-accent mt-1">
                    {t.score}
                  </div>
                  <div className="mt-1 text-xs text-on-surface-variant flex items-center justify-center gap-1">
                    <Icon name="school" className="text-[14px]" /> {t.university || t.destination}
                  </div>
  
                  {/* Centered Watch Video button */}
                  {t.videoUrl && (
                    <button
                      onClick={() => setSelectedVideo(t.videoUrl)}
                      className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-3.5 py-1.5 font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-3 border border-primary/20 cursor-pointer shadow-sm"
                      title="Watch Video Testimonial"
                    >
                      <Icon name="play_arrow" className="text-[12px]" />
                      Watch Video
                    </button>
                  )}
                </div>
  
                <div className="w-full">
                  {/* Divider Line */}
                  <div className="h-[1px] w-full bg-outline-variant/30 my-4" />
  
                  {/* Testimonial Quote */}
                  <blockquote className="text-on-surface/90 leading-relaxed text-[16px] italic font-normal">
                    "{t.quote}"
                  </blockquote>
                </div>
              </motion.figure>
            ))
          )}
        </motion.div>

        {/* View All Stories Button */}
        <div className="mt-16 text-center">
          <Link
            to="/success-stories"
            className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300"
          >
            <span>View All Success Stories</span>
            <Icon name="arrow_forward" className="text-lg" />
          </Link>
        </div>
      </div>

      {/* Video Lightbox Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20">
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/80 p-2 rounded-full transition-colors cursor-pointer"
              aria-label="Close video player"
            >
              <Icon name="close" className="text-2xl" />
            </button>
            
            <div className="w-full aspect-video">
              {isEmbeddable(selectedVideo) ? (
                <iframe
                  src={getEmbedUrl(selectedVideo)}
                  title="Student Video Testimonial"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-none"
                />
              ) : (
                <video
                  src={selectedVideo}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
