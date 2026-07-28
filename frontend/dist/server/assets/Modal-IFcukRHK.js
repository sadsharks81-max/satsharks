import { jsx, jsxs } from "react/jsx-runtime";
import { I as Icon } from "./Icon-Fsbc55mr.js";
function Modal({ open, onClose, title, icon, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in", children: /* @__PURE__ */ jsxs("div", { className: `bg-surface-container-lowest border border-outline-variant/65 rounded-2xl shadow-xl w-full ${maxWidth} p-6 relative flex flex-col my-8`, children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: onClose,
        className: "absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-low transition-colors",
        children: /* @__PURE__ */ jsx(Icon, { name: "close", className: "text-2xl" })
      }
    ),
    /* @__PURE__ */ jsxs("h2", { className: "text-2xl font-bold mb-4 flex items-center gap-2", children: [
      icon && /* @__PURE__ */ jsx(Icon, { name: icon, className: "text-primary" }),
      title
    ] }),
    children
  ] }) });
}
export {
  Modal as M
};
