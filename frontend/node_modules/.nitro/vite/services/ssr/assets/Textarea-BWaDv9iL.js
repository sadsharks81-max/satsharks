import { jsxs, jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
const Textarea = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
      label && /* @__PURE__ */ jsx("label", { className: "mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant", children: label }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref,
          className: `w-full rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none ${error ? "border-error focus:border-error focus:ring-error/20" : ""} ${className}`,
          ...props
        }
      ),
      error && /* @__PURE__ */ jsx("p", { className: "mt-1.5 text-xs text-error", children: error })
    ] });
  }
);
Textarea.displayName = "Textarea";
export {
  Textarea as T
};
