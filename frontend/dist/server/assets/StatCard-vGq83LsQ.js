import { jsx, jsxs } from "react/jsx-runtime";
import { I as Icon } from "./Icon-Fsbc55mr.js";
const colorMap = {
  primary: "text-primary",
  accent: "text-accent",
  secondary: "text-secondary",
  error: "text-error"
};
function StatCard({ label, value, icon, color = "primary" }) {
  return /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow hover-lift", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-on-surface-variant text-sm mb-1", children: label }),
      /* @__PURE__ */ jsx("div", { className: `text-3xl font-bold ${colorMap[color]}`, children: value })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-lg bg-primary-fixed flex items-center justify-center", children: /* @__PURE__ */ jsx(Icon, { name: icon, className: `text-[22px] ${colorMap[color]}` }) })
  ] }) });
}
export {
  StatCard as S
};
