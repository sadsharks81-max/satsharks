import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { a as api } from "./router-Be_1-VPB.js";
import "@tanstack/react-router";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const defaultTestimonials = [{
    name: "Sarah M.",
    score: "Scored 1580 (+210)",
    university: "Harvard University",
    quote: "The personalized study plan was a game-changer.",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }, {
    name: "David L.",
    score: "Scored 1550 (+180)",
    university: "Stanford University",
    quote: "The instructors genuinely care about your success.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  }, {
    name: "Emily R.",
    score: "Scored 1590 (+150)",
    university: "Yale University",
    quote: "I was struggling to break 700 in the Math section, but the targeted problem walkthroughs helped me achieve a perfect 800.",
    imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&h=256&q=80"
  }];
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get("/api/success-stories");
        if (res.success) {
          setStories(res.stories || []);
        }
      } catch (e) {
        console.error("Failed to fetch stories", e);
      }
    };
    fetchStories();
  }, []);
  const getEmbedUrl = (url) => {
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
  const isEmbeddable = (url) => {
    const embedUrl = getEmbedUrl(url);
    return embedUrl.includes("youtube.com/embed") || embedUrl.includes("vimeo.com/video");
  };
  const displayStories = stories.length > 0 ? stories : defaultTestimonials;
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-on-background animate-fade-up flex flex-col", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx("section", { className: "bg-surface-container-low py-20 md:py-28", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-3xl text-center", children: [
        /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.08em] text-primary", children: [
          /* @__PURE__ */ jsx(Icon, { name: "social_leaderboard", className: "text-[16px]" }),
          " Our Track Record"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-6 font-display text-4xl font-extrabold tracking-[-0.02em] md:text-5xl lg:text-6xl text-on-surface", children: [
          "Student ",
          /* @__PURE__ */ jsx("span", { className: "text-primary", children: "Success Stories" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-lg text-on-surface-variant", children: "Join hundreds of students who have achieved their target scores and gained admission to top-tier universities worldwide with SAT Sharks." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: displayStories.map((item) => /* @__PURE__ */ jsxs("figure", { className: "hover-lift relative rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full", children: [
          item.imageUrl ? /* @__PURE__ */ jsx("img", { src: item.imageUrl, alt: item.name, className: "w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-md mb-4" }) : /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 shrink-0 place-items-center rounded-full bg-primary text-on-primary font-display text-2xl font-bold border-2 border-primary/20 shadow-md mb-4 animate-fade-in", children: item.name.charAt(0) }),
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-on-surface text-lg", children: item.name }),
          /* @__PURE__ */ jsx("div", { className: "font-mono text-xs uppercase tracking-[0.08em] text-accent font-bold mt-1", children: item.score }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-on-surface-variant flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsx(Icon, { name: "school", className: "text-[14px]" }),
            " ",
            item.university
          ] }),
          item.videoUrl && /* @__PURE__ */ jsxs("button", { onClick: () => setSelectedVideo(item.videoUrl), className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-3.5 py-1.5 font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-3 border border-primary/20 cursor-pointer shadow-sm", title: "Watch Video Testimonial", children: [
            /* @__PURE__ */ jsx(Icon, { name: "play_arrow", className: "text-[14px]" }),
            "Watch Video"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx("div", { className: "h-[1px] w-full bg-outline-variant/30 my-4" }),
          /* @__PURE__ */ jsxs("blockquote", { className: "text-on-surface leading-relaxed text-sm italic font-light", children: [
            '"',
            item.quote,
            '"'
          ] })
        ] })
      ] }, item._id || item.name)) })
    ] }) }) }),
    /* @__PURE__ */ jsx(Footer, {}),
    selectedVideo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20", children: [
      /* @__PURE__ */ jsx("button", { onClick: () => setSelectedVideo(null), className: "absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/80 p-2 rounded-full transition-colors cursor-pointer", "aria-label": "Close video player", children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-2xl" }) }),
      /* @__PURE__ */ jsx("div", { className: "w-full aspect-video", children: isEmbeddable(selectedVideo) ? /* @__PURE__ */ jsx("iframe", { src: getEmbedUrl(selectedVideo), title: "Student Video Testimonial", allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, className: "w-full h-full border-none" }) : /* @__PURE__ */ jsx("video", { src: selectedVideo, controls: true, autoPlay: true, className: "w-full h-full object-contain" }) })
    ] }) })
  ] });
}
export {
  SuccessStories as component
};
