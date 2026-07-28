import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { A as AdminLayout } from "./AdminLayout-f1rdBm4s.js";
import { M as Modal } from "./Modal-IFcukRHK.js";
import { B as Badge } from "./Badge-CruYiyAR.js";
import { I as Icon } from "./Icon-Fsbc55mr.js";
import { I as Input } from "./Input-3QnCriAW.js";
import { T as Textarea } from "./Textarea-BWaDv9iL.js";
import { E as EmptyState } from "./EmptyState-CLtSl-5O.js";
import { a as api } from "./router-Be_1-VPB.js";
import { u as useAuth } from "./useAuth-CCZE-M2R.js";
import "@tanstack/react-router";
import "./Header-BhkqVqMe.js";
import "@tanstack/react-query";
function AdminSuccessStories() {
  const {
    user
  } = useAuth();
  const [stories, setStories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    score: "",
    university: "",
    quote: "",
    imageUrl: "",
    videoUrl: ""
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchStories = async () => {
    const res = await api.get("/api/success-stories");
    if (res.success) setStories(res.stories || []);
  };
  useEffect(() => {
    if (user?.role === "ADMIN") fetchStories();
  }, [user]);
  const openAddModal = () => {
    setEditingStory(null);
    setFormData({
      name: "",
      score: "",
      university: "",
      quote: "",
      imageUrl: "",
      videoUrl: ""
    });
    setFormError("");
    setIsModalOpen(true);
  };
  const openEditModal = (story) => {
    setEditingStory(story);
    setFormData({
      name: story.name,
      score: story.score,
      university: story.university,
      quote: story.quote,
      imageUrl: story.imageUrl || "",
      videoUrl: story.videoUrl || ""
    });
    setFormError("");
    setIsModalOpen(true);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.score || !formData.university || !formData.quote) {
      setFormError("Name, Score, University, and Quote are required.");
      return;
    }
    setIsSubmitting(true);
    const res = editingStory?._id ? await api.put(`/api/success-stories/${editingStory._id}`, formData) : await api.post("/api/success-stories", formData);
    if (res.success) {
      setIsModalOpen(false);
      fetchStories();
    } else setFormError(res.error || "Failed to save.");
    setIsSubmitting(false);
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this success story?")) return;
    await api.delete(`/api/success-stories/${id}`);
    setStories((prev) => prev.filter((s) => s._id !== id));
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { activeItem: "/admin/success-stories", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Success Stories" }),
      /* @__PURE__ */ jsxs("button", { onClick: openAddModal, className: "btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer", children: [
        /* @__PURE__ */ jsx(Icon, { name: "add", className: "text-lg" }),
        " Add Story"
      ] })
    ] }),
    stories.length === 0 ? /* @__PURE__ */ jsx(EmptyState, { icon: "social_leaderboard", title: "No success stories", description: "Add your first success story!" }) : /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: stories.map((story) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/40 flex flex-col justify-between hover-lift", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          story.imageUrl ? /* @__PURE__ */ jsx("img", { src: story.imageUrl, alt: story.name, className: "w-12 h-12 rounded-full object-cover border border-outline-variant" }) : /* @__PURE__ */ jsx("div", { className: "grid h-12 w-12 place-items-center rounded-full bg-primary text-on-primary font-display text-lg font-bold", children: story.name.charAt(0) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "font-semibold text-on-surface text-lg", children: story.name }),
            /* @__PURE__ */ jsx("div", { className: "font-mono text-xs uppercase tracking-wider text-primary", children: story.score })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-on-surface-variant flex items-center gap-1 mb-3", children: [
          /* @__PURE__ */ jsx(Icon, { name: "school", className: "text-sm" }),
          " ",
          story.university
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-on-surface italic leading-relaxed line-clamp-3 mb-4", children: [
          '"',
          story.quote,
          '"'
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 text-xs font-mono", children: [
          story.imageUrl && /* @__PURE__ */ jsx(Badge, { variant: "info", children: "Image" }),
          story.videoUrl && /* @__PURE__ */ jsx(Badge, { variant: "accent", children: "Video" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3 pt-4 border-t border-outline-variant/30 mt-4", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => openEditModal(story), className: "flex-1 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "edit", className: "text-[16px]" }),
          " Edit"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => handleDelete(story._id), className: "flex-1 py-2 rounded-lg bg-error/10 hover:bg-error/20 text-error text-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer", children: [
          /* @__PURE__ */ jsx(Icon, { name: "delete", className: "text-[16px]" }),
          " Delete"
        ] })
      ] })
    ] }, story._id || story.name)) }),
    /* @__PURE__ */ jsxs(Modal, { open: isModalOpen, onClose: () => setIsModalOpen(false), title: editingStory ? "Edit Success Story" : "Add Success Story", icon: editingStory ? "edit" : "add_box", children: [
      formError && /* @__PURE__ */ jsxs("div", { className: "mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Icon, { name: "error", className: "shrink-0" }),
        /* @__PURE__ */ jsx("span", { children: formError })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsx(Input, { label: "Student Name *", value: formData.name, onChange: (e) => setFormData((p) => ({
          ...p,
          name: e.target.value
        })), required: true, placeholder: "e.g. Sarah M." }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(Input, { label: "Score *", value: formData.score, onChange: (e) => setFormData((p) => ({
            ...p,
            score: e.target.value
          })), required: true, placeholder: "e.g. Scored 1580 (+210)" }),
          /* @__PURE__ */ jsx(Input, { label: "University *", value: formData.university, onChange: (e) => setFormData((p) => ({
            ...p,
            university: e.target.value
          })), required: true, placeholder: "e.g. Harvard" })
        ] }),
        /* @__PURE__ */ jsx(Input, { label: "Image URL", type: "url", value: formData.imageUrl, onChange: (e) => setFormData((p) => ({
          ...p,
          imageUrl: e.target.value
        })), placeholder: "https://..." }),
        /* @__PURE__ */ jsx(Input, { label: "Video URL", type: "url", value: formData.videoUrl, onChange: (e) => setFormData((p) => ({
          ...p,
          videoUrl: e.target.value
        })), placeholder: "YouTube or MP4 URL" }),
        /* @__PURE__ */ jsx(Textarea, { label: "Quote *", value: formData.quote, onChange: (e) => setFormData((p) => ({
          ...p,
          quote: e.target.value
        })), required: true, rows: 3, placeholder: "Student testimonial..." }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-4 border-t border-outline-variant/30", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { type: "submit", disabled: isSubmitting, className: "flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer", children: isSubmitting ? "Saving..." : "Save Story" })
        ] })
      ] })
    ] })
  ] });
}
export {
  AdminSuccessStories as component
};
