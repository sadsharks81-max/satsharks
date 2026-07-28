import { jsx } from "react/jsx-runtime";
import { Navigate, Outlet } from "@tanstack/react-router";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "react";
import "./router-Be_1-VPB.js";
import "@tanstack/react-query";
function DashboardLayout() {
  const {
    user,
    isLoading
  } = useAuth();
  if (isLoading) return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading..." });
  if (!user) return /* @__PURE__ */ jsx(Navigate, { to: "/auth/login" });
  if (user.role === "ADMIN") return /* @__PURE__ */ jsx(Navigate, { to: "/admin" });
  return /* @__PURE__ */ jsx(Outlet, {});
}
export {
  DashboardLayout as component
};
