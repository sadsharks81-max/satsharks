import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Icon } from "../../components/common/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { api, getBackendUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const Route = createFileRoute("/dashboard/study-materials")({
  component: StudyMaterialsPage,
});

interface Material {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  category: "MATH" | "READING_WRITING";
}

function StudyMaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>("");
  const [category, setCategory] = useState<"MATH" | "READING_WRITING">("MATH");

  useEffect(() => {
    api.get("/api/study-materials").then((res) => {
      if (res.success) {
        setMaterials(res.materials || []);
      }
      setLoading(false);
    });
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFullPdfUrl = (relativeUrl: string) => {
    if (relativeUrl.startsWith("http")) return relativeUrl;
    return `${getBackendUrl()}${relativeUrl}`;
  };

  if (loading) {
    return (
      <StudentLayout activeItem="/dashboard/study-materials">
        <div className="flex items-center justify-center py-24">
          <Icon name="hourglass_top" className="text-4xl text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  const { user } = useAuth();
  const isPaid = user?.subscription === "PAID" || user?.role === "ADMIN";

  if (!isPaid) {
    return (
      <StudentLayout activeItem="/dashboard/study-materials">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Study Materials</h1>
          <p className="text-on-surface-variant text-sm font-medium">Browse, view, and read study materials and notes shared by your instructors</p>
        </div>
        <div className="max-w-md mx-auto my-12 text-center bg-surface border border-outline-variant/40 rounded-2xl p-8 shadow-md">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <Icon name="workspace_premium" className="text-3xl" />
          </div>
          <h2 className="text-xl font-bold text-on-surface mb-2">Premium Feature Locked</h2>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
            Study Materials are only available for Premium users. Upgrade to access all PDF notes, cheat sheets, and class slides.
          </p>
          <Link
            to="/sat"
            hash="pricing"
            className="inline-block w-full py-3 text-center bg-primary hover:bg-accent text-on-primary hover:text-primary font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md font-semibold"
          >
            Upgrade to Premium
          </Link>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout activeItem="/dashboard/study-materials">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Study Materials</h1>
        <p className="text-on-surface-variant text-sm font-medium">Browse, view, and read study materials and notes shared by your instructors</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setCategory("MATH")} className={`rounded-xl px-5 py-2 text-sm font-bold ${category === "MATH" ? "bg-primary text-on-primary" : "bg-surface-container-low"}`}>Math Materials</button>
        <button onClick={() => setCategory("READING_WRITING")} className={`rounded-xl px-5 py-2 text-sm font-bold ${category === "READING_WRITING" ? "bg-primary text-on-primary" : "bg-surface-container-low"}`}>English, Reading & Writing</button>
      </div>

      {materials.filter((item) => item.category === category).length === 0 ? (
        <EmptyState
          icon="menu_book"
          title="No Study Materials Yet"
          description="Your instructors will post PDF notes, study materials, and cheat-sheets here shortly."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.filter((item) => item.category === category).map((mat) => (
            <div key={mat._id} className="bg-surface rounded-2xl p-6 border border-outline-variant/40 shadow-sm flex flex-col justify-between hover-lift">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
                    <Icon name="picture_as_pdf" className="text-2xl" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-on-surface-variant bg-surface-container-high px-2.5 py-1 rounded-md">
                    {formatSize(mat.fileSize)}
                  </span>
                </div>
                <h3 className="font-bold text-base text-on-surface leading-snug line-clamp-1">{mat.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-2 line-clamp-3">
                  {mat.description || "No description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant/35 flex">
                <button
                  onClick={() => {
                    setActivePdfUrl(getFullPdfUrl(mat.fileUrl));
                    setActivePdfTitle(mat.title);
                  }}
                  className="w-full py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-all text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 border-none cursor-pointer"
                >
                  <Icon name="menu_book" className="text-[16px]" />
                  Read Online
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-Screen PDF Reader Overlay */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md animate-fade-in">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/35 bg-surface/90 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-error/10 text-error">
                <Icon name="picture_as_pdf" className="text-xl" />
              </span>
              <h2 className="font-bold text-lg text-on-surface truncate max-w-xl">{activePdfTitle}</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => { setActivePdfUrl(null); }}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors cursor-pointer text-on-surface-variant hover:text-on-surface border-none bg-transparent"
                aria-label="Close Reader"
              >
                <Icon name="close" className="text-2xl" />
              </button>
            </div>
          </div>
          
          {/* PDF Viewer Body */}
          <div className="flex-grow w-full bg-surface-container-low relative overflow-hidden">
            <iframe
              src={`${activePdfUrl}#toolbar=1&navpanes=1`}
              className="w-full h-full border-none"
              title="PDF Reader"
            />
          </div>
        </div>
      )}
    </StudentLayout>
  );
}
