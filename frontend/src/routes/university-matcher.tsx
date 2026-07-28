import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { api } from "../services/api";
import { Icon } from "../components/common/Icon";
import { useAuth } from "../hooks/useAuth";

export const Route = createFileRoute("/university-matcher")({
  component: UniversityMatcherRoute,
});

const COUNTRIES_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Holy See", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Other"
];

const STUDY_FIELDS = ["Computer Science", "Engineering", "Business", "Medicine", "Law", "Sciences", "Mathematics", "Arts", "Psychology", "Economics", "Architecture", "Agriculture", "Communication", "Education", "Design"];
const GRADING_SYSTEMS = ["GPA (4.0 scale)", "Percentage (100)", "A-Levels (A*-E)", "IB (45 points)"];

const BUDGET_OPTIONS = [
  { label: "Under $20,000", value: 20000 },
  { label: "$20,000 - $30,000", value: 30000 },
  { label: "$30,000 - $40,000", value: 40000 },
  { label: "Above $40,000", value: 999999 }
];

// ============ MATCHING ALGORITHM ============
function scoreUniversity(uni: any, profile: any) {
  let score = 0;
  let reasons: string[] = [];
  let warnings: string[] = [];

  // 1. GPA fit
  const normalizedGPA = normalizeGPA(profile.gpa, profile.gradingSystem);
  if (normalizedGPA >= uni.minGPA) {
    const gpaBonus = Math.min((normalizedGPA - uni.minGPA) * 20, 15);
    score += 15 + gpaBonus;
    reasons.push("Your grades meet the requirement");
  } else {
    const gap = uni.minGPA - normalizedGPA;
    if (gap <= 0.2) {
      score += 8;
      warnings.push("Your GPA is slightly below average");
    } else {
      score -= 5;
      warnings.push("Your GPA is below the typical range");
    }
  }

  // 2. Budget fit
  const maxBudget = Number(profile.budget) || 999999;
  if (maxBudget >= uni.tuition) {
    score += 25;
    reasons.push("Within your budget");
  } else if (profile.needsScholarship && uni.scholarships && uni.scholarships.toLowerCase().includes("full")) {
    score += 18;
    reasons.push("Full scholarships available");
  } else if (maxBudget >= uni.tuition * 0.7) {
    score += 12;
    reasons.push("Partial scholarships could make this affordable");
  } else {
    score += 3;
    warnings.push("Tuition exceeds budget , scholarships needed");
  }

  // 3. Test scores
  if (uni.avgSAT && profile.sat) {
    if (profile.sat >= uni.avgSAT) { score += 15; reasons.push("SAT score is competitive"); }
    else if (profile.sat >= uni.avgSAT - 80) { score += 8; }
    else { score -= 3; warnings.push("SAT score below typical range"); }
  }
  if (uni.minIELTS && profile.ielts) {
    if (profile.ielts >= uni.minIELTS) { score += 10; reasons.push("IELTS score meets requirement"); }
    else { score -= 5; warnings.push("IELTS score below minimum"); }
  }
  if (uni.minTOEFL && profile.toefl) {
    if (profile.toefl >= uni.minTOEFL) { score += 10; reasons.push("TOEFL score meets requirement"); }
    else { score -= 5; warnings.push("TOEFL score below minimum"); }
  }

  // 4. Program match
  const matchedPrograms = profile.fields.filter((f: string) => uni.programs && uni.programs.includes(f));
  if (matchedPrograms.length > 0) {
    score += Math.min(matchedPrograms.length * 10, 20);
    reasons.push(`Offers ${matchedPrograms.join(", ")}`);
  }

  // 5. Acceptance rate
  if (uni.acceptRate >= 40) { score += 10; reasons.push("Good acceptance rate"); }
  else if (uni.acceptRate >= 15) { score += 5; }
  else { warnings.push(`Competitive (${uni.acceptRate}%)`); }

  let matchType = "Safety";
  if (score >= 60) matchType = "Strong Match";
  else if (score >= 40) matchType = "Good Match";
  else if (score >= 25) matchType = "Reach";
  else matchType = "High Reach";

  return { uni, score: Math.max(Math.floor(score), 0), reasons, warnings, matchType, matchedPrograms };
}

function normalizeGPA(value: any, system: any) {
  if (!value) return 0;
  switch (system) {
    case "Percentage (100)": return (value / 100) * 4;
    case "A-Levels (A*-E)": return Math.min(value * 0.8, 4.0);
    case "IB (45 points)": return (value / 45) * 4;
    default: return value;
  }
}

