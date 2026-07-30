import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { api } from "../../services/api";
import { toast } from "sonner";
import { Icon } from "../../components/common/Icon";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [successRate, setSuccessRate] = useState("");
  const [studentsMentored, setStudentsMentored] = useState("");
  const [eliteAdmissions, setEliteAdmissions] = useState("");
  const [avgSatGain, setAvgSatGain] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/homepage-stats")
      .then((res) => {
        if (res.success && res.stats) {
          setSuccessRate(res.stats.successRate || "98%");
          setStudentsMentored(res.stats.studentsMentored || "1,500+");
          setEliteAdmissions(res.stats.eliteAdmissions || "250+");
          setAvgSatGain(res.stats.avgSatGain || "+220");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading stats:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put("/api/homepage-stats", {
        successRate,
        studentsMentored,
        eliteAdmissions,
        avgSatGain,
      });
      if (res.success) {
        toast.success("Homepage stats updated successfully!");
      } else {
        toast.error(res.message || "Failed to update stats.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeItem="/admin/settings">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
          <p className="text-sm text-on-surface-variant">
            Update general values and stats displayed on the public landing page.
          </p>
        </div>

        {loading ? (
          <div className="py-8 text-on-surface-variant font-semibold">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shark-shadow">
            <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
              <Icon name="monitoring" className="text-primary text-xl" />
              Homepage Stats
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Success Rate
                </label>
                <input
                  type="text"
                  value={successRate}
                  onChange={(e) => setSuccessRate(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                  placeholder="e.g. 98%"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Students Mentored
                </label>
                <input
                  type="text"
                  value={studentsMentored}
                  onChange={(e) => setStudentsMentored(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                  placeholder="e.g. 1,500+"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Elite Admissions
                </label>
                <input
                  type="text"
                  value={eliteAdmissions}
                  onChange={(e) => setEliteAdmissions(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                  placeholder="e.g. 250+"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                  Average SAT Gain
                </label>
                <input
                  type="text"
                  value={avgSatGain}
                  onChange={(e) => setAvgSatGain(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                  placeholder="e.g. +220"
                  required
                />
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/20 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-accent text-on-primary font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md"
              >
                {saving ? (
                  <>
                    <Icon name="hourglass_empty" className="animate-spin text-sm" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Icon name="save" className="text-sm" />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
