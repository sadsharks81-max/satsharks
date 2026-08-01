import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { api } from "../services/api";
import { Icon } from "../components/common/Icon";
import { useAuth } from "../hooks/useAuth";

import gradingSystemsData from "./gradingSystems.json";

export const Route = createFileRoute("/university-matcher")({
  head: () => ({
    meta: [
      { title: "SAT Sharks University Matcher | SAT Sharks" },
      {
        name: "description",
        content: "Find the best global universities matching your academic profile, SAT scores, and budget preferences using officially verified boundaries.",
      },
    ],
    links: [{ rel: "canonical", href: "/university-matcher" }],
  }),
  component: UniversityMatcherRoute,
});

// ============ TYPES & CONSTANTS ============
interface GradingBand {
  label: string;
  pct: number;
  gpa: number;
}

interface GradingSystem {
  name: string;
  country: string;
  scale: string;
  sat: string;
  official: boolean;
  bands: GradingBand[];
}

const GRADING_SYSTEMS = gradingSystemsData as Record<string, GradingSystem>;

const DUAL_LEVELS: Record<string, { final: string; options: { sys: string; label: string }[] }> = {
  PK_FSC: { final: "FSc / Inter (HSC / Grade 12)", options: [{ sys: "PK_FSC", label: "Matric (SSC)" }] },
  BD_HSC: { final: "HSC (Grade 12)", options: [{ sys: "BD_HSC", label: "SSC (Grade 10)" }] },
  NP_SEE: { final: "NEB +2 (Grade 12)", options: [{ sys: "NP_SEE", label: "SEE (Grade 10)" }] },
  GCE_ALEVEL: { final: "A-Levels", options: [{ sys: "CIE_OLEVEL", label: "O-Levels (A*-E)" }, { sys: "CIE_IGCSE", label: "IGCSE (A*-G / 9-1)" }] },
  LK_GCE: { final: "A/L", options: [{ sys: "LK_GCE", label: "O/L" }] },
  IN_CBSE: { final: "Class 12 Board", options: [{ sys: "IN_CBSE", label: "Class 10 Board" }] },
  IN_STATE: { final: "Class 12 Board", options: [{ sys: "IN_STATE", label: "Class 10 Board" }] },
};

const W_FINAL = 0.7;
const W_EARLIER = 0.3;
const EARLIER_ONLY = new Set(["CIE_OLEVEL", "CIE_IGCSE"]);

const EC_TIERS = [
  { v: 9.5, t: "Tier 1 — National / international distinction", ex: "Olympiad medal, national team, published research, founded org with real impact" },
  { v: 7.5, t: "Tier 2 — Provincial / state level", ex: "Head Boy/Girl, provincial competition win, major sustained project" },
  { v: 5.5, t: "Tier 3 — School leadership", ex: "Society president, sports captain, event lead, consistent volunteering" },
  { v: 3.5, t: "Tier 4 — Active participation", ex: "Club member, occasional volunteering, school events" },
  { v: 1.0, t: "Academics only so far", ex: "No structured activities yet — many strong applicants start here" },
];

const EC_AREAS = [
  "Leadership",
  "Competitions",
  "Research",
  "Community service",
  "Sports",
  "Arts / creative",
  "Work / family responsibility"
];

// Color Palette Definition
const C = {
  bg: "#0B1729",
  panel: "#13263E",
  line: "#22385A",
  foam: "#EAF0F7",
  mist: "#8DA0B9",
  teal: "#35C4B5",
  tealDim: "#1E7A72",
  gold: "#F5B841",
  coral: "#E8705E",
  green: "#4CC38A"
};

const TIER_META: Record<string, { color: string; label: string }> = {
  Safety: { color: C.green, label: "SAFE WATERS" },
  Target: { color: C.teal, label: "TARGET ZONE" },
  Reach: { color: C.coral, label: "DEEP WATER" }
};

// ============ MATCHING ALGORITHM ============
type MatchTier = "Safety" | "Target" | "Reach";