// ============ COMPONENTS ============
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8 justify-center">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
            ${i <= current ? "bg-accent text-on-primary shadow-[0_0_12px_rgba(244,179,0,0.4)]" : "bg-surface-container-high text-on-surface-variant"}`}
          >
            {i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-10 h-0.5 ${i < current ? "bg-accent" : "bg-surface-container-high"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, min, max, step, required }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">{label} {required && "*"}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min} max={max} step={step}
        className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
      />
    </div>
  );
}

function Select({ label, value, onChange, options, required }: any) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">{label} {required && "*"}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%234A5568%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center]"
      >
        <option value="">Select...</option>
        {options.map((o: any) => (
          <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
            {typeof o === 'string' ? o : o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange, max = 3 }: any) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter((s: string) => s !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-on-surface-variant mb-2">
        {label} <span className="text-on-surface-variant/70 font-normal">(max {max})</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
              ${selected.includes(opt) 
                ? "bg-accent/10 border-accent text-accent" 
                : "bg-transparent border-outline-variant/60 text-on-surface-variant hover:border-outline"}`}
          >
            {opt}
          </button>
        ))}
        {options.includes("Other") && selected.includes("Other") && (
          <span className="px-3.5 py-1.5 rounded-full text-sm font-medium border bg-accent/10 border-accent text-accent">
            (Custom Typed)
          </span>
        )}
      </div>
    </div>
  );
}

function MatchBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    "Strong Match": "bg-green-100 text-green-700 border-green-200",
    "Good Match": "bg-blue-100 text-blue-700 border-blue-200",
    "Reach": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "High Reach": "bg-orange-100 text-orange-700 border-orange-200",
    "Safety": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
  const colorClass = colors[type] || colors["Good Match"];
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
      {type}
    </span>
  );
}

function ResultCard({ result, rank, isSelected, onToggleSelect }: any) {
  const [expanded, setExpanded] = useState(false);
  const { uni, score, reasons, warnings, matchType } = result;
  
  let scoreColorClass = "text-orange-500";
  if (score >= 60) scoreColorClass = "text-green-600";
  else if (score >= 40) scoreColorClass = "text-blue-600";
  else if (score >= 25) scoreColorClass = "text-yellow-500";

  return (
    <div className={`bg-surface rounded-2xl border ${isSelected ? 'border-accent ring-2 ring-accent/30' : 'border-outline-variant/40'} p-5 mb-4 shadow-sm hover:shadow-md transition-all duration-300 relative`}>
      <div className="absolute top-4 right-4 z-10">
        <label className="flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={onToggleSelect}
            className="w-5 h-5 rounded border-outline-variant text-accent focus:ring-accent accent-accent cursor-pointer"
          />
        </label>
      </div>

      <div className="flex justify-between items-start gap-4 pr-8">
        <div className="flex-1 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-outline">#{rank}</span>
            <span className="text-2xl">{uni.logo}</span>
            <div>
              <div className="text-lg font-bold text-on-surface">{uni.name}</div>
              <div className="text-xs font-medium text-on-surface-variant">
                {uni.city} &middot; {uni.type} &middot; QS #{uni.ranking}
              </div>
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <MatchBadge type={matchType} />
          <div className={`text-3xl font-extrabold mt-1 ${scoreColorClass}`}>{score}</div>
          <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Score</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-4 mb-4">
        <MiniStat label="Tuition" value={`$${(uni.tuition / 1000).toFixed(0)}k/yr`} />
        <MiniStat label="Accept Rate" value={`${uni.acceptRate}%`} />
        <MiniStat label="IELTS Min" value={uni.minIELTS || "N/A"} />
        <MiniStat label="Deadline" value={uni.deadline} />
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-outline-variant/30 animate-in fade-in slide-in-from-top-2">
          {reasons.length > 0 && (
            <div className="mb-3">
              {reasons.map((r: string, i: number) => (
                <div key={i} className="text-xs font-medium text-green-600 flex items-center gap-1.5 mb-1">
                  <Icon name="check_circle" className="text-[14px]" /> {r}
                </div>
              ))}
            </div>
          )}
          {warnings.length > 0 && (
            <div className="mb-3">
              {warnings.map((w: string, i: number) => (
                <div key={i} className="text-xs font-medium text-amber-600 flex items-center gap-1.5 mb-1">
                  <Icon name="warning" className="text-[14px]" /> {w}
                </div>
              ))}
            </div>
          )}
          <div className="text-sm text-on-surface-variant mb-2">
            <strong className="text-on-surface">Scholarships:</strong> {uni.scholarships}
          </div>
          <div className="text-sm text-on-surface-variant">
            <strong className="text-on-surface">Programs:</strong> {uni.programs.join(", ")}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-outline-variant/30 flex justify-between items-center">
        <button 
          onClick={() => setExpanded(!expanded)} 
          className="text-xs font-semibold text-accent hover:text-accent/80 transition-colors"
        >
          {expanded ? "Show Less" : "Show Details"}
        </button>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="bg-surface-container-low px-3 py-1.5 rounded-lg min-w-[70px]">
      <div className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">{label}</div>
      <div className="text-sm font-extrabold text-primary">{value}</div>
    </div>
  );
}

