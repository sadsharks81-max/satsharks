import { jsxs, jsx } from "react/jsx-runtime";
import { H as Header } from "./Header-BhkqVqMe.js";
import { F as Footer } from "./Footer-CN17TUqH.js";
import { motion } from "framer-motion";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { a as api } from "./router-Be_1-VPB.js";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
const studentHero = "/assets/student_hero-B3BqLpb8.png";
function Hero() {
  return /* @__PURE__ */ jsxs("section", { id: "top", className: "relative pt-4 pb-28 md:pt-8 md:pb-40 overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "pointer-events-none absolute inset-0 -z-10 overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/4 h-[32rem] w-[32rem] rounded-full bg-secondary-container/40 blur-3xl opacity-60" }),
      /* @__PURE__ */ jsx("div", { className: "absolute -top-40 -right-20 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-3xl opacity-40" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-12", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          className: "lg:col-span-7 space-y-8 text-left",
          children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface px-4 py-2 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-accent", children: [
              /* @__PURE__ */ jsx(Icon, { name: "verified", className: "text-[14px]" }),
              "The Gold Standard of Ivy League Admissions"
            ] }),
            /* @__PURE__ */ jsxs("h1", { className: "font-display text-5xl font-extrabold leading-[1.08] tracking-[-0.01em] text-on-surface sm:text-6xl lg:text-7xl", children: [
              "Elevate Your ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "italic font-normal text-accent font-display", children: "Academic Destiny." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "max-w-xl text-lg md:text-xl text-on-surface-variant font-body font-light leading-relaxed", children: "Gain entry into the world's most elite universities. Through personalized SAT mastery, bespoke admissions counseling, and strategic essay editing, we turn ambitions into acceptance letters." }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-4 pt-2", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  to: "/subscriptions",
                  className: "btn-shimmer inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.1em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300",
                  children: [
                    "Book Class ",
                    /* @__PURE__ */ jsx(Icon, { name: "arrow_forward", className: "text-[16px]" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: "#services",
                  className: "inline-flex items-center gap-3 rounded-xl border border-outline-variant bg-surface px-8 py-4 text-xs font-bold uppercase tracking-[0.1em] text-on-surface hover:bg-surface-container-low transition-all duration-300 group",
                  children: [
                    /* @__PURE__ */ jsx(Icon, { name: "play_circle", className: "text-[16px] text-accent group-hover:scale-110 transition-transform" }),
                    " Free Trial"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-outline-variant/50 max-w-lg", children: [
              /* @__PURE__ */ jsx("p", { className: "font-body text-[11px] font-bold uppercase tracking-[0.12em] text-on-surface-variant mb-4", children: "Accepted Students Enrolled At:" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-y-2 gap-x-6 text-[12px] font-semibold text-on-surface font-body", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 hover:text-accent transition-colors", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
                  " Harvard University"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 hover:text-accent transition-colors", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
                  " Yale University"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 hover:text-accent transition-colors", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
                  " Stanford University"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 hover:text-accent transition-colors", children: [
                  /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
                  " Princeton University"
                ] })
              ] })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 relative mt-8 lg:mt-0", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
          className: "relative mx-auto max-w-[420px]",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-4 rounded-2xl border border-accent/20 -z-10" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-2 rounded-2xl border border-accent/40 -z-10 translate-x-1.5 translate-y-1.5" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -right-6 -bottom-6 w-32 h-32 border-r border-b border-accent/60 -z-10" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -left-6 -top-6 w-32 h-32 border-l border-t border-accent/60 -z-10" }),
            /* @__PURE__ */ jsx("div", { className: "absolute -inset-6 rounded-2xl bg-linear-to-br from-accent/20 via-transparent to-primary/30 blur-2xl -z-10" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: studentHero,
                alt: "Elite Student Success",
                className: "w-full h-auto object-cover rounded-xl shark-shadow border border-outline-variant/60"
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, x: -30 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.6, duration: 0.6 },
                className: "absolute -left-8 top-12 glass-card shark-shadow p-4 rounded-xl max-w-[200px] border-l-4 border-l-accent",
                whileHover: { y: -4 },
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-full bg-secondary-container text-accent", children: /* @__PURE__ */ jsx(Icon, { name: "school", className: "text-[18px]" }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-display text-[14px] font-bold text-primary leading-tight", children: "Admitted Student" }),
                    /* @__PURE__ */ jsx("p", { className: "font-body text-[10px] text-on-surface-variant font-medium", children: "Stanford University '28" })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.div,
              {
                initial: { opacity: 0, x: 30 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.8, duration: 0.6 },
                className: "absolute -right-8 bottom-12 bg-primary text-on-primary p-4 rounded-xl shark-shadow max-w-[190px]",
                whileHover: { y: -4 },
                children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-display text-[26px] font-extrabold text-accent leading-none", children: "1580" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "font-body text-[11px] font-bold uppercase tracking-[0.05em] leading-tight", children: "SAT Score" }),
                    /* @__PURE__ */ jsx("p", { className: "font-body text-[10px] text-on-primary/70 font-medium", children: "+210 Improvement" })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "absolute bottom-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-outline-variant/60 text-[10px] font-bold uppercase tracking-[0.08em] text-accent flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Icon, { name: "star", className: "text-[12px] fill-accent" }),
              " Top 1% Worldwide"
            ] })
          ]
        }
      ) })
    ] })
  ] });
}
function Stats() {
  const stats = [
    { v: "98%", l: "Success Rate" },
    { v: "1,500+", l: "Students Mentored" },
    { v: "250+", l: "Elite Admissions" },
    { v: "+220", l: "Average SAT Gain" }
  ];
  const container = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };
  return /* @__PURE__ */ jsx("section", { className: "relative z-10 -mt-12 md:-mt-16", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[1200px] px-6", children: /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: container,
      initial: "hidden",
      whileInView: "show",
      viewport: { once: true, margin: "-50px" },
      className: "glass-card shark-shadow grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:py-12 rounded-2xl bg-surface/90",
      children: stats.map((s, idx) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          variants: item,
          className: `text-center px-4 ${idx < 3 ? "md:border-r md:border-outline-variant/50" : ""}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "font-display text-4xl md:text-5xl font-extrabold tracking-tight text-primary", children: s.v }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 font-body text-[11px] font-bold uppercase tracking-[0.15em] text-on-surface-variant/80", children: s.l })
          ]
        },
        s.l
      ))
    }
  ) }) });
}
function Services() {
  const services = [
    {
      icon: "menu_book",
      title: "SAT Prep & Mastery",
      desc: "Achieve score excellence with our proprietary curriculum, targeted question sets, and custom tutoring."
    },
    {
      icon: "account_balance",
      title: "Admissions Consulting",
      desc: "Strategic guidance on university selection, application profiling, and mock interview preparations."
    },
    {
      icon: "edit_note",
      title: "Premium Essay Advisory",
      desc: "Refine personal statements and college-specific supplements to make a memorable impression."
    },
    {
      icon: "monitoring",
      title: "Strategic Analytics",
      desc: "Real-time performance diagnostic metrics and targeted metrics to track score potential."
    }
  ];
  const cardContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const cardItem = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "services", className: "py-24 md:py-36 bg-background relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/2 left-0 w-80 h-80 border border-accent/10 rounded-full pointer-events-none -translate-y-1/2 -translate-x-1/2" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-1/3 right-0 w-96 h-96 border border-accent/10 rounded-full pointer-events-none translate-x-1/2" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center space-y-4", children: [
        /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent", children: "Academic Pathways" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary", children: "Elite Consulting Services" }),
        /* @__PURE__ */ jsx("div", { className: "h-[1px] w-16 bg-accent mx-auto my-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed", children: "Every student journey is unique. We provide tailored academic mentorship designed to match your college ambitions." })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          variants: cardContainer,
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-100px" },
          className: "mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
          children: services.map((s) => /* @__PURE__ */ jsxs(
            motion.article,
            {
              variants: cardItem,
              whileHover: { y: -8 },
              className: "group relative rounded-xl border border-outline-variant/60 bg-surface p-8 shark-shadow transition-all duration-300 hover:border-accent hover:shadow-lg flex flex-col justify-between",
              children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-full border border-accent/30 bg-surface-container-lowest text-accent group-hover:bg-accent group-hover:text-on-primary transition-all duration-300", children: /* @__PURE__ */ jsx(Icon, { name: s.icon, className: "text-[22px]" }) }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-6 font-display text-2xl font-bold text-primary transition-colors group-hover:text-accent", children: s.title }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 font-body text-sm font-light text-on-surface-variant leading-relaxed", children: s.desc })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "pt-6 mt-6 border-t border-outline-variant/30", children: /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: "#booking",
                    className: "inline-flex items-center gap-2 font-body text-[11px] font-bold uppercase tracking-[0.1em] text-accent group-hover:text-primary transition-all duration-300",
                    children: [
                      "Request Details",
                      /* @__PURE__ */ jsx(Icon, { name: "arrow_forward", className: "text-[14px] group-hover:translate-x-1 transition-transform" })
                    ]
                  }
                ) })
              ]
            },
            s.title
          ))
        }
      )
    ] })
  ] });
}
function Testimonials() {
  const [stories, setStories] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const defaultTestimonials = [
    {
      name: "Sarah M.",
      score: "Scored 1580 (+210)",
      destination: "Stanford University '28",
      quote: "The personalized study plan was a complete game-changer. I felt confident, focused, and fully prepared on test day. Getting into my dream school still feels surreal!",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      name: "David L.",
      score: "Scored 1550 (+180)",
      destination: "Princeton University '29",
      quote: "The mentors genuinely care about your success. The study material and timed drills perfectly mirrored the actual exam environment, removing all test-day anxiety.",
      imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    {
      name: "Emily R.",
      score: "Scored 1590 (+150)",
      destination: "Yale University '28",
      quote: "I was struggling to break 700 in the Math section, but the targeted problem walkthroughs helped me achieve a perfect 800. I couldn't have done it without SAT Sharks!",
      imageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&h=256&q=80"
    }
  ];
  useEffect(() => {
    api.get("/api/success-stories").then((res) => {
      if (res.success && res.stories && res.stories.length > 0) {
        setStories(res.stories.slice(0, 3));
      }
    });
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
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "testimonials", className: "bg-surface-container-low py-24 md:py-36 relative overflow-hidden border-t border-b border-outline-variant/60", children: [
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center space-y-4", children: [
        /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent", children: "Proven Results" }),
        /* @__PURE__ */ jsx(
          "h2",
          {
            id: "results",
            className: "font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary",
            children: "Student Success Stories"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "h-[1px] w-16 bg-accent mx-auto my-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed", children: "Real stories of score transformations and letters of acceptance from top-tier universities." })
      ] }),
      /* @__PURE__ */ jsx(
        motion.div,
        {
          variants: container,
          initial: "hidden",
          whileInView: "show",
          viewport: { once: true, margin: "-100px" },
          className: "mt-20 grid gap-8 md:grid-cols-3",
          children: displayStories.map((t) => /* @__PURE__ */ jsxs(
            motion.figure,
            {
              variants: item,
              whileHover: { y: -6 },
              className: "relative rounded-2xl bg-surface p-8 md:p-10 shark-shadow border border-outline-variant/40 flex flex-col items-center text-center justify-between min-h-[420px]",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center w-full", children: [
                  t.imageUrl ? /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: t.imageUrl,
                      alt: t.name,
                      className: "w-20 h-20 rounded-full object-cover border-2 border-primary/20 shadow-md mb-4"
                    }
                  ) : /* @__PURE__ */ jsx("div", { className: "grid h-20 w-20 place-items-center rounded-full bg-primary text-accent font-display text-2xl font-bold border-2 border-accent/30 shadow-md mb-4", children: t.name.charAt(0) }),
                  /* @__PURE__ */ jsx("div", { className: "font-body text-base font-bold text-primary", children: t.name }),
                  /* @__PURE__ */ jsx("div", { className: "font-body text-xs font-bold uppercase tracking-[0.05em] text-accent mt-1", children: t.score }),
                  /* @__PURE__ */ jsxs("div", { className: "mt-1 text-xs text-on-surface-variant flex items-center justify-center gap-1", children: [
                    /* @__PURE__ */ jsx(Icon, { name: "school", className: "text-[14px]" }),
                    " ",
                    t.university || t.destination
                  ] }),
                  t.videoUrl && /* @__PURE__ */ jsxs(
                    "button",
                    {
                      onClick: () => setSelectedVideo(t.videoUrl),
                      className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-3.5 py-1.5 font-body text-xs font-bold uppercase tracking-wider transition-all duration-300 mt-3 border border-primary/20 cursor-pointer shadow-sm",
                      title: "Watch Video Testimonial",
                      children: [
                        /* @__PURE__ */ jsx(Icon, { name: "play_arrow", className: "text-[12px]" }),
                        "Watch Video"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-[1px] w-full bg-outline-variant/30 my-4" }),
                  /* @__PURE__ */ jsxs("blockquote", { className: "text-on-surface leading-relaxed text-sm italic font-light", children: [
                    '"',
                    t.quote,
                    '"'
                  ] })
                ] })
              ]
            },
            t._id || t.name
          ))
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-16 text-center", children: /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/success-stories",
          className: "btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold uppercase tracking-[0.08em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300",
          children: [
            /* @__PURE__ */ jsx("span", { children: "View All Success Stories" }),
            /* @__PURE__ */ jsx(Icon, { name: "arrow_forward", className: "text-lg" })
          ]
        }
      ) })
    ] }),
    selectedVideo && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-outline-variant/20", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setSelectedVideo(null),
          className: "absolute top-4 right-4 z-10 text-white bg-black/40 hover:bg-black/80 p-2 rounded-full transition-colors cursor-pointer",
          "aria-label": "Close video player",
          children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-2xl" })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "w-full aspect-video", children: isEmbeddable(selectedVideo) ? /* @__PURE__ */ jsx(
        "iframe",
        {
          src: getEmbedUrl(selectedVideo),
          title: "Student Video Testimonial",
          allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true,
          className: "w-full h-full border-none"
        }
      ) : /* @__PURE__ */ jsx(
        "video",
        {
          src: selectedVideo,
          controls: true,
          autoPlay: true,
          className: "w-full h-full object-contain"
        }
      ) })
    ] }) })
  ] });
}
function Process() {
  const steps = [
    {
      icon: "query_stats",
      t: "Strategic Diagnostic",
      d: "We conduct a comprehensive review of your test history and strengths to build a baseline profile."
    },
    {
      icon: "route",
      t: "Bespoke Study Plan",
      d: "A custom-tailored curriculum path targeting specific weakness clusters and reinforcing core skills."
    },
    {
      icon: "fitness_center",
      t: "Targeted Practice",
      d: "High-intensity section drills, timed diagnostic assessments, and direct expert counseling."
    },
    {
      icon: "workspace_premium",
      t: "Elite Admissions",
      d: "Ongoing personal advisory through essay submissions, interviews, and final application strategies."
    }
  ];
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const item = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "timeline", className: "py-24 md:py-36 bg-background relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 left-[10%] w-[1px] bg-outline-variant/15 pointer-events-none" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 bottom-0 right-[10%] w-[1px] bg-outline-variant/15 pointer-events-none" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 relative z-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-2xl text-center space-y-4", children: [
        /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent", children: "The Methodology" }),
        /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-extrabold tracking-tight md:text-5xl text-primary", children: "Our Strategy For Success" }),
        /* @__PURE__ */ jsx("div", { className: "h-[1px] w-16 bg-accent mx-auto my-2" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-body font-light text-base md:text-lg leading-relaxed", children: "A precise, results-oriented framework designed to help students exceed score boundaries and secure Ivy League entries." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative mt-24", children: [
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block absolute top-[48px] left-[6%] right-[6%] h-[1px] bg-accent/30 -z-10" }),
        /* @__PURE__ */ jsx(
          motion.ol,
          {
            variants: container,
            initial: "hidden",
            whileInView: "show",
            viewport: { once: true, margin: "-100px" },
            className: "grid gap-8 sm:grid-cols-2 lg:grid-cols-4",
            children: steps.map((s, i) => /* @__PURE__ */ jsxs(
              motion.li,
              {
                variants: item,
                className: "relative rounded-xl border border-outline-variant/50 bg-surface p-8 shark-shadow transition-all duration-300 hover:border-accent",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "absolute -top-4 left-6 inline-flex h-8 items-center rounded-full border border-accent/40 bg-surface px-4 font-body text-[10px] font-bold tracking-[0.12em] text-accent uppercase", children: [
                    "Phase 0",
                    i + 1
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mt-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-accent border border-accent/20", children: /* @__PURE__ */ jsx(Icon, { name: s.icon, className: "text-[22px]" }) }),
                    /* @__PURE__ */ jsxs("span", { className: "font-display text-4xl italic font-extralight text-outline-variant/40 leading-none", children: [
                      "0",
                      i + 1
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("h3", { className: "mt-6 font-display text-2xl font-bold text-primary", children: s.t }),
                  /* @__PURE__ */ jsx("p", { className: "mt-3 font-body text-sm font-light text-on-surface-variant leading-relaxed", children: s.d })
                ]
              },
              s.t
            ))
          }
        )
      ] })
    ] })
  ] });
}
function CalendlyWidget() {
  const availableSlots = [3, 8, 15, 22];
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-accent/30 bg-surface/5 p-6 backdrop-blur-md shark-shadow", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-accent pb-4 border-b border-white/15", children: [
      /* @__PURE__ */ jsx(Icon, { name: "calendar_month", className: "text-[22px]" }),
      /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.15em]", children: "Available Consultations" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid grid-cols-7 gap-2", children: [
      ["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => /* @__PURE__ */ jsx("div", { className: "text-center font-body text-[9px] font-bold text-on-primary/60", children: day }, idx)),
      Array.from({ length: 28 }).map((_, i) => {
        const isAvailable = availableSlots.includes(i + 1);
        return /* @__PURE__ */ jsx(
          motion.div,
          {
            whileHover: isAvailable ? { scale: 1.15 } : {},
            className: `aspect-square rounded-full text-center text-[10px] leading-none flex items-center justify-center font-mono transition-colors duration-300 cursor-pointer ${isAvailable ? "bg-accent text-primary font-bold shadow-md hover:bg-on-primary" : "bg-white/5 text-on-primary/30"}`,
            children: i + 1
          },
          i
        );
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-2 text-[10px] font-body text-on-primary/60 tracking-wide", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-block h-2.5 w-2.5 rounded-full bg-accent" }),
      /* @__PURE__ */ jsx("span", { children: "Selectable consulting slots highlighted in Gold" })
    ] })
  ] });
}
const openCalendly = async () => {
  {
    throw new Error("Calendly URL is not configured.");
  }
};
function Booking() {
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
  return /* @__PURE__ */ jsx("section", { id: "booking", className: "py-24 md:py-36 bg-background", children: /* @__PURE__ */ jsx("div", { className: "mx-auto max-w-[1100px] px-6", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.98 },
      whileInView: { opacity: 1, scale: 1 },
      viewport: { once: true, margin: "-100px" },
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
      className: "rounded-2xl bg-primary text-on-primary p-8 md:p-16 shark-shadow relative overflow-hidden border border-accent/40",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute -right-24 -top-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl"
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "aria-hidden": true,
            className: "absolute -left-24 -bottom-24 h-80 w-80 rounded-full bg-secondary-container/10 blur-3xl"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "relative grid gap-12 md:grid-cols-12 md:items-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "md:col-span-7 space-y-6", children: [
            /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent", children: "Private Consultation" }),
            /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-extrabold tracking-tight md:text-5xl leading-tight text-on-primary", children: "Schedule Your Admissions Assessment" }),
            /* @__PURE__ */ jsx("p", { className: "font-body text-base font-light leading-relaxed text-on-primary/80", children: "Align with an elite advisor to map your baseline scores, review target university lists, and design a strategic roadmap tailored to your admissions timeline." }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleBookConsultation,
                disabled: isOpeningCalendly,
                className: "btn-shimmer inline-flex items-center gap-3 rounded-xl bg-accent px-8 py-4 text-xs font-bold uppercase tracking-[0.1em] text-primary shark-shadow hover:bg-on-primary hover:text-primary transition-all duration-300 cursor-pointer disabled:opacity-70",
                children: [
                  /* @__PURE__ */ jsx(Icon, { name: "calendar_month", className: "text-[16px]" }),
                  isOpeningCalendly ? "Initializing Secure Link..." : "Select Booking Slot"
                ]
              }
            ),
            calendlyError && /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-red-300 font-body flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Icon, { name: "error", className: "text-[16px]" }),
              " ",
              calendlyError
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "md:col-span-5", children: /* @__PURE__ */ jsx(CalendlyWidget, {}) })
        ] })
      ]
    }
  ) }) });
}
function CTA() {
  return /* @__PURE__ */ jsxs(
    "section",
    {
      id: "contact",
      className: "bg-primary text-on-primary py-24 md:py-36 relative overflow-hidden border-t border-accent/20",
      children: [
        /* @__PURE__ */ jsxs("div", { "aria-hidden": true, className: "absolute inset-0 opacity-30 pointer-events-none", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute -top-32 left-1/4 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-3xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-1/4 h-[30rem] w-[30rem] rounded-full bg-secondary-container/15 blur-3xl" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative mx-auto grid max-w-[1200px] gap-16 px-6 lg:grid-cols-12 z-10 items-center", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, x: -30 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              className: "lg:col-span-6 space-y-8",
              children: [
                /* @__PURE__ */ jsx("span", { className: "font-body text-[11px] font-bold uppercase tracking-[0.2em] text-accent", children: "Inquiries" }),
                /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl font-extrabold tracking-tight md:text-5xl leading-tight text-on-primary", children: "Your Premium Admissions Journey Starts Here" }),
                /* @__PURE__ */ jsx("p", { className: "max-w-md font-body text-base font-light text-on-primary/80 leading-relaxed", children: "Do not leave your academic future to chance. Connect with our advisory board and gain the structural support required to excel." }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-5 pt-4", children: [
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "mailto:hello@satsharks.com",
                      className: "flex items-center gap-4 group hover:text-accent transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:border-accent/40 transition-colors", children: /* @__PURE__ */ jsx(Icon, { name: "mail", className: "text-accent text-[20px]" }) }),
                        /* @__PURE__ */ jsx("span", { className: "font-body text-sm font-semibold", children: "hello@satsharks.com" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: "tel:+18005550199",
                      className: "flex items-center gap-4 group hover:text-accent transition-colors",
                      children: [
                        /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/10 group-hover:border-accent/40 transition-colors", children: /* @__PURE__ */ jsx(Icon, { name: "call", className: "text-accent text-[20px]" }) }),
                        /* @__PURE__ */ jsx("span", { className: "font-body text-sm font-semibold", children: "+1 (800) 555-0199" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 group", children: [
                    /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-xl bg-white/5 border border-white/10 pointer-events-none", children: /* @__PURE__ */ jsx(Icon, { name: "location_on", className: "text-accent text-[20px]" }) }),
                    /* @__PURE__ */ jsx("span", { className: "font-body text-sm font-semibold", children: "123 Education Lane, Boston, MA" })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pt-6", children: ["share", "thumb_up", "favorite"].map((i) => /* @__PURE__ */ jsx(
                  motion.button,
                  {
                    whileHover: { y: -3 },
                    className: "grid h-11 w-11 place-items-center rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 text-on-primary hover:text-accent transition-colors cursor-pointer",
                    children: /* @__PURE__ */ jsx(Icon, { name: i, className: "text-[18px]" })
                  },
                  i
                )) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 30 },
              whileInView: { opacity: 1, x: 0 },
              viewport: { once: true, margin: "-100px" },
              transition: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
              className: "lg:col-span-6",
              children: /* @__PURE__ */ jsxs(
                "form",
                {
                  onSubmit: (e) => e.preventDefault(),
                  className: "rounded-xl border border-accent/20 bg-surface text-on-surface p-8 md:p-10 shark-shadow",
                  children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-display text-3xl font-bold text-primary", children: "Send us a message" }),
                    /* @__PURE__ */ jsx("p", { className: "font-body text-xs font-light text-on-surface-variant/80 mt-1", children: "Complete the fields below to initiate your consultation ticket." }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block font-body text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant", children: "Full Name" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "text",
                            placeholder: "Jane Doe",
                            className: "mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all font-body font-light"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block font-body text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant", children: "Email Address" }),
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "email",
                            placeholder: "you@example.com",
                            className: "mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all font-body font-light"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("label", { className: "block font-body text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant", children: "Message Details" }),
                        /* @__PURE__ */ jsx(
                          "textarea",
                          {
                            rows: 4,
                            placeholder: "Tell us about your educational background and target universities...",
                            className: "mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-low px-4 py-3 text-sm text-on-surface outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all font-body font-light resize-none"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          type: "submit",
                          className: "btn-shimmer mt-2 inline-flex w-full items-center justify-center gap-3 rounded-lg bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.1em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300 cursor-pointer",
                          children: [
                            "Submit Inquiry ",
                            /* @__PURE__ */ jsx(Icon, { name: "send", className: "text-[16px]" })
                          ]
                        }
                      )
                    ] })
                  ]
                }
              )
            }
          )
        ] })
      ]
    }
  );
}
function Landing() {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-on-background overflow-x-hidden animate-fade-up", children: [
    /* @__PURE__ */ jsx(Header, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx(Stats, {}),
      /* @__PURE__ */ jsx(Services, {}),
      /* @__PURE__ */ jsx(Testimonials, {}),
      /* @__PURE__ */ jsx(Process, {}),
      /* @__PURE__ */ jsx(Booking, {}),
      /* @__PURE__ */ jsx(CTA, {})
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}
export {
  Landing as component
};
