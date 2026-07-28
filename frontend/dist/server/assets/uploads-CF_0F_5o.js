import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { M as Modal } from "./Modal-IFcukRHK.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import "./Header-BhkqVqMe.js";
import "./useAuth-CCZE-M2R.js";
import "@tanstack/react-query";
function AdminUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fetchUploads = async () => {
    const res = await api.get("/api/uploads");
    if (res.success) setUploads(res.uploads || []);
    setLoading(false);
  };
  useEffect(() => {
    fetchUploads();
  }, []);
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      setError("Title and file are required.");
      return;
    }
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("/api/uploads/practice-test", {
        method: "POST",
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setTitle("");
        setFile(null);
        fetchUploads();
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Upload failed. Server error.");
    }
    setUploading(false);
  };
  const handleExtract = async (id) => {
    await api.post(`/api/uploads/${id}/extract`, {});
    fetchUploads();
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this upload?")) return;
    await api.delete(`/api/uploads/${id}`);
    fetchUploads();
  };
  const statusVariant = (s) => {
    const map = {
      UPLOADED: "default",
      PROCESSING: "warning",
      EXTRACTED: "info",
      REVIEWED: "accent",
      PUBLISHED: "success",
      FAILED: "error"
    };
    return map[s] || "default";
  };
  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/uploads", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Upload Management" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm mt-1", children: "Upload practice test PDFs and extract questions with AI" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => {
        setModalOpen(true);
        setError("");
      }, className: "btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: "upload_file", className: "text-lg" }),
        " Upload PDF"
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "text-center py-12 text-on-surface-variant", children: "Loading..." }) : uploads.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: "upload_file", title: "No uploads yet", description: "Upload a practice test PDF to get started" }) : /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant", children: [
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Title" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "File" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Status" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Questions" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Date" }),
        /* @__PURE__ */ jsx("th", { className: "p-4 font-semibold", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-outline-variant/20", children: uploads.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-surface-container-low/50 transition-colors", children: [
        /* @__PURE__ */ jsx("td", { className: "p-4 font-semibold text-sm", children: u.title }),
        /* @__PURE__ */ jsxs("td", { className: "p-4 text-sm text-on-surface-variant", children: [
          /* @__PURE__ */ jsx("div", { children: u.fileName }),
          /* @__PURE__ */ jsx("div", { className: "text-xs", children: formatSize(u.fileSize) })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsx(Badge, { variant: statusVariant(u.status), children: u.status }) }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-sm font-mono", children: u.extractedQuestions?.length || 0 }),
        /* @__PURE__ */ jsx("td", { className: "p-4 text-sm text-on-surface-variant", children: new Date(u.createdAt).toLocaleDateString() }),
        /* @__PURE__ */ jsx("td", { className: "p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          u.status === "UPLOADED" && /* @__PURE__ */ jsx("button", { onClick: () => handleExtract(u._id), className: "px-3 py-1 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded text-sm font-semibold transition-colors cursor-pointer", children: "Extract" }),
          (u.status === "EXTRACTED" || u.status === "REVIEWED") && /* @__PURE__ */ jsx(Link, { to: `/admin/review-upload/${u._id}`, className: "px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded text-sm font-semibold transition-colors", children: "Review" }),
          /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(u._id), className: "px-3 py-1 bg-error/10 text-error hover:bg-error/20 rounded text-sm transition-colors cursor-pointer", children: "Delete" })
        ] }) })
      ] }, u._id)) })
    ] }) }),
    /* @__PURE__ */ jsxs(Modal, { open: modalOpen, onClose: () => setModalOpen(false), title: "Upload Practice Test", icon: "upload_file", children: [
      error && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Icon, { name: "error", className: "shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: error })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleUpload, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Title", value: title, onChange: (e) => setTitle(e.target.value), required: true, placeholder: "e.g. Official SAT Practice Test 1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1.5 block font-mono text-[12px] uppercase tracking-[0.08em] text-on-surface-variant", children: "PDF File" }),
          /* @__PURE__ */ jsxs("div", { className: "border-2 border-dashed border-outline-variant rounded-xl p-8 text-center hover:border-primary/40 transition-colors", children: [
            /* @__PURE__ */ jsx(Icon, { name: "cloud_upload", className: "text-4xl text-on-surface-variant/40 mb-2" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-on-surface-variant mb-3", children: file ? file.name : "Click to select or drag and drop a PDF" }),
            /* @__PURE__ */ jsx("input", { type: "file", accept: ".pdf", onChange: (e) => setFile(e.target.files?.[0] || null), className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer", style: {
              position: "relative"
            } })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4 border-t border-outline-variant/30", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setModalOpen(false), className: "flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: uploading, className: "flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer", children: uploading ? "Uploading..." : "Upload" })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminUploads as component
};
