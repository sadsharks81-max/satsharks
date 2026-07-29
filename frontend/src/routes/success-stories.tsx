import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Icon } from "../components/common/Icon";
import { api, resolveImageUrl } from "../services/api";

export const Route = createFileRoute("/success-stories")({
  component: SuccessStories,
});

function SuccessStories() {
  const [stories, setStories] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<"SAT" | "ADMISSION">("SAT");
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      setIsLoading(true);
      try {
        const res = await api.publicGet(`/api/success-stories?category=${activeCategory}`);
        if (res.success) {
          setStories(res.stories || []);
        } else {
          setStories([]);
        }
      } catch (e) {
        console.error("Failed to fetch stories", e);
        setStories([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStories();
  }, [activeCategory]);

  const getEmbedUrl = (url: string) => {
    if (!url) return "";
    
    // YouTube Regex
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    
    // Vimeo Regex
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
    <div className="relative rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px] animate-pulse">
      <div className="flex flex-col items-center w-full">
        {/* Avatar skeleton */}
        <div className="h-44 w-44 rounded-full bg-surface-container-high mb-5" />
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

  return (
    <div className="min-h-screen bg-background text-on-background animate-fade-up flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="bg-surface-container-low py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-primary">
                <Icon name="social_leaderboard" className="text-[16px]" /> Our Track Record
              </span>
              <h1 className="mt-6 font-display text-4xl font-extrabold tracking-[-0.02em] md:text-5xl lg:text-6xl text-on-surface">
                Student <span className="text-primary">Success Stories</span>
              </h1>
            </div>

            {/* Category tabs */}
            <div className="flex justify-center gap-2 mt-8 select-none">
              <button
                onClick={() => setActiveCategory("SAT")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                  activeCategory === "SAT"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                SAT Prep Success
              </button>
              <button
                onClick={() => setActiveCategory("ADMISSION")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border-none cursor-pointer ${
                  activeCategory === "ADMISSION"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "bg-surface text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                }`}
              >
                College Admissions Success
              </button>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-start">
              {isLoading ? (
                <>
                  <TestimonialSkeleton />
                  <TestimonialSkeleton />
                  <TestimonialSkeleton />
                </>
              ) : (
                stories.map((item) => (
                  <figure
                    key={item._id || item.name}
                    className="hover-lift relative rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px]"
                  >
                    <div className="flex flex-col items-center w-full">
                      {/* Centered Large Student Avatar on Top */}
                      {item.imageUrl ? (
                        <img
                          src={resolveImageUrl(item.imageUrl)}
                          alt={item.name}
                          loading="eager"
                          decoding="async"
                          className="h-44 w-44 shrink-0 rounded-full object-cover object-center border-2 border-primary/20 shadow-md mb-5"
                        />
                      ) : (
                        <div className="grid h-44 w-44 shrink-0 place-items-center rounded-full bg-primary text-on-primary font-display text-5xl font-bold border-2 border-primary/20 shadow-md mb-5 animate-fade-in">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      
                      {/* Student Info */}
                      <div className="font-semibold text-on-surface text-lg">{item.name}</div>
                      <div className="font-mono text-xs uppercase tracking-[0.08em] text-accent font-bold mt-1">
                        {item.score}
                      </div>
                      <div className="mt-1 text-xs text-on-surface-variant flex items-center justify-center gap-1">
                        <Icon name="school" className="text-[14px]" /> {item.university}
                      </div>
  
                      {/* Centered Play Button */}
                      {item.videoUrl && (
                        <button
                          onClick={() => setSelectedVideo(item.videoUrl)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-3.5 py-1.5 font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-3 border border-primary/20 cursor-pointer shadow-sm"
                          title="Watch Video Testimonial"
                        >
                          <Icon name="play_arrow" className="text-[14px]" />
                          Watch Video
                        </button>
                      )}
                    </div>
  
                    <div className="w-full">
                      {/* Divider Line */}
                      <div className="h-[1px] w-full bg-outline-variant/30 my-4" />
  
                      {/* Testimonial Quote */}
                      <blockquote className="text-on-surface/90 leading-relaxed text-[16px] italic font-normal">
                        "{item.quote}"
                      </blockquote>
                    </div>
                  </figure>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

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
    </div>
  );
}
