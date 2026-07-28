import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "@tanstack/react-router";
import "./Header-BhkqVqMe.js";
import "@tanstack/react-query";
function AdminContactRequests() {
  const {
    user
  } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  useEffect(() => {
    if (user?.role === "ADMIN") {
      api.get("/api/contact").then((res) => {
        if (res.success) setInquiries(res.inquiries || []);
      });
    }
  }, [user]);
  const updateStatus = async (id, status) => {
    const res = await api.put(`/api/contact/${id}/status`, {
      status
    });
    if (res.success) {
      setInquiries((prev) => prev.map((i) => i._id === id ? {
        ...i,
        status
      } : i));
    }
  };
  const statusVariant = (s) => {
    if (s === "NEW") return "error";
    if (s === "IN_PROGRESS") return "warning";
    return "success";
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/contact-requests", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold mb-8", children: "Contact Inquiries" }),
    inquiries.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: "mail", title: "No inquiries yet", description: "Contact form submissions will appear here" }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: inquiries.map((inquiry) => /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow hover-lift", children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
          /* @__PURE__ */ jsxs("h3", { className: "font-semibold text-lg", children: [
            inquiry.firstName,
            " ",
            inquiry.lastName
          ] }),
          /* @__PURE__ */ jsx(Badge, { variant: statusVariant(inquiry.status || "NEW"), children: inquiry.status || "NEW" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-on-surface-variant flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Icon, { name: "mail", className: "text-[14px]" }),
          " ",
          inquiry.email
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 font-medium text-sm", children: /* @__PURE__ */ jsx(Badge, { variant: "info", children: inquiry.category }) }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-on-surface leading-relaxed", children: inquiry.message }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-on-surface-variant", children: new Date(inquiry.createdAt).toLocaleDateString() })
      ] }),
      /* @__PURE__ */ jsxs("select", { value: inquiry.status || "NEW", onChange: (e) => updateStatus(inquiry._id, e.target.value), className: "rounded-lg border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm", children: [
        /* @__PURE__ */ jsx("option", { value: "NEW", children: "New" }),
        /* @__PURE__ */ jsx("option", { value: "IN_PROGRESS", children: "In Progress" }),
        /* @__PURE__ */ jsx("option", { value: "RESOLVED", children: "Resolved" })
      ] })
    ] }) }, inquiry._id)) })
  ] });
}
export {
  AdminContactRequests as component
};
