import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { a as api } from "./router-Be_1-VPB.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "@tanstack/react-router";
import "./Header-BhkqVqMe.js";
import "./Icon-Fsbc55mr.js";
import "@tanstack/react-query";
function AdminUsers() {
  const {
    user
  } = useAuth();
  const [usersList, setUsersList] = useState([]);
  const fetchUsers = async () => {
    const res = await api.get("/api/users");
    if (res.success) setUsersList(res.users || []);
  };
  useEffect(() => {
    if (user?.role === "ADMIN") fetchUsers();
  }, [user]);
  const updateSubscription = async (id, current) => {
    const nextSub = current === "FREE" ? "PAID" : "FREE";
    const res = await api.put(`/api/users/${id}/subscription`, {
      subscription: nextSub
    });
    if (res.success) {
      setUsersList((prev) => prev.map((u) => u._id === id ? {
        ...u,
        subscription: nextSub
      } : u));
    }
  };
  const updateStatus = async (id, current) => {
    const nextStatus = current === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    const res = await api.put(`/api/users/${id}/status`, {
      status: nextStatus
    });
    if (res.success) {
      setUsersList((prev) => prev.map((u) => u._id === id ? {
        ...u,
        status: nextStatus
      } : u));
    }
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/users", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "User Management" }),
    /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Name & Email" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Country" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Tier" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-outline-variant/20", children: usersList.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-surface-container-low/50 transition-colors", children: [
        /* @__PURE__ */ jsxs("td", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
            u.name,
            " ",
            u.role === "ADMIN" && /* @__PURE__ */ jsx(Badge, { variant: "accent", className: "ml-2", children: "ADMIN" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-on-surface-variant", children: u.email })
        ] }),
        /* @__PURE__ */ jsxs("td", { className: "p-4 text-sm", children: [
          /* @__PURE__ */ jsx("div", { children: u.country }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-on-surface-variant", children: u.region })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: u.subscription === "PAID" ? "accent" : "default", children: u.subscription }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: u.status === "ACTIVE" ? "success" : "error", children: u.status }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: u.role !== "ADMIN" && /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => updateSubscription(u._id, u.subscription), className: "px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest rounded text-sm transition-colors cursor-pointer", children: u.subscription === "FREE" ? "Upgrade" : "Downgrade" }),
          /* @__PURE__ */ jsx("button", { onClick: () => updateStatus(u._id, u.status), className: `px-3 py-1 rounded text-sm transition-colors cursor-pointer ${u.status === "ACTIVE" ? "bg-error/10 text-error hover:bg-error/20" : "bg-primary/10 text-primary hover:bg-primary/20"}`, children: u.status === "ACTIVE" ? "Suspend" : "Activate" })
        ] }) })
      ] }, u._id)) })
    ] }) })
  ] });
}
export {
  AdminUsers as component
};
