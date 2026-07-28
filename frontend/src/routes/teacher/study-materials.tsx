import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { TeacherLayout } from "../../components/layout/TeacherLayout";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/common/Icon";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { EmptyState } from "../../components/ui/EmptyState";
import { api, getBackendUrl } from "../../services/api";

export const Route = createFileRoute("/teacher/study-materials")({
  component: () => (
    <TeacherLayout activeItem="/teacher/study-materials">
      <TeacherStudyMaterials />
    </TeacherLayout>
  ),
});

interface Material {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
}

function TeacherStudyMaterials() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const fetchMaterials = async () => {
    try {
      const res = await api.get("/api/study-materials");
      if (res.success) {
        setMaterials(res.materials || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setError("Title and PDF file are required.");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${getBackendUrl()}/api/study-materials`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setTitle("");
        setDescription("");
        setFile(null);
        fetchMaterials();
      } else {
        setError(data.error || "Failed to upload study material.");
      }
    } catch (err) {
      setError("Failed to upload file due to a network connection error.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this study material?")) return;
    try {
      const res = await api.delete(`/api/study-materials/${id}`);
      if (res.success) {
        setMaterials((prev) => prev.filter((m) => m._id !== id));
      } else {
        alert(res.error || "Failed to delete study material.");
      }
    } catch (err) {
      alert("Failed to delete. Connection error.");
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Study Materials</h1>
          <p className="text-on-surface-variant text-sm mt-1">Publish notes, study documents, and sheets for students</p>
        </div>
        <button
          onClick={() => { setModalOpen(true); setError(""); }}
          className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-on-primary shark-shadow hover:bg-accent transition-all cursor-pointer border-none"
        >
          <Icon name="upload_file" className="text-lg" /> Upload Notes
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading materials...</div>
      ) : materials.length === 0 ? (
        <EmptyState
          icon="menu_book"
          title="No Study Materials Uploaded"
          description="Upload cheat sheets, formulas guides, or study notes for your students to read inside the portal."
        />
      ) : (
        <div className="rounded-2xl bg-surface border border-outline-variant/40 overflow-hidden shark-shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="p-4 font-bold">Document Title</th>
                  <th className="p-4 font-bold">File Information</th>
                  <th className="p-4 font-bold">Date Shared</th>
                  <th className="p-4 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {materials.map((mat) => (
                  <tr key={mat._id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-on-surface text-sm">{mat.title}</div>
                      {mat.description && (
                        <div className="text-xs text-on-surface-variant mt-1 line-clamp-1 max-w-md">{mat.description}</div>
                      )}
                    </td>
                    <td className="p-4 text-xs font-mono text-on-surface-variant">
                      <div>{mat.fileName}</div>
                      <div className="mt-0.5 opacity-80">{formatSize(mat.fileSize)}</div>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant">
                      {new Date(mat.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <a
                          href={mat.fileUrl.startsWith("http") ? mat.fileUrl : `${getBackendUrl()}${mat.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <Icon name="visibility" className="text-[14px]" /> View
                        </a>
                        <button
                          onClick={() => handleDelete(mat._id)}
                          className="px-3 py-1.5 bg-error/10 text-error hover:bg-error/20 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer border-none"
                        >
                          <Icon name="delete" className="text-[14px]" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Study Material Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Upload Study Material" icon="upload_file">
        {error && (
          <div className="mb-4 p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
            <Icon name="error" className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleUpload} className="space-y-4">
          <Input
            label="Document Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. SAT Grammar Rules Cheatsheet"
          />
          <Textarea
            label="Short Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what these notes cover..."
          />
          <div>
            <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant font-bold">
              PDF Note File *
            </label>
            <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-6 text-center hover:border-primary/40 transition-colors relative">
              <Icon name="cloud_upload" className="text-3xl text-on-surface-variant/40 mb-1" />
              <p className="text-xs text-on-surface-variant">
                {file ? file.name : "Select or drag & drop PDF note file"}
              </p>
              <p className="text-[10px] text-on-surface-variant/60 mt-1">PDF file format only (up to 20MB)</p>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm text-xs border-none"
            >
              {uploading ? "Uploading..." : "Publish Material"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
