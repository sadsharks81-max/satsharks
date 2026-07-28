import { jsxs, jsx } from "react/jsx-runtime";
import { I as Icon } from "./Icon-Fsbc55mr.js";
function EmptyState({ icon, title, description, action }) {
  return /* @__PURE__ */ jsxs("div", { className: "text-center py-16 border border-dashed border-outline-variant/60 rounded-2xl bg-surface-container-lowest", children: [
    /* @__PURE__ */ jsx(Icon, { name: icon, className: "text-5xl text-on-surface-variant/40 mb-4" }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold text-on-surface mb-1", children: title }),
    description && /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mb-6", children: description }),
    action
  ] });
}
export {
  EmptyState as E
};
