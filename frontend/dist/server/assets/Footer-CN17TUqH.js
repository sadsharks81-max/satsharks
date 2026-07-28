import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { l as logoImg } from "./Header-BhkqVqMe.js";
function Footer() {
  const links = [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Service", to: "/" },
    { label: "Careers", to: "/" },
    { label: "Contact Us", to: "/contact" }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "bg-primary border-t border-accent/30 text-on-primary/80", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-[1200px] px-6 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-between gap-6 border-b border-white/10 pb-8 md:flex-row", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-3 group", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: logoImg,
          alt: "SAT Sharks",
          className: "h-14 w-auto invert mix-blend-screen opacity-95"
        }
      ) }),
      /* @__PURE__ */ jsx("ul", { className: "flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-body text-[11px] font-bold uppercase tracking-[0.12em]", children: links.map((l) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
        Link,
        {
          to: l.to,
          className: "hover:text-accent transition-colors duration-300",
          children: l.label
        }
      ) }, l.label)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-center md:text-left", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-body text-[10px] font-medium tracking-wider text-on-primary/50", children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " SAT Sharks. All rights reserved. Your path to academic triumph."
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-body text-[10px] font-medium tracking-wider text-on-primary/50", children: "Admissions Consulting & SAT Prep Excellence." })
    ] })
  ] }) });
}
export {
  Footer as F
};