function scoreUniversity(uni: any, gpa: number, sat: number | null, budget: number, ec: number) {
  if (uni.minGPA == null) return null;
  const fit = gpa - uni.minGPA;
  
  const accept = uni.acceptRate ?? 100;
  let matchType = "Reach";
  if (accept <= 10) matchType = "Reach";
  else if (fit >= 0.35 && accept >= 35) matchType = "Safety";
  else if (fit >= 0.05) matchType = "Target";
  else matchType = "Reach";
  
  let score = 50 + Math.max(-30, Math.min(30, fit * 60));
  
  let reasons: string[] = [];
  let warnings: string[] = [];
  
  if (fit >= 0) {
    reasons.push("Your grades meet the requirements");
  } else {
    const gap = uni.minGPA - gpa;
    if (gap <= 0.2) {
      score += 8;
      warnings.push("Your GPA is slightly below average");
    } else {
      score -= 5;
      warnings.push("Your GPA is below the typical range");
    }
  }
  
  // SAT score
  if (sat && uni.avgSAT) {
    score += Math.max(-15, Math.min(15, (sat - uni.avgSAT) / 10));
    if (sat >= uni.avgSAT) {
      reasons.push("SAT score is competitive");
    } else if (sat >= uni.avgSAT - 80) {
      // Small deficit
    } else {
      score -= 3;
      warnings.push("SAT score below typical average");
    }
  }
  
  // Budget
  if (uni.tuition <= budget) {
    score += 10;
    reasons.push("Within your budget");
  } else if (uni.tuition <= budget * 1.35) {
    score += 3;
    reasons.push("Partial aid or scholarship needed to match budget");
  } else {
    score -= 10;
    warnings.push("Tuition exceeds budget; heavy scholarships needed");
  }
  
  // Acceptance rate
  score += Math.min(8, accept / 12);
  if (accept >= 40) {
    reasons.push("Good acceptance rate");
  } else if (accept <= 10) {
    warnings.push(`Highly competitive (${accept}% acceptance rate)`);
  }
  
  // Extracurriculars
  const ecImp = uni.ecImp ?? 5;
  const ecDelta = (ec - 5.5) * ecImp / 10 * 2.2;
  score += ecDelta;
  
  let ecGate = false;
  if (ecImp >= 9 && ec < 4 && matchType === "Reach") {
    score = Math.min(score, 48);
    ecGate = true;
    warnings.push("Extracurriculars are below expectations for this reach university");
  }
  
  const finalScore = Math.round(Math.max(5, Math.min(99, score)));
  
  return {
    uni,
    score: finalScore,
    reasons,
    warnings,
    matchType,
    ecDelta: Math.round(ecDelta),
    ecGate,
  };
}

type ScoredUniversity = NonNullable<ReturnType<typeof scoreUniversity>>;

function money(n: number | null) {
  return n == null ? "—" : "$" + n.toLocaleString();
}

// ============ SUB-COMPONENTS ============
function MiniStat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: C.bg, padding: "8px 12px", borderRadius: 8, minWidth: 80, border: `1px solid ${C.line}` }}>
      <div style={{ fontSize: 9, color: C.mist, textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: color || C.foam }}>{value}</div>
    </div>
  );
}

