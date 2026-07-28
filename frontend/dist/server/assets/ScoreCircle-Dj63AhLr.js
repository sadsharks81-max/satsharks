import { jsxs, jsx } from "react/jsx-runtime";
function ScoreCircle({ score, maxScore = 1600, size = 160, label, sublabel }) {
  const percentage = Math.min(score / maxScore * 100, 100);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percentage / 100 * circumference;
  const getColor = () => {
    if (percentage >= 75) return "text-primary";
    if (percentage >= 50) return "text-accent";
    return "text-error";
  };
  const getStrokeColor = () => {
    if (percentage >= 75) return "#1F245C";
    if (percentage >= 50) return "#F4B300";
    return "#EF4444";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-2", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative", style: { width: size, height: size }, children: [
      /* @__PURE__ */ jsxs("svg", { width: size, height: size, className: "-rotate-90", children: [
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: "var(--color-outline-variant)",
            strokeWidth: "8"
          }
        ),
        /* @__PURE__ */ jsx(
          "circle",
          {
            cx: size / 2,
            cy: size / 2,
            r: radius,
            fill: "none",
            stroke: getStrokeColor(),
            strokeWidth: "8",
            strokeLinecap: "round",
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            className: "transition-all duration-1000 ease-out"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [
        /* @__PURE__ */ jsx("span", { className: `text-3xl font-extrabold font-display ${getColor()}`, children: score }),
        maxScore !== 100 && /* @__PURE__ */ jsxs("span", { className: "text-xs text-on-surface-variant font-mono", children: [
          "/ ",
          maxScore
        ] })
      ] })
    ] }),
    label && /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold text-on-surface", children: label }),
    sublabel && /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: sublabel })
  ] });
}
export {
  ScoreCircle as S
};