function ApplicationModal({ selectedUnis, profile, onClose }: { selectedUnis: any[], profile: any, onClose: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mapping of Uni Name -> Selected Scholarship
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

    if (profile.level === "UNDERGRADUATE") {
      if (!profile.secondaryType || (!profile.secondaryObtained && !profile.secondaryTotal && !profile.secondaryGrades && !profile.secondaryPercentage)) {
        setError("Matric/O-Level details in your profile are incomplete.");
        return;
      }
    }
    
    setLoading(true);
    setError("");

    // Format selected scholarships string: "LUMS: Merit | NUST: Need-based"
    const selectedScholarshipStr = selectedUnis.map(uni => {
      const sch = scholarships[uni.name] || "General Admission";
      return `${uni.name}: ${sch}`;
    }).join(" | ");

    try {
      const payload = {
        level: profile.level,
        secondaryType: profile.level === "UNDERGRADUATE" ? profile.secondaryType : "",
        secondaryObtained: profile.secondaryObtained ? Number(profile.secondaryObtained) : null,
        secondaryTotal: profile.secondaryTotal ? Number(profile.secondaryTotal) : null,
        secondaryGrades: profile.secondaryPercentage ? `${profile.secondaryGrades} (${profile.secondaryPercentage}%)` : profile.secondaryGrades,
        higherType: profile.level === "UNDERGRADUATE" ? profile.higherType : "",
        higherObtained: profile.higherObtained ? Number(profile.higherObtained) : null,
        higherTotal: profile.higherTotal ? Number(profile.higherTotal) : null,
        higherGrades: profile.higherPercentage ? `${profile.higherGrades} (${profile.higherPercentage}%)` : profile.higherGrades,
        gpa: profile.level === "GRADUATE" ? profile.gpa : "",
        satScore: profile.sat ? Number(profile.sat) : null,
        gradeYear: profile.gradeYear,
        targetUniversities: selectedUnis.map(u => u.name),
        selectedScholarship: selectedScholarshipStr,
        extracurriculars: profile.extracurriculars,
        budgetRange: profile.budget ? `$${profile.budget}` : "Not specified",
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
      <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl w-full max-w-md p-8 text-center shadow-xl border border-outline-variant/30">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check_circle" className="text-3xl" />
          </div>
          <h2 className="text-2xl font-display font-bold text-primary mb-2">Application Submitted!</h2>
          <p className="text-on-surface-variant mb-6">
            Your counseling request for <strong>{selectedUnis.length} universities</strong> has been sent. Our team will review your profile and contact you shortly.
          </p>
          <button 
            onClick={() => navigate({ to: "/" })}
            className="w-full py-3 bg-accent text-on-primary font-bold rounded-xl hover:bg-accent/90 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30 relative flex flex-col">
        <div className="sticky top-0 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-display font-bold text-primary">Apply to {selectedUnis.length} Universities</h2>
            <p className="text-xs font-medium text-on-surface-variant">Profile data will be automatically attached.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
          {error && (
            <div className="p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium border border-error/20">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-bold text-primary border-b border-outline-variant/30 pb-2">Target Universities & Scholarships</h3>
            {selectedUnis.map(uni => {
              const options = uni.scholarships ? uni.scholarships.split(",").map((s: string) => s.trim()).filter((s: string) => s) : [];
              return (
                <div key={uni._id || uni.id} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
                  <div className="font-bold text-on-surface mb-2">{uni.name}</div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">Select Scholarship</label>
                  {options.length > 0 ? (
                    <select 
                      value={scholarships[uni.name] || ""} 
                      onChange={e => setScholarships(prev => ({ ...prev, [uni.name]: e.target.value }))} 
                      className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent"
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
                      className="w-full px-3 py-2 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" 
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <h3 className="font-bold text-primary mb-2 text-sm">Attached Profile Data</h3>
            <div className="text-xs text-on-surface-variant space-y-1">
              <div><strong>Level:</strong> {profile.level}</div>
              {profile.level === "UNDERGRADUATE" && (
                <>
                  <div><strong>Matric/O-Level:</strong> {profile.secondaryType} {profile.secondaryGrades ? `${profile.secondaryGrades} ${profile.secondaryPercentage ? `(${profile.secondaryPercentage}%)` : ''}` : `${profile.secondaryObtained}/${profile.secondaryTotal}`}</div>
                  <div><strong>FSC/A-Level:</strong> {profile.higherType || "N/A"} {profile.higherGrades ? `${profile.higherGrades} ${profile.higherPercentage ? `(${profile.higherPercentage}%)` : ''}` : (profile.higherObtained ? `${profile.higherObtained}/${profile.higherTotal}` : "")}</div>
                </>
              )}
              {profile.level === "GRADUATE" && <div><strong>GPA:</strong> {profile.gpa}</div>}
              <div><strong>SAT:</strong> {profile.sat || "N/A"} | <strong>IELTS:</strong> {profile.ielts || "N/A"}</div>
            </div>
            <p className="text-[10px] mt-2 italic opacity-80">This information was pulled from your matching wizard.</p>
          </div>

          <div className="pt-4 border-t border-outline-variant/30 flex justify-end gap-3 sticky bottom-0 bg-surface py-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl font-bold bg-accent text-on-primary hover:bg-accent/90 transition-colors shadow-md disabled:opacity-70 flex items-center gap-2">
              {loading && <Icon name="sync" className="animate-spin text-[18px]" />}
              Submit Applications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UniversityMatcherContent() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<any>({
    name: "", country: "", customCountry: "",
    level: "UNDERGRADUATE",
    secondaryType: "MATRIC", secondaryObtained: "", secondaryTotal: "", secondaryGrades: "", secondaryPercentage: "",
    higherType: "", higherObtained: "", higherTotal: "", higherGrades: "", higherPercentage: "",
    gpa: "", gradingSystem: "GPA (4.0 scale)", gradeYear: "",
    sat: "", ielts: "", toefl: "",
    preferredCountries: [], customPreferredCountries: "", fields: [],
    budget: "", needsScholarship: false, extracurriculars: "",
  });
  const [showResults, setShowResults] = useState(false);
  const [selectedUnisMap, setSelectedUnisMap] = useState<Record<string, any>>({});
  const [isApplying, setIsApplying] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState("ALL");

  const { data: UNIVERSITIES = [], isLoading } = useQuery({
    queryKey: ["universities"],
    queryFn: async () => {
      const res = await api.get("/api/universities");
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
  });

  const update = (key: string, val: any) => setProfile((p: any) => ({ ...p, [key]: val }));

  const sheetNames = useMemo<string[]>(() => {
    const names = new Set<string>((UNIVERSITIES as any[]).map((u: any) => u.sheetName as string).filter(Boolean));
    return Array.from(names);
  }, [UNIVERSITIES]);

  const results = useMemo(() => {
    if (!showResults || UNIVERSITIES.length === 0) return [];
    
    // Resolve preferred countries list (including custom)
    const activePreferred = profile.preferredCountries.includes("Other") 
      ? [...profile.preferredCountries.filter((c: string) => c !== "Other"), profile.customPreferredCountries].filter(Boolean)
      : profile.preferredCountries;
      
    let filtered = UNIVERSITIES.filter((u: any) => activePreferred.includes(u.country));
    if (selectedSheet !== "ALL") {
      filtered = filtered.filter((u: any) => u.sheetName === selectedSheet);
    }
    return filtered.map((u: any) => scoreUniversity(u, profile))
      .sort((a: any, b: any) => b.score - a.score);
  }, [showResults, profile, UNIVERSITIES, selectedSheet]);

  const toggleSelectUni = (uni: any) => {
    setSelectedUnisMap(prev => {
      const next = { ...prev };
      if (next[uni.name]) delete next[uni.name];
      else next[uni.name] = uni;
      return next;
    });
  };

  const selectedUnisList = Object.values(selectedUnisMap);

  const canProceed = () => {
    if (step === 0) return profile.name && (profile.country === "Other" ? profile.customCountry : profile.country);
    if (step === 1) {
      if (profile.level === "UNDERGRADUATE" && (!profile.secondaryType || (!profile.secondaryGrades && !profile.secondaryObtained))) return false;
      if (profile.level === "GRADUATE" && !profile.gpa) return false;
      return true;
    }
    if (step === 2) {
      if (profile.level === "GRADUATE" && (!profile.gradingSystem || !profile.gpa)) return false;
      return true;
    }
    if (step === 3) return profile.preferredCountries.length > 0 && profile.fields.length > 0;
    if (step === 4) return profile.budget;
    return true;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="sync" className="animate-spin text-4xl text-accent" />
      </div>
    );
  }

  if (showResults) {
    const strongCount = results.filter((r: any) => r.matchType === "Strong Match" || r.matchType === "Safety").length;
    const goodCount = results.filter((r: any) => r.matchType === "Good Match").length;
    const reachCount = results.filter((r: any) => r.matchType === "Reach" || r.matchType === "High Reach").length;

    return (
      <div className="min-h-screen bg-surface-container pt-24 pb-32 px-4 md:px-6 relative">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => { setShowResults(false); setStep(4); }}
            className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors mb-6"
          >
            <Icon name="arrow_back" className="text-[18px]" /> Edit Profile
          </button>

          <h1 className="text-3xl font-display font-extrabold text-primary mb-2">
            Your Matches, {profile.name.split(" ")[0]} 🎓
          </h1>
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-on-surface-variant font-medium">
              {results.length} universities matched &middot; <span className="text-green-600">{strongCount} strong</span> &middot; <span className="text-blue-600">{goodCount} good</span> &middot; <span className="text-orange-500">{reachCount} reach</span>
            </p>
            {sheetNames.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider whitespace-nowrap">Data Sheet:</label>
                <select
                  value={selectedSheet}
                  onChange={(e) => setSelectedSheet(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-outline-variant bg-surface text-xs font-semibold focus:border-accent outline-none cursor-pointer"
                >
                  <option value="ALL">All Sheets</option>
                  {sheetNames.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {profile.preferredCountries.filter((c: string) => c !== "Other").map((c: string) => (
              <span key={c} className="px-3 py-1 bg-accent/10 text-accent font-bold text-xs rounded-full">{c}</span>
            ))}
            {profile.preferredCountries.includes("Other") && profile.customPreferredCountries && (
              <span className="px-3 py-1 bg-accent/10 text-accent font-bold text-xs rounded-full">{profile.customPreferredCountries}</span>
            )}
            {profile.fields.map((f: string) => (
              <span key={f} className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full">{f}</span>
            ))}
          </div>

          {results.map((r: any, i: number) => (
            <ResultCard 
              key={r.uni._id || r.uni.id} 
              result={r} 
              rank={i + 1} 
              isSelected={!!selectedUnisMap[r.uni.name]}
              onToggleSelect={() => toggleSelectUni(r.uni)}
            />
          ))}

          {results.length === 0 && (
            <div className="text-center py-20 bg-surface rounded-2xl border border-outline-variant/30">
              <Icon name="search_off" className="text-5xl text-outline mb-4" />
              <h3 className="text-xl font-bold text-on-surface mb-2">No matches found</h3>
              <p className="text-on-surface-variant">Try adjusting your preferences or budget.</p>
            </div>
          )}
        </div>

        {/* Floating Action Bar for Bulk Apply */}
        <div className={`fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] transform transition-transform duration-300 z-40 flex justify-center ${selectedUnisList.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="max-w-2xl w-full flex items-center justify-between">
            <div className="font-bold text-primary">
              <span className="bg-accent text-on-primary w-6 h-6 inline-flex items-center justify-center rounded-full text-xs mr-2">{selectedUnisList.length}</span>
              Universities Selected
            </div>
            <button 
              onClick={() => setIsApplying(true)}
              className="px-6 py-3 bg-primary text-on-primary font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all"
            >
              Apply to Selected
            </button>
          </div>
        </div>

        {isApplying && (
          <ApplicationModal 
            selectedUnis={selectedUnisList} 
            profile={profile} 
            onClose={() => setIsApplying(false)} 
          />
        )}
      </div>
    );
  }

  const steps = [
    // Step 0: About You
    <div key="0" className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-display font-bold text-primary mb-1">Tell us about yourself</h2>
      <p className="text-on-surface-variant text-sm mb-6">We'll use this to find universities that fit you best.</p>
      <Input label="Full Name" required value={profile.name} onChange={(v: any) => update("name", v)} placeholder="e.g. Ahmed Khan" />
      <Select label="Country of Residence" required value={profile.country} onChange={(v: any) => update("country", v)} options={COUNTRIES_LIST} />
      {profile.country === "Other" && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-2">
          <Input label="Type your country" required value={profile.customCountry} onChange={(v: any) => update("customCountry", v)} placeholder="e.g. France" />
        </div>
      )}
    </div>,

    // Step 1: Core Academics
    <div key="1" className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-display font-bold text-primary mb-1">Core Academics</h2>
      <p className="text-on-surface-variant text-sm mb-6">Enter your primary schooling information.</p>
      
      <div className="mb-4">
        <label className="block text-sm font-semibold text-on-surface mb-2">Academic Level *</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={profile.level === "UNDERGRADUATE"} onChange={() => update("level", "UNDERGRADUATE")} className="accent-accent" />
            <span className="text-sm font-medium">Undergraduate</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" checked={profile.level === "GRADUATE"} onChange={() => update("level", "GRADUATE")} className="accent-accent" />
            <span className="text-sm font-medium">Graduate</span>
          </label>
        </div>
      </div>

      {profile.level === "UNDERGRADUATE" ? (
        <>
          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 mb-4">
            <h3 className="font-bold text-primary mb-3">Secondary School (Matric/O-Level) *</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Select label="Type" value={profile.secondaryType} onChange={(v: any) => update("secondaryType", v)} options={["MATRIC", "O_LEVEL"]} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Marks/Grades</label>
                {profile.secondaryType === "MATRIC" ? (
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Obtained" value={profile.secondaryObtained} onChange={(e) => update("secondaryObtained", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                    <span className="text-on-surface-variant">/</span>
                    <input type="number" placeholder="Total" value={profile.secondaryTotal} onChange={(e) => update("secondaryTotal", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <input type="text" placeholder="e.g., 5A* 3A" value={profile.secondaryGrades} onChange={(e) => update("secondaryGrades", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                    <input type="number" placeholder="Average % (Optional)" value={profile.secondaryPercentage} onChange={(e) => update("secondaryPercentage", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/50 mb-2">
            <h3 className="font-bold text-primary mb-3">Higher Secondary (FSC/A-Level)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <Select label="Type" value={profile.higherType} onChange={(v: any) => update("higherType", v)} options={["", "FSC", "A_LEVEL"]} />
              </div>
              {profile.higherType && (
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1.5">Marks/Grades</label>
                  {profile.higherType === "FSC" ? (
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Obtained" value={profile.higherObtained} onChange={(e) => update("higherObtained", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                      <span className="text-on-surface-variant">/</span>
                      <input type="number" placeholder="Total" value={profile.higherTotal} onChange={(e) => update("higherTotal", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <input type="text" placeholder="e.g., 3A*" value={profile.higherGrades} onChange={(e) => update("higherGrades", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                      <input type="number" placeholder="Average % (Optional)" value={profile.higherPercentage} onChange={(e) => update("higherPercentage", e.target.value)} className="w-full px-3 py-2.5 bg-surface rounded-lg border border-outline-variant/50 outline-none focus:border-accent" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mb-2">
          <Input label="Undergraduate GPA *" value={profile.gpa} onChange={(v: any) => update("gpa", v)} placeholder="e.g. 3.8/4.0" />
        </div>
      )}
    </div>,

    // Step 2: Testing & Overall Score
    <div key="2" className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-display font-bold text-primary mb-1">Testing & Verification</h2>
      <p className="text-on-surface-variant text-sm mb-6">Standardized test scores and optional fields.</p>

      {profile.level === "GRADUATE" && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mb-6">
          <h3 className="font-bold text-primary mb-3 text-sm">Overall Academic Standing *</h3>
          <Select label="Grading System" value={profile.gradingSystem} onChange={(v: any) => update("gradingSystem", v)} options={GRADING_SYSTEMS} />
          <Input label="Overall Value" required type="number" value={profile.gpa} onChange={(v: any) => update("gpa", parseFloat(v) || "")} placeholder={profile.gradingSystem === "GPA (4.0 scale)" ? "3.7" : "85"} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <Input label="SAT Score (optional)" type="number" value={profile.sat} onChange={(v: any) => update("sat", parseInt(v) || "")} placeholder="e.g. 1400" />
        </div>
        <Input label="IELTS (optional)" type="number" value={profile.ielts} onChange={(v: any) => update("ielts", parseFloat(v) || "")} placeholder="7.0" step="0.5" />
        <Input label="TOEFL (optional)" type="number" value={profile.toefl} onChange={(v: any) => update("toefl", parseInt(v) || "")} placeholder="95" />
      </div>

      <div className="mb-2">
        <Input label="Current Grade / Year (optional)" value={profile.gradeYear} onChange={(v: any) => update("gradeYear", v)} placeholder="e.g., A-Levels Year 2, University Year 3" />
      </div>
    </div>,

    // Step 3: Preferences
    <div key="3" className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-display font-bold text-primary mb-1">Where & what?</h2>
      <p className="text-on-surface-variant text-sm mb-6">Pick your preferred countries and fields of interest.</p>
      
      <MultiSelect label="Preferred Countries" options={[...new Set(UNIVERSITIES.map((u:any) => u.country)), "Other"]} selected={profile.preferredCountries} onChange={(v: any) => update("preferredCountries", v)} max={4} />
      
      {profile.preferredCountries.includes("Other") && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-2">
          <Input label="Type other country" value={profile.customPreferredCountries} onChange={(v: any) => update("customPreferredCountries", v)} placeholder="e.g. France, Germany" />
        </div>
      )}

      <MultiSelect label="Fields of Interest" options={STUDY_FIELDS} selected={profile.fields} onChange={(v: any) => update("fields", v)} max={3} />
    </div>,

    // Step 4: Budget & Extras
    <div key="4" className="animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-display font-bold text-primary mb-1">Budget & goals</h2>
      <p className="text-on-surface-variant text-sm mb-6">Help us find universities you can afford.</p>
      
      <Select label="Maximum Annual Tuition Budget (USD) *" required value={profile.budget} onChange={(v: any) => update("budget", v)} options={BUDGET_OPTIONS} />
      
      <div className="mb-6 bg-surface-container p-4 rounded-xl border border-outline-variant/50">
        <label className="flex items-center gap-3 cursor-pointer">
          <div 
            onClick={() => update("needsScholarship", !profile.needsScholarship)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${profile.needsScholarship ? "bg-accent" : "bg-outline-variant/60"}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${profile.needsScholarship ? "translate-x-6" : "translate-x-0"}`} />
          </div>
          <span className="text-sm font-semibold text-on-surface">I strictly need a scholarship to attend</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-on-surface-variant mb-1.5">Extracurricular Summary (optional)</label>
        <textarea 
          rows={3}
          value={profile.extracurriculars}
          onChange={(e) => update("extracurriculars", e.target.value)}
          placeholder="Debate, Coding club, Volunteer work"
          className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all resize-none"
        />
      </div>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-primary-fixed rounded-2xl items-center justify-center text-primary mb-4 shadow-sm">
            <Icon name="school" className="text-3xl" />
          </div>
          <h1 className="text-3xl font-display font-extrabold text-primary">University Matcher</h1>
          <p className="text-on-surface-variant mt-2 font-medium">Discover universities that fit your profile perfectly</p>
        </div>

        <StepIndicator current={step} total={5} />
        
        <div className="bg-surface p-6 rounded-3xl border border-outline-variant/40 shadow-lg shadow-primary/5">
          {steps[step]}

          <div className="flex gap-3 mt-8">
            {step > 0 && (
              <button 
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3.5 rounded-xl border border-outline-variant/60 text-on-surface-variant font-bold hover:bg-surface-container transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => { if (step < 4) setStep(s => s + 1); else setShowResults(true); }}
              disabled={!canProceed()}
              className="flex-[2] py-3.5 rounded-xl bg-accent text-on-primary font-bold shadow-[0_4px_20px_rgba(244,179,0,0.3)] hover:bg-accent/90 transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
            >
              {step < 4 ? "Continue" : "Find My Matches"} 
              <Icon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
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