function ApplicationModal({ selectedUnis, profile, onClose }: { selectedUnis: any[]; profile: any; onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [scholarships, setScholarships] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("Please log in to apply for counseling.");
      return;
    }
    
    setLoading(true);
    setError("");

    const selectedScholarshipStr = selectedUnis.map(uni => {
      const sch = scholarships[uni.name] || "General Admission";
      return `${uni.name}: ${sch}`;
    }).join(" | ");

    try {
      const payload = {
        level: profile.level,
        secondaryType: profile.secondaryType,
        secondaryObtained: null,
        secondaryTotal: null,
        secondaryGrades: profile.secondaryGrades,
        higherType: profile.higherType,
        higherObtained: null,
        higherTotal: null,
        higherGrades: profile.higherGrades,
        gpa: profile.gpa,
        satScore: profile.sat ? Number(profile.sat) : null,
        gradeYear: "",
        targetUniversities: selectedUnis.map(u => u.name),
        selectedScholarship: selectedScholarshipStr,
        extracurriculars: profile.extracurriculars,
        budgetRange: profile.budget,
      };

      const res = await api.post("/api/consulting/submit", payload);
      
      if (!res.success) {
        throw new Error(res.error || "Failed to submit application");
      }
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-[#0B1729]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div style={{ background: C.panel, borderColor: C.line }} className="rounded-2xl w-full max-w-md p-8 text-center shadow-xl border">
          <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-[#EAF0F7]">Application Submitted!</h2>
          <p className="text-slate-300 mb-6">
            Your counseling request for <strong>{selectedUnis.length} universities</strong> has been sent. Our team will review your profile and contact you shortly.
          </p>
          <button 
            onClick={() => navigate({ to: "/" })}
            style={{ background: C.teal, color: C.bg }}
            className="w-full py-3 font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#0B1729]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div style={{ background: C.panel, borderColor: C.line }} className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border relative flex flex-col">
        <div style={{ borderBottom: `1px solid ${C.line}` }} className="sticky top-0 bg-[#13263E] px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-bold text-[#EAF0F7]">Apply to {selectedUnis.length} Universities</h2>
            <p className="text-xs text-[#8DA0B9]">Your academic profile data will be automatically attached.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-[#22385A] rounded-full transition-colors text-[#8DA0B9]">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto text-[#EAF0F7]">
          {error && (
            <div className="p-4 bg-red-950 text-red-400 rounded-xl text-sm font-medium border border-red-900">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold border-b border-[#22385A] pb-2 text-[#35C4B5]">Target Universities & Scholarships</h3>
            {selectedUnis.map(uni => {
              const options = uni.scholarships ? uni.scholarships.split(",").map((s: string) => s.trim()).filter((s: string) => s) : [];
              return (
                <div key={uni._id || uni.id} style={{ background: C.bg, borderColor: C.line }} className="p-4 rounded-xl border">
                  <div className="font-bold mb-2">{uni.name}</div>
                  <label className="block text-xs font-semibold text-[#8DA0B9] mb-1">Select Scholarship</label>
                  {options.length > 0 ? (
                    <select 
                      value={scholarships[uni.name] || ""} 
                      onChange={e => setScholarships(prev => ({ ...prev, [uni.name]: e.target.value }))} 
                      style={{ background: C.panel, borderColor: C.line, color: C.foam }}
                      className="w-full px-3 py-2 rounded-lg border outline-none focus:border-[#35C4B5]"
                    >
                      <option value="">General Admission (No specific scholarship)</option>
                      {options.map((s: string, i: number) => (
                        <option key={i} value={s}>{s}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="e.g., Need-based aid (or leave blank for General Admission)" 
                      value={scholarships[uni.name] || ""} 
                      onChange={e => setScholarships(prev => ({ ...prev, [uni.name]: e.target.value }))} 
                      style={{ background: C.panel, borderColor: C.line, color: C.foam }}
                      className="w-full px-3 py-2 rounded-lg border outline-none focus:border-[#35C4B5]" 
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ background: C.bg, borderColor: C.line }} className="p-4 rounded-xl border">
            <h3 className="font-bold text-[#F5B841] mb-2 text-sm">Attached Profile Data</h3>
            <div className="text-xs text-[#8DA0B9] space-y-1">
              <div><strong>Final Level Grade:</strong> {profile.higherGrades} ({profile.higherType})</div>
              {profile.secondaryGrades && (
                <div><strong>Earlier Qualification Grade:</strong> {profile.secondaryGrades} ({profile.secondaryType})</div>
              )}
              <div><strong>US GPA Equivalent:</strong> {profile.gpa}</div>
              <div><strong>SAT Score:</strong> {profile.sat || "N/A"}</div>
              <div><strong>Budget:</strong> {profile.budget}</div>
            </div>
            <p className="text-[10px] mt-2 italic text-[#8DA0B9] opacity-80">This information was automatically generated from your matching translation wizard.</p>
          </div>

          <div style={{ borderTop: `1px solid ${C.line}` }} className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-[#13263E] py-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-[#8DA0B9] hover:bg-[#22385A] transition-colors">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ background: C.teal, color: C.bg }}
              className="px-6 py-2.5 rounded-xl font-bold hover:opacity-90 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2"
            >
              {loading && <Icon name="sync" className="animate-spin text-[18px]" />}
              Submit Applications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============ MAIN CONTENT ============
function UniversityMatcherContent() {
  const [sysCode, setSysCode] = useState("PK_FSC");
  const [finalIdx, setFinalIdx] = useState(1);
  const [earlierSysIdx, setEarlierSysIdx] = useState(0);
  const [earlierIdx, setEarlierIdx] = useState(1);
  const [useEarlier, setUseEarlier] = useState(true);
  
  const [ecTier, setEcTier] = useState(2);
  const [ecAreas, setEcAreas] = useState<string[]>(["Leadership"]);
  const [sat, setSat] = useState("");
  const [budget, setBudget] = useState(45000);
  const [query, setQuery] = useState("");
  const [selectedSheet, setSelectedSheet] = useState("Verified Database");
  const [selectedCountry, setSelectedCountry] = useState("ALL");
  const [selectedQsRange, setSelectedQsRange] = useState("ALL");

  const [selectedUnisMap, setSelectedUnisMap] = useState<Record<string, any>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  // Fetch Universities
  const { data: UNIVERSITIES = [], isLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const res = await api.get("/api/universities");
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  // Calculate grading details
  const sys = GRADING_SYSTEMS[sysCode] || GRADING_SYSTEMS["PK_FSC"];
  const dual = DUAL_LEVELS[sysCode];
  const earlierOpt = dual ? dual.options[Math.min(earlierSysIdx, dual.options.length - 1)] : null;
  const earlierSys = earlierOpt ? GRADING_SYSTEMS[earlierOpt.sys] : null;

  const bandF = sys.bands[Math.min(finalIdx, sys.bands.length - 1)];
  const bandE = earlierSys ? earlierSys.bands[Math.min(earlierIdx, earlierSys.bands.length - 1)] : null;
  
  const gpaFinal = bandF?.gpa ?? 0;
  const gpa = dual && useEarlier && bandE
    ? +(W_FINAL * gpaFinal + W_EARLIER * (bandE.gpa ?? gpaFinal)).toFixed(2)
    : gpaFinal;

  const ecScore = Math.min(10, EC_TIERS[ecTier].v + Math.min(1.5, ecAreas.length * 0.35));
  const satNum = sat ? parseInt(sat, 10) : null;

  const switchSystem = (code: string) => {
    setSysCode(code);
    setFinalIdx(1);
    setEarlierIdx(1);
    setEarlierSysIdx(0);
  };

  const toggleSelectUni = (uni: any) => {
    setSelectedUnisMap(prev => {
      const next = { ...prev };
      if (next[uni.name]) delete next[uni.name];
      else next[uni.name] = uni;
      return next;
    });
  };

  const toggleExpandCard = (name: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const selectedUnisList = Object.values(selectedUnisMap);

  const sheetNames = useMemo<string[]>(() => {
    const names = new Set<string>((UNIVERSITIES as any[]).map((u: any) => u.sheetName as string).filter(Boolean));
    return Array.from(names);
  }, [UNIVERSITIES]);

  const countries = useMemo<string[]>(() => {
    const list = new Set<string>((UNIVERSITIES as any[]).map((u: any) => u.country as string).filter(Boolean));
    return Array.from(list).sort();
  }, [UNIVERSITIES]);

  const results = useMemo((): Record<MatchTier, ScoredUniversity[]> => {
    // Annotated so the early return is not inferred as never[]. Without it,
    // results[tier] widened to `never[] | ScoredUniversity[]` and TypeScript
    // could not infer the callback parameters when mapping over it.
    if (UNIVERSITIES.length === 0) return { Safety: [], Target: [], Reach: [] };

    let filtered = UNIVERSITIES;
    if (selectedSheet !== "ALL") {
      filtered = UNIVERSITIES.filter((u: any) => u.sheetName === selectedSheet);
    }

    if (selectedCountry !== "ALL") {
      filtered = filtered.filter((u: any) => u.country === selectedCountry);
    }

    if (selectedQsRange !== "ALL") {
      const maxRank = parseInt(selectedQsRange, 10);
      filtered = filtered.filter((u: any) => u.ranking && u.ranking <= maxRank);
    }

    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter((u: any) => 
        u.name.toLowerCase().includes(q) || 
        u.country.toLowerCase().includes(q) ||
        (u.programs && u.programs.some((p: string) => p.toLowerCase().includes(q)))
      );
    }

    const scored = filtered.map((u: any) => scoreUniversity(u, gpa, satNum, budget, ecScore)).filter(Boolean) as any[];

    scored.sort((a, b) => b.score - a.score);

    return {
      Safety: scored.filter(x => x.matchType === "Safety"),
      Target: scored.filter(x => x.matchType === "Target"),
      Reach: scored.filter(x => x.matchType === "Reach")
    };
  }, [UNIVERSITIES, selectedSheet, selectedCountry, selectedQsRange, query, gpa, satNum, budget, ecScore]);

  const sysOptions = Object.entries(GRADING_SYSTEMS)
    .filter(([code]) => !EARLIER_ONLY.has(code))
    .sort((a, b) => (a[1].country || "").localeCompare(b[1].country || ""));

  const selStyle = {
    width: "100%",
    marginTop: 6,
    marginBottom: 14,
    padding: "10px 12px",
    background: C.panel,
    color: C.foam,
    border: `1px solid ${C.line}`,
    borderRadius: 8,
    fontSize: 14
  };

  if (isLoading) {
    return (
      <div style={{ background: C.bg }} className="min-h-screen flex items-center justify-center">
        <Icon name="sync" className="animate-spin text-4xl text-[#35C4B5]" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.foam, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap');
        .sg { font-family: 'Space Grotesk', system-ui, sans-serif; }
        select:focus, input:focus { border-color: ${C.teal} !important; outline:none; }
        .card { transition: transform .15s ease, border-color .15s ease; }
        .card:hover { transform: translateY(-2px); border-color: ${C.teal} !important; }
        .chip { cursor:pointer; user-select:none; transition: all .12s ease; }
        @keyframes flowIn { from { opacity:0; transform: translateX(-8px);} to { opacity:1; transform:none; } }
        .flow { animation: flowIn .35s ease both; }
        @media (prefers-reduced-motion: reduce) { .card, .flow { animation:none; transition:none; } }
      `}</style>

      {/* Hero Header Section */}
      <div style={{ borderBottom: `1px solid ${C.line}` }} className="py-8 px-6 md:px-12 bg-[#0d1c31] text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#EAF0F7] flex items-center justify-center md:justify-start gap-3">
            <span style={{ color: C.teal }} className="material-symbols-outlined text-4xl">school</span>
            SAT Sharks University Matcher
          </h1>
          <p className="text-[#8DA0B9] mt-2 font-medium">
            Search {UNIVERSITIES.length} universities using officially verified boundaries.
          </p>
        </div>

        {sheetNames.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <label className="text-xs font-bold text-[#8DA0B9] uppercase tracking-wider whitespace-nowrap">Data Sheet:</label>
            <select
              value={selectedSheet}
              onChange={(e) => setSelectedSheet(e.target.value)}
              className="px-3 py-1.5 rounded-xl border bg-[#13263E] text-xs font-semibold text-[#EAF0F7] outline-none cursor-pointer"
              style={{ borderColor: C.line }}
            >
              <option value="ALL">All Sheets</option>
              {sheetNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* SIDEBAR */}
        <aside style={{ width: 360, minWidth: 310, flexShrink: 0, padding: 24, borderRight: `1px solid ${C.line}` }} className="w-full lg:w-auto">
          <p style={{ color: C.mist, fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", marginBottom: 16 }}>Academic profile</p>

          <label style={{ fontSize: 13, color: C.mist }}>Education system</label>
          <select value={sysCode} onChange={e => switchSystem(e.target.value)} style={selStyle}>
            {sysOptions.map(([code, s]) => <option key={code} value={code}>{s.country} — {s.name}</option>)}
          </select>

          <label style={{ fontSize: 13, color: C.mist }}>{dual ? dual.final : `Your grades (${sys.scale})`}</label>
          <select value={finalIdx} onChange={e => setFinalIdx(+e.target.value)} style={selStyle}>
            {sys.bands.map((b, i) => <option key={i} value={i}>{b.label}</option>)}
          </select>

          {dual && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <label style={{ fontSize: 13, color: C.mist }}>Earlier qualification</label>
                <label style={{ fontSize: 11, color: C.mist, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <input type="checkbox" checked={useEarlier} onChange={e => setUseEarlier(e.target.checked)} style={{ accentColor: C.teal, marginRight: 5 }} />
                  include (30%)
                </label>
              </div>
              {dual.options.length > 1 ? (
                <select value={earlierSysIdx} disabled={!useEarlier} onChange={e => { setEarlierSysIdx(+e.target.value); setEarlierIdx(1); }} style={{ ...selStyle, marginBottom: 8, opacity: useEarlier ? 1 : 0.4 }}>
                  {dual.options.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
                </select>
              ) : (
                <p style={{ fontSize: 12, color: C.foam, margin: "6px 0", opacity: useEarlier ? 1 : 0.4 }}>{earlierOpt?.label}</p>
              )}
              <select value={earlierIdx} disabled={!useEarlier} onChange={e => setEarlierIdx(+e.target.value)} style={{ ...selStyle, opacity: useEarlier ? 1 : 0.4 }}>
                {(earlierSys?.bands || []).map((b, i) => <option key={i} value={i}>{b.label}</option>)}
              </select>
            </>
          )}

          {/* Grade Translation Card */}
          <div className="flow" key={sysCode + finalIdx + earlierSysIdx + earlierIdx + useEarlier} style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ fontSize: 10, letterSpacing: "2px", color: C.mist, textTransform: "uppercase" }}>Grade translation {dual && useEarlier ? "(70/30)" : ""}</p>
              {sys.official && <span style={{ fontSize: 9, letterSpacing: "1px", color: C.green, border: `1px solid ${C.green}`, borderRadius: 10, padding: "2px 7px" }}>✓ OFFICIAL BOUNDARIES</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="sg" style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{bandF.label?.split("(")[0].trim()}</div>
                <div style={{ fontSize: 10, color: C.mist }}>{dual ? "final level" : "native"}</div>
              </div>
              <span style={{ color: C.tealDim }}>→</span>
              <div>
                <div className="sg" style={{ fontSize: 14, fontWeight: 700 }}>{bandF.pct != null ? bandF.pct + "%+" : "—"}</div>
                <div style={{ fontSize: 10, color: C.mist }}>percentile</div>
              </div>
              <span style={{ color: C.tealDim }}>→</span>
              <div>
                <div className="sg" style={{ fontSize: 19, fontWeight: 700, color: C.teal }}>{gpa.toFixed(2)}</div>
                <div style={{ fontSize: 10, color: C.mist }}>US GPA</div>
              </div>
            </div>
            {dual && useEarlier && bandE && earlierOpt && (
              <p style={{ fontSize: 11, color: C.mist, marginTop: 8 }}>+ {earlierOpt.label}: {bandE.label?.split("(")[0].trim()} (GPA {bandE.gpa?.toFixed(1)}) at 30% weight</p>
            )}
            {sys.sat === "Yes" && <p style={{ fontSize: 11, color: C.gold, marginTop: 8 }}>Students from this system usually add the SAT — it strengthens your file.</p>}
          </div>

          <p style={{ color: C.mist, fontSize: 11, letterSpacing: "2.5px", textTransform: "uppercase", margin: "20px 0 10px" }}>Extracurriculars</p>
          <label style={{ fontSize: 13, color: C.mist }}>Strongest achievement</label>
          <select value={ecTier} onChange={e => setEcTier(+e.target.value)} style={selStyle}>
            {EC_TIERS.map((t, i) => <option key={i} value={i}>{t.t}</option>)}
          </select>
          <p style={{ fontSize: 11, color: C.mist, marginTop: -8, marginBottom: 12 }}>{EC_TIERS[ecTier].ex}</p>

          <label style={{ fontSize: 13, color: C.mist }}>Activity areas</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 6 }}>
            {EC_AREAS.map(a => {
              const on = ecAreas.includes(a);
              return (
                <span key={a} className="chip text-[10px] uppercase font-bold tracking-wider" onClick={() => setEcAreas(on ? ecAreas.filter(x => x !== a) : [...ecAreas, a])}
                  style={{ padding: "5px 10px", borderRadius: 20, border: `1px solid ${on ? C.teal : C.line}`, color: on ? C.teal : C.mist, background: on ? "rgba(53,196,181,0.08)" : "transparent" }}>
                  {a}
                </span>
              );
            })}
          </div>
          <p style={{ fontSize: 11, color: C.mist, marginBottom: 8 }}>Work and family responsibilities count — universities judge activities relative to your opportunities.</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 8, padding: "8px 12px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, color: C.mist }}>EC strength</span>
            <div style={{ flex: 1, height: 5, background: C.bg, borderRadius: 3 }}>
              <div style={{ width: `${ecScore * 10}%`, height: "100%", borderRadius: 3, background: C.gold }} />
            </div>
            <span className="sg" style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{ecScore.toFixed(1)}/10</span>
          </div>

          <label style={{ fontSize: 13, color: C.mist }}>SAT score (optional)</label>
          <input value={sat} onChange={e => setSat(e.target.value.replace(/\D/g, ""))} placeholder="e.g. 1420" maxLength={4} style={selStyle} />

          <label style={{ fontSize: 13, color: C.mist }}>Yearly budget — {money(budget)}</label>
          <input type="range" min={10000} max={80000} step={2500} value={budget} onChange={e => setBudget(+e.target.value)} style={{ width: "100%", marginTop: 8, marginBottom: 14, accentColor: C.teal }} />

          <label style={{ fontSize: 13, color: C.mist }}>Search university or program</label>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="e.g. Computer Science" style={selStyle} />

          <label style={{ fontSize: 13, color: C.mist }}>Country</label>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={selStyle}>
            <option value="ALL">All Countries</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <label style={{ fontSize: 13, color: C.mist }}>QS World Ranking</label>
          <select value={selectedQsRange} onChange={e => setSelectedQsRange(e.target.value)} style={selStyle}>
            <option value="ALL">All Rankings</option>
            <option value="50">Top 50</option>
            <option value="100">Top 100</option>
            <option value="200">Top 200</option>
            <option value="500">Top 500</option>
            <option value="1000">Top 1000</option>
          </select>
        </aside>

        {/* RESULTS GRID */}
        <main style={{ flex: 1, minWidth: 320, padding: "24px 28px" }} className="w-full lg:w-auto">
          {(["Safety", "Target", "Reach"] as const).map(tier => {
            const list = results[tier];
            const meta = TIER_META[tier];
            
            return (
              <section key={tier} style={{ marginBottom: 34 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <span className="sg font-bold text-xs tracking-[3px]" style={{ color: meta.color }}>{meta.label}</span>
                  <span style={{ height: 1, flex: 1, background: C.line }} />
                  <span style={{ fontSize: 12, color: C.mist }}>{list.length} matches</span>
                </div>
                
                {list.length === 0 && (
                  <p style={{ color: C.mist, fontSize: 13 }}>
                    No universities in this zone yet — adjust grades, ECs, SAT, or budget to widen the net.
                  </p>
                )}
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                  {list.map(({ uni, score, reasons, warnings, ecDelta, ecGate }) => {
                    const isSelected = !!selectedUnisMap[uni.name];
                    const isExpanded = !!expandedCards[uni.name];

                    return (
                      <article 
                        key={uni.name} 
                        className="card border cursor-pointer select-none" 
                        style={{ background: C.panel, borderColor: isSelected ? C.teal : C.line, borderRadius: 12, padding: 18 }}
                        onClick={() => toggleExpandCard(uni.name)}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div style={{ flex: 1 }}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{uni.logo}</span>
                              <h3 className="sg font-bold text-md leading-tight text-[#EAF0F7]">{uni.name}</h3>
                            </div>
                            <p style={{ fontSize: 11, color: C.mist }}>{uni.city} · QS #{uni.ranking ?? "—"} · {uni.type}</p>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1">
                            {/* Selection Checkbox */}
                            <label className="mb-2" onClick={e => e.stopPropagation()}>
                              <input 
                                type="checkbox" 
                                checked={isSelected} 
                                onChange={() => toggleSelectUni(uni)}
                                style={{ accentColor: C.teal }}
                                className="w-5 h-5 rounded cursor-pointer"
                              />
                            </label>
                            
                            <div>
                              <div className="sg font-bold text-xl leading-none" style={{ color: meta.color }}>{score}</div>
                              <div style={{ fontSize: 9, color: C.mist, letterSpacing: "1px" }}>MATCH</div>
                            </div>
                          </div>
                        </div>

                        {/* Match Progress Bar */}
                        <div style={{ margin: "12px 0 10px", height: 6, borderRadius: 3, background: C.bg, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${score}%`, borderRadius: 3, background: `linear-gradient(90deg, ${C.tealDim}, ${meta.color})` }} />
                        </div>

                        {/* Quick Stats Grid */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", fontSize: 11, color: C.mist }}>
                          <span>Needs GPA <b style={{ color: C.foam }}>{uni.minGPA}</b></span>
                          <span>SAT <b style={{ color: C.foam }}>{uni.avgSAT ?? "—"}</b></span>
                          <span>Accepts <b style={{ color: C.foam }}>{uni.acceptRate}%</b></span>
                          <span>Tuition <b style={{ color: uni.tuition <= budget ? C.green : C.gold }}>{money(uni.tuition)}</b></span>
                        </div>

                        {/* EC Metric */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                          <span style={{ fontSize: 11, color: C.mist }}>ECs matter here:</span>
                          <div style={{ width: 70, height: 4, background: C.bg, borderRadius: 2 }}>
                            <div style={{ width: `${(uni.ecImp ?? 5) * 10}%`, height: "100%", borderRadius: 2, background: C.gold }} />
                          </div>
                          <span style={{ fontSize: 11, color: C.gold }}>{uni.ecImp ?? "?"}/10</span>
                          {ecDelta !== 0 && (
                            <span style={{ fontSize: 11, color: ecDelta > 0 ? C.green : C.coral }}>
                              {ecDelta > 0 ? "+" : ""}{ecDelta} from your ECs
                            </span>
                          )}
                        </div>

                        {/* Detailed expandable logs */}
                        {isExpanded && (
                          <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.line}` }} className="space-y-3 text-xs text-[#8DA0B9]">
                            {reasons.length > 0 && (
                              <div className="space-y-1">
                                {reasons.map((r, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                    <Icon name="check_circle" className="text-[14px]" /> {r}
                                  </div>
                                ))}
                              </div>
                            )}

                            {warnings.length > 0 && (
                              <div className="space-y-1">
                                {warnings.map((w, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-[#E8705E] font-medium">
                                    <Icon name="warning" className="text-[14px]" /> {w}
                                  </div>
                                ))}
                              </div>
                            )}

                            {uni.counselorTip && (
                              <div style={{ background: C.bg, borderColor: C.line }} className="p-3 rounded-lg border text-xs text-[#EAF0F7]">
                                <strong style={{ color: C.gold }} className="block mb-1">💡 Counselor Tip:</strong>
                                {uni.counselorTip}
                              </div>
                            )}

                            <div>
                              <strong>Scholarships:</strong> {uni.scholarships || "No standard scholarship details provided."}
                            </div>

                            {uni.programs && uni.programs.length > 0 && (
                              <div>
                                <strong>Offered Programs:</strong> {uni.programs.slice(0, 8).join(", ")}
                                {uni.programs.length > 8 && " ...and more"}
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#22385A]">
                              <div><strong>Admit Difficulty:</strong> {uni.admitDifficulty || "Standard"}</div>
                              <div><strong>App Platform:</strong> {uni.appPlatform || "Direct Website"}</div>
                              <div><strong>Interview:</strong> {uni.interview || "Optional"}</div>
                              <div><strong>Deadline:</strong> {uni.deadline || "Rolling"}</div>
                            </div>
                          </div>
                        )}

                        {ecGate && (
                          <p style={{ fontSize: 11, color: C.coral, marginTop: 6 }}>
                            Holistic admissions — grades alone rarely clear this bar. Build Tier 1-2 activities first.
                          </p>
                        )}
                        
                        {uni.tuition > budget && (
                          <p style={{ fontSize: 11, color: C.gold, marginTop: 6 }}>
                            Over budget — {uni.scholarshipType?.toLowerCase()} aid: {uni.maxAidCoverage || "N/A"}
                          </p>
                        )}

                        <div className="mt-3 flex justify-between items-center text-[10px] text-[#8DA0B9] font-bold uppercase tracking-wider">
                          <span>{uni.deadline ? `Deadline: ${uni.deadline}` : "Rolling Deadline"}</span>
                          <span>{isExpanded ? "▲ Hide details" : "▼ Click to expand"}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}

          <p style={{ color: C.mist, fontSize: 11, borderTop: `1px solid ${C.line}`, paddingTop: 14, marginTop: 24 }}>
            Verified database contains 1,507 global universities. Sub-10% acceptance rate universities always classify as reach (Deep Water).
          </p>
        </main>
      </div>

      {/* Floating Action Bar for Bulk Apply */}
      <div 
        style={{ borderTop: `1px solid ${C.line}` }}
        className={`fixed bottom-0 left-0 right-0 bg-[#13263E]/95 backdrop-blur-md p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.3)] transform transition-transform duration-300 z-40 flex justify-center ${selectedUnisList.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}
      >
        <div className="max-w-2xl w-full flex items-center justify-between text-[#EAF0F7]">
          <div className="font-bold flex items-center">
            <span style={{ background: C.teal, color: C.bg }} className="w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2 font-black">{selectedUnisList.length}</span>
            Universities Selected
          </div>
          <button 
            onClick={() => setIsApplying(true)}
            style={{ background: C.teal, color: C.bg }}
            className="px-6 py-3 font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
          >
            Apply for Counseling
          </button>
        </div>
      </div>

      {isApplying && (
        <ApplicationModal 
          selectedUnis={selectedUnisList} 
          profile={{
            level: "UNDERGRADUATE",
            secondaryType: earlierOpt?.label || "Matric / SSC",
            secondaryGrades: bandE?.label || "",
            higherType: sys.name,
            higherGrades: bandF.label,
            gpa: gpa.toFixed(2),
            sat: sat,
            budget: `$${budget}/yr`,
            extracurriculars: `Strongest achievement: ${EC_TIERS[ecTier].t}. Activity areas: ${ecAreas.join(", ")}.`
          }}
          onClose={() => setIsApplying(false)} 
        />
      )}
    </div>
  );
}

function UniversityMatcherRoute() {
  return (
    <div className="flex flex-col min-h-screen font-body">
      <Header />
      <main className="flex-1">
        <UniversityMatcherContent />
      </main>
      <Footer />
    </div>
  );
}
