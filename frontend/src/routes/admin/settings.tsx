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
  const [activeSubTab, setActiveSubTab] = useState<"stats" | "sat" | "lums" | "admission">("stats");
  
  // Stats State
  const [successRate, setSuccessRate] = useState("");
  const [studentsMentored, setStudentsMentored] = useState("");
  const [eliteAdmissions, setEliteAdmissions] = useState("");
  const [avgSatGain, setAvgSatGain] = useState("");

  // SAT Pricing State
  const [satPortalPk, setSatPortalPk] = useState("");
  const [satGroupPk, setSatGroupPk] = useState("");
  const [satOneOnOnePk, setSatOneOnOnePk] = useState("");
  const [satPortalIntl, setSatPortalIntl] = useState("");
  const [satGroupIntl, setSatGroupIntl] = useState("");
  const [satOneOnOneIntl, setSatOneOnOneIntl] = useState("");

  // LUMS Pricing State
  const [lumsGuidedPk, setLumsGuidedPk] = useState("");
  const [lumsCompletePk, setLumsCompletePk] = useState("");
  const [lumsGuidedIntl, setLumsGuidedIntl] = useState("");
  const [lumsCompleteIntl, setLumsCompleteIntl] = useState("");

  // Admission Pricing State (PK)
  const [admGuidedUsaPk, setAdmGuidedUsaPk] = useState("");
  const [admCompleteUsaPk, setAdmCompleteUsaPk] = useState("");
  const [admGuidedCanadaPk, setAdmGuidedCanadaPk] = useState("");
  const [admCompleteCanadaPk, setAdmCompleteCanadaPk] = useState("");
  const [admGuidedUkPk, setAdmGuidedUkPk] = useState("");
  const [admCompleteUkPk, setAdmCompleteUkPk] = useState("");
  const [admGuidedTurkeyPk, setAdmGuidedTurkeyPk] = useState("");
  const [admCompleteTurkeyPk, setAdmCompleteTurkeyPk] = useState("");
  const [admGuidedEuropePk, setAdmGuidedEuropePk] = useState("");
  const [admCompleteEuropePk, setAdmCompleteEuropePk] = useState("");
  const [admGuidedGulfPk, setAdmGuidedGulfPk] = useState("");
  const [admCompleteGulfPk, setAdmCompleteGulfPk] = useState("");

  // Admission Pricing State (Intl)
  const [admGuidedUsaIntl, setAdmGuidedUsaIntl] = useState("");
  const [admCompleteUsaIntl, setAdmCompleteUsaIntl] = useState("");
  const [admGuidedCanadaIntl, setAdmGuidedCanadaIntl] = useState("");
  const [admCompleteCanadaIntl, setAdmCompleteCanadaIntl] = useState("");
  const [admGuidedUkIntl, setAdmGuidedUkIntl] = useState("");
  const [admCompleteUkIntl, setAdmCompleteUkIntl] = useState("");
  const [admGuidedTurkeyIntl, setAdmGuidedTurkeyIntl] = useState("");
  const [admCompleteTurkeyIntl, setAdmCompleteTurkeyIntl] = useState("");
  const [admGuidedEuropeIntl, setAdmGuidedEuropeIntl] = useState("");
  const [admCompleteEuropeIntl, setAdmCompleteEuropeIntl] = useState("");
  const [admGuidedGulfIntl, setAdmGuidedGulfIntl] = useState("");
  const [admCompleteGulfIntl, setAdmCompleteGulfIntl] = useState("");

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/homepage-stats")
      .then((res) => {
        if (res.success && res.stats) {
          const s = res.stats;
          setSuccessRate(s.successRate || "98%");
          setStudentsMentored(s.studentsMentored || "1,500+");
          setEliteAdmissions(s.eliteAdmissions || "250+");
          setAvgSatGain(s.avgSatGain || "+220");

          setSatPortalPk(s.satPortalPk || "Rs 15,000");
          setSatGroupPk(s.satGroupPk || "Rs 40,000");
          setSatOneOnOnePk(s.satOneOnOnePk || "Rs 100,000");
          setSatPortalIntl(s.satPortalIntl || "$70");
          setSatGroupIntl(s.satGroupIntl || "$300");
          setSatOneOnOneIntl(s.satOneOnOneIntl || "$500");

          setLumsGuidedPk(s.lumsGuidedPk || "Rs. 30,000");
          setLumsCompletePk(s.lumsCompletePk || "Rs. 60,000");
          setLumsGuidedIntl(s.lumsGuidedIntl || "$300");
          setLumsCompleteIntl(s.lumsCompleteIntl || "$550");

          setAdmGuidedUsaPk(s.admGuidedUsaPk || "4,00,000");
          setAdmCompleteUsaPk(s.admCompleteUsaPk || "8,00,000");
          setAdmGuidedCanadaPk(s.admGuidedCanadaPk || "2,50,000");
          setAdmCompleteCanadaPk(s.admCompleteCanadaPk || "4,50,000");
          setAdmGuidedUkPk(s.admGuidedUkPk || "3,00,000");
          setAdmCompleteUkPk(s.admCompleteUkPk || "6,00,000");
          setAdmGuidedTurkeyPk(s.admGuidedTurkeyPk || "2,00,000");
          setAdmCompleteTurkeyPk(s.admCompleteTurkeyPk || "3,50,000");
          setAdmGuidedEuropePk(s.admGuidedEuropePk || "2,50,000");
          setAdmCompleteEuropePk(s.admCompleteEuropePk || "4,50,000");
          setAdmGuidedGulfPk(s.admGuidedGulfPk || "3,00,000");
          setAdmCompleteGulfPk(s.admCompleteGulfPk || "5,00,000");

          setAdmGuidedUsaIntl(s.admGuidedUsaIntl || "$2,000");
          setAdmCompleteUsaIntl(s.admCompleteUsaIntl || "$4,500");
          setAdmGuidedCanadaIntl(s.admGuidedCanadaIntl || "$1,500");
          setAdmCompleteCanadaIntl(s.admCompleteCanadaIntl || "$3,000");
          setAdmGuidedUkIntl(s.admGuidedUkIntl || "$1,800");
          setAdmCompleteUkIntl(s.admCompleteUkIntl || "$3,500");
          setAdmGuidedTurkeyIntl(s.admGuidedTurkeyIntl || "$1,200");
          setAdmCompleteTurkeyIntl(s.admCompleteTurkeyIntl || "$2,500");
          setAdmGuidedEuropeIntl(s.admGuidedEuropeIntl || "$1,500");
          setAdmCompleteEuropeIntl(s.admCompleteEuropeIntl || "$3,000");
          setAdmGuidedGulfIntl(s.admGuidedGulfIntl || "$1,800");
          setAdmCompleteGulfIntl(s.admCompleteGulfIntl || "$3,200");
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
        satPortalPk,
        satGroupPk,
        satOneOnOnePk,
        satPortalIntl,
        satGroupIntl,
        satOneOnOneIntl,
        lumsGuidedPk,
        lumsCompletePk,
        lumsGuidedIntl,
        lumsCompleteIntl,
        admGuidedUsaPk,
        admCompleteUsaPk,
        admGuidedCanadaPk,
        admCompleteCanadaPk,
        admGuidedUkPk,
        admCompleteUkPk,
        admGuidedTurkeyPk,
        admCompleteTurkeyPk,
        admGuidedEuropePk,
        admCompleteEuropePk,
        admGuidedGulfPk,
        admCompleteGulfPk,
        admGuidedUsaIntl,
        admCompleteUsaIntl,
        admGuidedCanadaIntl,
        admCompleteCanadaIntl,
        admGuidedUkIntl,
        admCompleteUkIntl,
        admGuidedTurkeyIntl,
        admCompleteTurkeyIntl,
        admGuidedEuropeIntl,
        admCompleteEuropeIntl,
        admGuidedGulfIntl,
        admCompleteGulfIntl,
      });
      if (res.success) {
        toast.success("Site settings updated successfully!");
      } else {
        toast.error(res.message || "Failed to update settings.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeItem="/admin/settings">
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Site Settings</h1>
          <p className="text-sm text-on-surface-variant">
            Update statistics and pricing plans displayed across the website.
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex border-b border-outline-variant/30 mb-8 overflow-x-auto whitespace-nowrap gap-1">
          <button
            type="button"
            onClick={() => setActiveSubTab("stats")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === "stats"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Homepage Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("sat")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === "sat"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            SAT Prep Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("lums")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === "lums"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            LUMS Pricing
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab("admission")}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeSubTab === "admission"
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            Admission Counseling Pricing
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-on-surface-variant font-semibold">Loading settings...</div>
        ) : (
          <form onSubmit={handleSave} className="space-y-8 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 shark-shadow">
            
            {/* SUBTAB: HOMEPAGE STATS */}
            {activeSubTab === "stats" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                  <Icon name="monitoring" className="text-primary text-xl" />
                  Homepage Statistics
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
              </div>
            )}

            {/* SUBTAB: SAT PREP PRICING */}
            {activeSubTab === "sat" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="payments" className="text-primary text-xl" />
                    Local Pricing (PKR)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Portal Only
                      </label>
                      <input
                        type="text"
                        value={satPortalPk}
                        onChange={(e) => setSatPortalPk(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. Rs 15,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Group Sessions
                      </label>
                      <input
                        type="text"
                        value={satGroupPk}
                        onChange={(e) => setSatGroupPk(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. Rs 40,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        1-on-1 Sessions
                      </label>
                      <input
                        type="text"
                        value={satOneOnOnePk}
                        onChange={(e) => setSatOneOnOnePk(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. Rs 100,000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6">
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="language" className="text-primary text-xl" />
                    International Pricing (USD)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Portal Only
                      </label>
                      <input
                        type="text"
                        value={satPortalIntl}
                        onChange={(e) => setSatPortalIntl(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. $70"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Group Sessions
                      </label>
                      <input
                        type="text"
                        value={satGroupIntl}
                        onChange={(e) => setSatGroupIntl(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. $300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        1-on-1 Sessions
                      </label>
                      <input
                        type="text"
                        value={satOneOnOneIntl}
                        onChange={(e) => setSatOneOnOneIntl(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. $500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: LUMS PRICING */}
            {activeSubTab === "lums" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="payments" className="text-primary text-xl" />
                    Local Pricing (PKR)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Guided Support
                      </label>
                      <input
                        type="text"
                        value={lumsGuidedPk}
                        onChange={(e) => setLumsGuidedPk(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. Rs. 30,000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Complete Package
                      </label>
                      <input
                        type="text"
                        value={lumsCompletePk}
                        onChange={(e) => setLumsCompletePk(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. Rs. 60,000"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6">
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="language" className="text-primary text-xl" />
                    International Pricing (USD)
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Guided Support
                      </label>
                      <input
                        type="text"
                        value={lumsGuidedIntl}
                        onChange={(e) => setLumsGuidedIntl(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. $300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">
                        Complete Package
                      </label>
                      <input
                        type="text"
                        value={lumsCompleteIntl}
                        onChange={(e) => setLumsCompleteIntl(e.target.value)}
                        className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface transition-colors"
                        placeholder="e.g. $550"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB: ADMISSION COUNSELING PRICING */}
            {activeSubTab === "admission" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="payments" className="text-primary text-xl" />
                    Local Pricing (PKR)
                  </h2>
                  <div className="space-y-6">
                    {/* USA */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇺🇸 United States</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedUsaPk} onChange={(e) => setAdmGuidedUsaPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 4,00,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteUsaPk} onChange={(e) => setAdmCompleteUsaPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 8,00,000" required />
                        </div>
                      </div>
                    </div>

                    {/* Canada */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇨🇦 Canada</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedCanadaPk} onChange={(e) => setAdmGuidedCanadaPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 2,50,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteCanadaPk} onChange={(e) => setAdmCompleteCanadaPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 4,50,000" required />
                        </div>
                      </div>
                    </div>

                    {/* UK */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇬🇧 United Kingdom</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedUkPk} onChange={(e) => setAdmGuidedUkPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 3,00,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteUkPk} onChange={(e) => setAdmCompleteUkPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 6,00,000" required />
                        </div>
                      </div>
                    </div>

                    {/* Turkey */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇹🇷 Turkey</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedTurkeyPk} onChange={(e) => setAdmGuidedTurkeyPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 2,00,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteTurkeyPk} onChange={(e) => setAdmCompleteTurkeyPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 3,50,000" required />
                        </div>
                      </div>
                    </div>

                    {/* Europe */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇪🇺 Europe</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedEuropePk} onChange={(e) => setAdmGuidedEuropePk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 2,50,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteEuropePk} onChange={(e) => setAdmCompleteEuropePk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 4,50,000" required />
                        </div>
                      </div>
                    </div>

                    {/* Gulf */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇦🇪 Gulf Countries</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedGulfPk} onChange={(e) => setAdmGuidedGulfPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 3,00,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteGulfPk} onChange={(e) => setAdmCompleteGulfPk(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. 5,00,000" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant/20 pt-6">
                  <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                    <Icon name="language" className="text-primary text-xl" />
                    International Pricing (USD)
                  </h2>
                  <div className="space-y-6">
                    {/* USA */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇺🇸 United States</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedUsaIntl} onChange={(e) => setAdmGuidedUsaIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $2,000" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteUsaIntl} onChange={(e) => setAdmCompleteUsaIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $4,500" required />
                        </div>
                      </div>
                    </div>

                    {/* Canada */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇨🇦 Canada</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedCanadaIntl} onChange={(e) => setAdmGuidedCanadaIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $1,500" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteCanadaIntl} onChange={(e) => setAdmCompleteCanadaIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $3,000" required />
                        </div>
                      </div>
                    </div>

                    {/* UK */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇬🇧 United Kingdom</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedUkIntl} onChange={(e) => setAdmGuidedUkIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $1,800" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteUkIntl} onChange={(e) => setAdmCompleteUkIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $3,500" required />
                        </div>
                      </div>
                    </div>

                    {/* Turkey */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇹🇷 Turkey</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedTurkeyIntl} onChange={(e) => setAdmGuidedTurkeyIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $1,200" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteTurkeyIntl} onChange={(e) => setAdmCompleteTurkeyIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $2,500" required />
                        </div>
                      </div>
                    </div>

                    {/* Europe */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇪🇺 Europe</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedEuropeIntl} onChange={(e) => setAdmGuidedEuropeIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $1,500" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteEuropeIntl} onChange={(e) => setAdmCompleteEuropeIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $3,000" required />
                        </div>
                      </div>
                    </div>

                    {/* Gulf */}
                    <div className="bg-surface-container-high/40 p-4 rounded-xl border border-outline-variant/20">
                      <h3 className="font-bold text-sm text-on-surface mb-3">🇦🇪 Gulf Countries</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Guided Support</label>
                          <input type="text" value={admGuidedGulfIntl} onChange={(e) => setAdmGuidedGulfIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $1,800" required />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold uppercase text-on-surface-variant block mb-1">Complete Package</label>
                          <input type="text" value={admCompleteGulfIntl} onChange={(e) => setAdmCompleteGulfIntl(e.target.value)} className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="e.g. $3,200" required />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
