import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { Modal } from "../../components/ui/Modal";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { EmptyState } from "../../components/ui/EmptyState";
import { api, getBackendUrl, resolveImageUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/admin/success-stories")({
  component: AdminSuccessStories,
});

interface StoryForm {
  _id?: string;
  name: string;
  score: string;
  university: string;
  quote: string;
  imageUrl: string;
  videoUrl: string;
  category: "SAT" | "ADMISSION";
}

function AdminSuccessStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState<any[]>([]);
  const [filterCategory, setFilterCategory] = useState<"ALL" | "SAT" | "ADMISSION">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<StoryForm | null>(null);
  const [formData, setFormData] = useState<StoryForm>({
    name: "", score: "", university: "", quote: "", imageUrl: "", videoUrl: "", category: "SAT",
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hero feature banner student state
  const [heroFeature, setHeroFeature] = useState<any>(null);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [heroFormData, setHeroFormData] = useState({
    studentName: "", university: "", score: "", improvement: "", tag: "", imageUrl: ""
  });
  const [heroError, setHeroError] = useState("");
  const [isHeroSubmitting, setIsHeroSubmitting] = useState(false);

  const fetchStories = async () => {
    const res = await api.get("/api/success-stories");
    if (res.success) setStories(res.stories || []);
  };

  const fetchHeroFeature = async () => {
    const res = await api.get("/api/success-stories/featured");
    if (res.success) setHeroFeature(res.feature);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchStories();
      fetchHeroFeature();
    }
  }, [user]);

  const uploadImageFile = async (file: File): Promise<string | null> => {
    const uploadData = new FormData();
    uploadData.append("image", file);

    const token = localStorage.getItem("accessToken");
    const headers: HeadersInit = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    try {
      const res = await fetch(`${getBackendUrl()}/api/uploads/image`, {
        method: "POST",
        headers,
        body: uploadData
      });
      const data = await res.json();
      if (data.success) {
        return data.url;
      } else {
        alert(data.error || "Image upload failed");
        return null;
      }
    } catch (err) {
      console.error(err);
      alert("Network error during image upload");
      return null;
    }
  };

  const handleHeroImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) {
      setHeroFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const handleStoryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadImageFile(file);
    if (url) {
      setFormData(prev => ({ ...prev, imageUrl: url }));
    }
  };

  const openAddModal = () => {
    setEditingStory(null);
    setFormData({ name: "", score: "", university: "", quote: "", imageUrl: "", videoUrl: "", category: "SAT" });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (story: any) => {
    setEditingStory(story);
    setFormData({
      name: story.name, score: story.score, university: story.university,
      quote: story.quote, imageUrl: story.imageUrl || "", videoUrl: story.videoUrl || "",
      category: story.category || "SAT",
    });
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditHeroModal = () => {
    if (heroFeature) {
      setHeroFormData({
        studentName: heroFeature.studentName,
        university: heroFeature.university,
        score: heroFeature.score,
        improvement: heroFeature.improvement,
        tag: heroFeature.tag,
        imageUrl: heroFeature.imageUrl || ""
      });
    }
    setHeroError("");
    setIsHeroModalOpen(true);
  };

  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHeroError("");
    setIsHeroSubmitting(true);
    const res = await api.put("/api/success-stories/featured", heroFormData);
    if (res.success) {
      setIsHeroModalOpen(false);
      fetchHeroFeature();
    } else {
      setHeroError(res.error || "Failed to save hero feature.");
    }
    setIsHeroSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!formData.name || !formData.score || !formData.university || !formData.quote) {
      setFormError("Name, Score, University, and Quote are required.");
      return;
    }
    setIsSubmitting(true);
    const res = editingStory?._id
      ? await api.put(`/api/success-stories/${editingStory._id}`, formData)
      : await api.post("/api/success-stories", formData);
    if (res.success) { setIsModalOpen(false); fetchStories(); }
    else setFormError(res.error || "Failed to save.");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this success story?")) return;
    await api.delete(`/api/success-stories/${id}`);
    setStories((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <AdminLayout activeItem="/admin/success-stories">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Success Stories</h1>
        <button onClick={openAddModal} className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer">
          <Icon name="add" className="text-lg" /> Add Story
        </button>
      </div>

      {/* Featured Hero Student Card */}
      {heroFeature && (
        <div className="mb-8 rounded-2xl bg-surface-container-low p-6 border border-outline-variant/30 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {heroFeature.imageUrl ? (
              <img
                src={resolveImageUrl(heroFeature.imageUrl)}
                alt={heroFeature.studentName}
                className="w-16 h-16 rounded-xl object-cover border border-outline-variant/50 shadow-sm shrink-0"
              />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-xl bg-accent text-primary font-display text-xl font-bold shrink-0 shadow-sm">
                ⭐
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-lg text-on-surface">{heroFeature.studentName}</span>
                <Badge variant="accent">{heroFeature.tag}</Badge>
              </div>
              <p className="text-sm text-on-surface-variant mt-1 font-semibold flex items-center gap-1">
                <Icon name="school" className="text-sm" /> {heroFeature.university}
              </p>
              <p className="text-xs text-on-surface-variant/80 mt-1 font-mono">
                SAT: <span className="font-bold text-primary">{heroFeature.score}</span> ({heroFeature.improvement})
              </p>
            </div>
          </div>
          <button
            onClick={openEditHeroModal}
            className="px-5 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Icon name="edit" className="text-[16px]" /> Edit Hero Feature
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b border-outline-variant/30 pb-3 select-none">
        {[
          { id: "ALL", label: "All Categories" },
          { id: "SAT", label: "SAT Prep" },
          { id: "ADMISSION", label: "College Admissions" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
              filterCategory === tab.id
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(() => {
        const filteredStories = stories.filter(s => filterCategory === "ALL" || s.category === filterCategory);
        if (filteredStories.length === 0) {
          return <EmptyState icon="stars" title="No success stories" description="No success stories found in this category." />;
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStories.map((story) => (
              <div key={story._id} className="bg-surface rounded-2xl p-6 border border-outline-variant/35 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover-lift">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    {story.imageUrl ? (
                      <img
                        src={resolveImageUrl(story.imageUrl)}
                        alt={story.name}
                        className="w-12 h-12 rounded-xl object-cover border border-outline-variant/50 shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary font-display text-sm font-bold shrink-0">
                        {story.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-base text-on-surface">{story.name}</h3>
                      <p className="text-xs text-primary font-mono uppercase tracking-wider font-bold">{story.category === "ADMISSION" ? "Admissions Consulting" : "SAT Prep"}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-on-surface-variant"><strong className="text-on-surface">Score:</strong> {story.score}</p>
                    <p className="text-sm text-on-surface-variant"><strong className="text-on-surface">Target Destination:</strong> {story.university}</p>
                    {story.videoUrl && (
                      <p className="text-sm text-primary font-semibold flex items-center gap-1">
                        <Icon name="play_circle" className="text-[16px]" /> Has Video Testimonial
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-on-surface-variant italic leading-relaxed mt-4 bg-surface-container-low/55 p-3 rounded-lg border border-outline-variant/20 line-clamp-4">
                    "{story.quote}"
                  </p>
                </div>
                <div className="flex gap-3 pt-4 border-t border-outline-variant/30 mt-4">
                  <button onClick={() => openEditModal(story)} className="flex-1 py-2 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border-none">
                    <Icon name="edit" className="text-[16px]" /> Edit
                  </button>
                  <button onClick={() => handleDelete(story._id)} className="flex-1 py-2 rounded-lg bg-error/10 hover:bg-error/20 text-error text-sm font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer border-none">
                    <Icon name="delete" className="text-[16px]" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStory ? "Edit Success Story" : "Add Success Story"} icon={editingStory ? "edit" : "add_box"}>
        {formError && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" /><span>{formError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Student Name *" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} required placeholder="e.g. Sarah M." />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Score *" value={formData.score} onChange={(e) => setFormData((p) => ({ ...p, score: e.target.value }))} required placeholder="e.g. Scored 1580 (+210)" />
            <Input label="University *" value={formData.university} onChange={(e) => setFormData((p) => ({ ...p, university: e.target.value }))} required placeholder="e.g. Harvard" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Image URL" type="text" value={formData.imageUrl} onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="/uploads/... or https://..." />
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Or Upload Local Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleStoryImageChange}
                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Video URL" type="url" value={formData.videoUrl} onChange={(e) => setFormData((p) => ({ ...p, videoUrl: e.target.value }))} placeholder="YouTube or MP4 URL" />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as any }))}
                className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-2.5 text-sm text-on-surface outline-none transition-all focus:border-primary cursor-pointer h-[40px] leading-tight"
              >
                <option value="SAT">SAT Prep</option>
                <option value="ADMISSION">College Admissions</option>
              </select>
            </div>
          </div>
          <Textarea label="Quote *" value={formData.quote} onChange={(e) => setFormData((p) => ({ ...p, quote: e.target.value }))} required rows={3} placeholder="Student testimonial..." />
          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer">{isSubmitting ? "Saving..." : "Save Story"}</button>
          </div>
        </form>
      </Modal>

      {/* Hero Feature Edit Modal */}
      <Modal open={isHeroModalOpen} onClose={() => setIsHeroModalOpen(false)} title="Edit Hero Featured Student" icon="edit">
        {heroError && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" /><span>{heroError}</span>
          </div>
        )}
        <form onSubmit={handleHeroSubmit} className="space-y-4">
          <Input label="Student Name *" value={heroFormData.studentName} onChange={(e) => setHeroFormData((p) => ({ ...p, studentName: e.target.value }))} required placeholder="e.g. Admitted Student" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="University / Subtitle *" value={heroFormData.university} onChange={(e) => setHeroFormData((p) => ({ ...p, university: e.target.value }))} required placeholder="e.g. Stanford University '28" />
            <Input label="Badge Tag *" value={heroFormData.tag} onChange={(e) => setHeroFormData((p) => ({ ...p, tag: e.target.value }))} required placeholder="e.g. Top 1% Worldwide" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="SAT Score *" value={heroFormData.score} onChange={(e) => setHeroFormData((p) => ({ ...p, score: e.target.value }))} required placeholder="e.g. 1580" />
            <Input label="Improvement Details *" value={heroFormData.improvement} onChange={(e) => setHeroFormData((p) => ({ ...p, improvement: e.target.value }))} required placeholder="e.g. +210 Improvement" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Image URL" type="text" value={heroFormData.imageUrl} onChange={(e) => setHeroFormData((p) => ({ ...p, imageUrl: e.target.value }))} placeholder="/uploads/... or https://..." />
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Or Upload Local Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleHeroImageChange}
                className="block w-full text-xs text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button type="button" onClick={() => setIsHeroModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isHeroSubmitting} className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer">{isHeroSubmitting ? "Saving..." : "Save Feature"}</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}
