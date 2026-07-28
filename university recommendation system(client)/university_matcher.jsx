import { useState, useMemo } from "react";

// ============ UNIVERSITY DATABASE ============
const UNIVERSITIES = [
  // USA
  { id: 1, name: "Massachusetts Institute of Technology", country: "USA", city: "Cambridge, MA", ranking: 1, acceptRate: 4, minGPA: 3.9, avgSAT: 1550, minIELTS: 7.0, minTOEFL: 100, tuition: 60000, scholarships: "Need-based aid covers full need", programs: ["Engineering","Computer Science","Physics","Mathematics","Biology"], deadline: "Jan 1", type: "Private", logo: "🇺🇸" },
  { id: 2, name: "Stanford University", country: "USA", city: "Stanford, CA", ranking: 5, acceptRate: 4, minGPA: 3.9, avgSAT: 1540, minIELTS: 7.0, minTOEFL: 100, tuition: 62000, scholarships: "Need-blind for all; full need met", programs: ["Computer Science","Engineering","Business","Biology","Psychology"], deadline: "Jan 5", type: "Private", logo: "🇺🇸" },
  { id: 3, name: "Harvard University", country: "USA", city: "Cambridge, MA", ranking: 4, acceptRate: 3, minGPA: 3.9, avgSAT: 1550, minIELTS: 7.0, minTOEFL: 100, tuition: 59000, scholarships: "Need-blind; full need met", programs: ["Economics","Government","Biology","Computer Science","Law"], deadline: "Jan 1", type: "Private", logo: "🇺🇸" },
  { id: 4, name: "UC Berkeley", country: "USA", city: "Berkeley, CA", ranking: 12, acceptRate: 11, minGPA: 3.8, avgSAT: 1460, minIELTS: 6.5, minTOEFL: 90, tuition: 48000, scholarships: "Limited merit & need-based", programs: ["Computer Science","Engineering","Business","Biology","Chemistry"], deadline: "Nov 30", type: "Public", logo: "🇺🇸" },
  { id: 5, name: "University of Michigan", country: "USA", city: "Ann Arbor, MI", ranking: 33, acceptRate: 18, minGPA: 3.7, avgSAT: 1430, minIELTS: 6.5, minTOEFL: 88, tuition: 55000, scholarships: "Merit scholarships available", programs: ["Engineering","Business","Computer Science","Nursing","Psychology"], deadline: "Feb 1", type: "Public", logo: "🇺🇸" },
  { id: 6, name: "UIUC", country: "USA", city: "Champaign, IL", ranking: 64, acceptRate: 45, minGPA: 3.5, avgSAT: 1380, minIELTS: 6.5, minTOEFL: 80, tuition: 38000, scholarships: "Merit-based available", programs: ["Computer Science","Engineering","Business","Accounting","Agriculture"], deadline: "Jan 5", type: "Public", logo: "🇺🇸" },
  { id: 7, name: "Arizona State University", country: "USA", city: "Tempe, AZ", ranking: 220, acceptRate: 88, minGPA: 3.0, avgSAT: 1200, minIELTS: 6.0, minTOEFL: 61, tuition: 32000, scholarships: "New American University Scholar", programs: ["Business","Engineering","Computer Science","Design","Education"], deadline: "Rolling", type: "Public", logo: "🇺🇸" },
  { id: 8, name: "University of Texas at Austin", country: "USA", city: "Austin, TX", ranking: 58, acceptRate: 29, minGPA: 3.6, avgSAT: 1400, minIELTS: 6.5, minTOEFL: 79, tuition: 41000, scholarships: "Limited for international", programs: ["Engineering","Computer Science","Business","Communication","Sciences"], deadline: "Dec 1", type: "Public", logo: "🇺🇸" },
  { id: 9, name: "Purdue University", country: "USA", city: "West Lafayette, IN", ranking: 99, acceptRate: 53, minGPA: 3.4, avgSAT: 1350, minIELTS: 6.5, minTOEFL: 80, tuition: 31000, scholarships: "Merit scholarships available", programs: ["Engineering","Computer Science","Agriculture","Science","Aviation"], deadline: "Jan 15", type: "Public", logo: "🇺🇸" },
  { id: 10, name: "University of Southern California", country: "USA", city: "Los Angeles, CA", ranking: 80, acceptRate: 12, minGPA: 3.7, avgSAT: 1480, minIELTS: 7.0, minTOEFL: 100, tuition: 65000, scholarships: "Merit & need-based available", programs: ["Film","Business","Engineering","Computer Science","Communication"], deadline: "Jan 15", type: "Private", logo: "🇺🇸" },
  { id: 11, name: "New York University", country: "USA", city: "New York, NY", ranking: 38, acceptRate: 13, minGPA: 3.7, avgSAT: 1470, minIELTS: 7.5, minTOEFL: 100, tuition: 62000, scholarships: "Limited merit scholarships", programs: ["Business","Arts","Law","Media","Computer Science"], deadline: "Jan 5", type: "Private", logo: "🇺🇸" },
  { id: 12, name: "Georgia Tech", country: "USA", city: "Atlanta, GA", ranking: 45, acceptRate: 17, minGPA: 3.7, avgSAT: 1460, minIELTS: 7.0, minTOEFL: 90, tuition: 37000, scholarships: "Presidential Scholarship", programs: ["Engineering","Computer Science","Sciences","Business","Design"], deadline: "Jan 4", type: "Public", logo: "🇺🇸" },
  { id: 13, name: "Boston University", country: "USA", city: "Boston, MA", ranking: 93, acceptRate: 14, minGPA: 3.6, avgSAT: 1430, minIELTS: 7.0, minTOEFL: 90, tuition: 64000, scholarships: "Trustee & Presidential scholarships", programs: ["Business","Engineering","Communication","Law","Medicine"], deadline: "Jan 4", type: "Private", logo: "🇺🇸" },
  { id: 14, name: "University of Washington", country: "USA", city: "Seattle, WA", ranking: 63, acceptRate: 44, minGPA: 3.5, avgSAT: 1380, minIELTS: 6.0, minTOEFL: 76, tuition: 40000, scholarships: "Limited merit-based", programs: ["Computer Science","Engineering","Medicine","Business","Biology"], deadline: "Nov 15", type: "Public", logo: "🇺🇸" },
  { id: 15, name: "University of Florida", country: "USA", city: "Gainesville, FL", ranking: 168, acceptRate: 23, minGPA: 3.6, avgSAT: 1400, minIELTS: 6.0, minTOEFL: 80, tuition: 28000, scholarships: "Limited for international", programs: ["Business","Engineering","Biology","Computer Science","Agriculture"], deadline: "Nov 1", type: "Public", logo: "🇺🇸" },

  // UK
  { id: 16, name: "University of Oxford", country: "UK", city: "Oxford", ranking: 3, acceptRate: 15, minGPA: 3.8, avgSAT: null, minIELTS: 7.0, minTOEFL: null, tuition: 42000, scholarships: "Clarendon, Rhodes, Chevening", programs: ["Law","Medicine","PPE","Sciences","Humanities"], deadline: "Oct 15 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 17, name: "University of Cambridge", country: "UK", city: "Cambridge", ranking: 2, acceptRate: 18, minGPA: 3.8, avgSAT: null, minIELTS: 7.5, minTOEFL: null, tuition: 40000, scholarships: "Gates Cambridge, Jardine", programs: ["Engineering","Natural Sciences","Mathematics","Law","Economics"], deadline: "Oct 15 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 18, name: "Imperial College London", country: "UK", city: "London", ranking: 6, acceptRate: 12, minGPA: 3.7, avgSAT: null, minIELTS: 7.0, minTOEFL: null, tuition: 42000, scholarships: "President's Scholarships", programs: ["Engineering","Medicine","Computer Science","Science","Mathematics"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 19, name: "University College London", country: "UK", city: "London", ranking: 9, acceptRate: 25, minGPA: 3.5, avgSAT: null, minIELTS: 6.5, minTOEFL: 92, tuition: 35000, scholarships: "UCL Global Scholarships", programs: ["Architecture","Law","Medicine","Computer Science","Economics"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 20, name: "University of Edinburgh", country: "UK", city: "Edinburgh", ranking: 27, acceptRate: 35, minGPA: 3.4, avgSAT: null, minIELTS: 6.5, minTOEFL: 92, tuition: 30000, scholarships: "Edinburgh Global Scholarships", programs: ["Medicine","Computer Science","Law","Business","Veterinary"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 21, name: "University of Manchester", country: "UK", city: "Manchester", ranking: 34, acceptRate: 40, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 90, tuition: 28000, scholarships: "Global Futures Scholarship", programs: ["Engineering","Business","Computer Science","Sciences","Arts"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 22, name: "King's College London", country: "UK", city: "London", ranking: 40, acceptRate: 30, minGPA: 3.4, avgSAT: null, minIELTS: 7.0, minTOEFL: 92, tuition: 30000, scholarships: "KCL International Scholarships", programs: ["Law","Medicine","Humanities","Computer Science","Business"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 23, name: "University of Warwick", country: "UK", city: "Coventry", ranking: 69, acceptRate: 30, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 87, tuition: 29000, scholarships: "Chancellor's International Scholarship", programs: ["Business","Economics","Engineering","Computer Science","Mathematics"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 24, name: "University of Leeds", country: "UK", city: "Leeds", ranking: 75, acceptRate: 45, minGPA: 3.2, avgSAT: null, minIELTS: 6.0, minTOEFL: 87, tuition: 25000, scholarships: "Leeds Academic Excellence", programs: ["Engineering","Business","Media","Arts","Sciences"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },
  { id: 25, name: "University of Birmingham", country: "UK", city: "Birmingham", ranking: 84, acceptRate: 50, minGPA: 3.0, avgSAT: null, minIELTS: 6.0, minTOEFL: 80, tuition: 23000, scholarships: "Birmingham International Scholarship", programs: ["Engineering","Business","Computer Science","Medicine","Sports Science"], deadline: "Jan 31 (UCAS)", type: "Public", logo: "🇬🇧" },

  // Canada
  { id: 26, name: "University of Toronto", country: "Canada", city: "Toronto, ON", ranking: 21, acceptRate: 43, minGPA: 3.6, avgSAT: null, minIELTS: 6.5, minTOEFL: 89, tuition: 45000, scholarships: "Lester B. Pearson Scholarship", programs: ["Engineering","Computer Science","Business","Medicine","Arts"], deadline: "Jan 15", type: "Public", logo: "🇨🇦" },
  { id: 27, name: "University of British Columbia", country: "Canada", city: "Vancouver, BC", ranking: 38, acceptRate: 46, minGPA: 3.5, avgSAT: null, minIELTS: 6.5, minTOEFL: 90, tuition: 42000, scholarships: "International Leader of Tomorrow", programs: ["Computer Science","Engineering","Business","Forestry","Sciences"], deadline: "Jan 15", type: "Public", logo: "🇨🇦" },
  { id: 28, name: "McGill University", country: "Canada", city: "Montreal, QC", ranking: 29, acceptRate: 42, minGPA: 3.5, avgSAT: null, minIELTS: 6.5, minTOEFL: 90, tuition: 35000, scholarships: "Entrance Scholarships", programs: ["Medicine","Law","Engineering","Arts","Sciences"], deadline: "Jan 15", type: "Public", logo: "🇨🇦" },
  { id: 29, name: "University of Waterloo", country: "Canada", city: "Waterloo, ON", ranking: 112, acceptRate: 52, minGPA: 3.4, avgSAT: null, minIELTS: 6.5, minTOEFL: 90, tuition: 38000, scholarships: "President's Scholarship", programs: ["Computer Science","Engineering","Mathematics","Co-op Programs","Sciences"], deadline: "Feb 1", type: "Public", logo: "🇨🇦" },
  { id: 30, name: "University of Alberta", country: "Canada", city: "Edmonton, AB", ranking: 111, acceptRate: 55, minGPA: 3.2, avgSAT: null, minIELTS: 6.5, minTOEFL: 86, tuition: 30000, scholarships: "International Student Scholarship", programs: ["Engineering","Sciences","Business","AI","Medicine"], deadline: "Mar 1", type: "Public", logo: "🇨🇦" },
  { id: 31, name: "University of Ottawa", country: "Canada", city: "Ottawa, ON", ranking: 203, acceptRate: 60, minGPA: 3.0, avgSAT: null, minIELTS: 6.5, minTOEFL: 86, tuition: 28000, scholarships: "Entrance & Merit Scholarships", programs: ["Law","Health","Engineering","Bilingual Programs","Sciences"], deadline: "Apr 1", type: "Public", logo: "🇨🇦" },
  { id: 32, name: "Simon Fraser University", country: "Canada", city: "Burnaby, BC", ranking: 318, acceptRate: 58, minGPA: 3.0, avgSAT: null, minIELTS: 6.5, minTOEFL: 88, tuition: 30000, scholarships: "SFU Entrance Scholarship", programs: ["Computer Science","Business","Communication","Kinesiology","Engineering"], deadline: "Jan 31", type: "Public", logo: "🇨🇦" },
  { id: 33, name: "McMaster University", country: "Canada", city: "Hamilton, ON", ranking: 152, acceptRate: 50, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 86, tuition: 35000, scholarships: "Merit-based entrance awards", programs: ["Health Sciences","Engineering","Business","Sciences","Humanities"], deadline: "Jan 15", type: "Public", logo: "🇨🇦" },

  // Australia
  { id: 34, name: "University of Melbourne", country: "Australia", city: "Melbourne, VIC", ranking: 14, acceptRate: 50, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 79, tuition: 35000, scholarships: "Melbourne International Scholarship", programs: ["Medicine","Law","Engineering","Arts","Sciences"], deadline: "Oct 31 / May 31", type: "Public", logo: "🇦🇺" },
  { id: 35, name: "University of Sydney", country: "Australia", city: "Sydney, NSW", ranking: 18, acceptRate: 45, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 85, tuition: 38000, scholarships: "Sydney Scholars Awards", programs: ["Medicine","Law","Business","Engineering","Arts"], deadline: "Jan 15 / Jun 25", type: "Public", logo: "🇦🇺" },
  { id: 36, name: "University of New South Wales", country: "Australia", city: "Sydney, NSW", ranking: 19, acceptRate: 50, minGPA: 3.2, avgSAT: null, minIELTS: 6.5, minTOEFL: 90, tuition: 36000, scholarships: "UNSW International Scholarships", programs: ["Engineering","Computer Science","Business","Design","Sciences"], deadline: "Nov 30 / May 31", type: "Public", logo: "🇦🇺" },
  { id: 37, name: "Australian National University", country: "Australia", city: "Canberra, ACT", ranking: 30, acceptRate: 35, minGPA: 3.3, avgSAT: null, minIELTS: 6.5, minTOEFL: 80, tuition: 34000, scholarships: "Chancellor's International Scholarship", programs: ["Politics","Science","Engineering","Law","Economics"], deadline: "Dec 15 / May 15", type: "Public", logo: "🇦🇺" },
  { id: 38, name: "University of Queensland", country: "Australia", city: "Brisbane, QLD", ranking: 40, acceptRate: 55, minGPA: 3.0, avgSAT: null, minIELTS: 6.5, minTOEFL: 87, tuition: 33000, scholarships: "UQ Excellence Scholarship", programs: ["Engineering","Sciences","Business","Health","Agriculture"], deadline: "Nov 30 / May 31", type: "Public", logo: "🇦🇺" },
  { id: 39, name: "Monash University", country: "Australia", city: "Melbourne, VIC", ranking: 42, acceptRate: 55, minGPA: 3.0, avgSAT: null, minIELTS: 6.0, minTOEFL: 79, tuition: 35000, scholarships: "Monash International Merit Scholarship", programs: ["Pharmacy","Engineering","Business","IT","Education"], deadline: "Rolling", type: "Public", logo: "🇦🇺" },
  { id: 40, name: "University of Western Australia", country: "Australia", city: "Perth, WA", ranking: 77, acceptRate: 60, minGPA: 3.0, avgSAT: null, minIELTS: 6.5, minTOEFL: 82, tuition: 30000, scholarships: "Global Excellence Scholarship", programs: ["Marine Science","Mining Engineering","Business","Law","Medicine"], deadline: "Rolling", type: "Public", logo: "🇦🇺" },
  { id: 41, name: "University of Adelaide", country: "Australia", city: "Adelaide, SA", ranking: 89, acceptRate: 65, minGPA: 2.8, avgSAT: null, minIELTS: 6.0, minTOEFL: 79, tuition: 28000, scholarships: "Global Academic Excellence Scholarship", programs: ["Wine & Food","Engineering","Health Sciences","Computer Science","Arts"], deadline: "Rolling", type: "Public", logo: "🇦🇺" },
];

const COUNTRIES_LIST = ["Pakistan","India","Bangladesh","Sri Lanka","Nepal","Philippines","Indonesia","Malaysia","Vietnam","Myanmar","Thailand","Cambodia","Other"];
const STUDY_FIELDS = ["Computer Science","Engineering","Business","Medicine","Law","Sciences","Mathematics","Arts","Psychology","Economics","Architecture","Agriculture","Communication","Education","Design"];
const GRADING_SYSTEMS = ["GPA (4.0 scale)","Percentage (100)","A-Levels (A*-E)","IB (45 points)"];

// ============ MATCHING ALGORITHM ============
function scoreUniversity(uni, profile) {
  let score = 0;
  let reasons = [];
  let warnings = [];

  // 1. GPA fit (max 30 points)
  const normalizedGPA = normalizeGPA(profile.gpa, profile.gradingSystem);
  if (normalizedGPA >= uni.minGPA) {
    const gpaBonus = Math.min((normalizedGPA - uni.minGPA) * 20, 15);
    score += 15 + gpaBonus;
    reasons.push("Your grades meet the requirement");
  } else {
    const gap = uni.minGPA - normalizedGPA;
    if (gap <= 0.2) {
      score += 8;
      warnings.push("Your GPA is slightly below average — still possible with strong extras");
    } else {
      score -= 5;
      warnings.push("Your GPA is below the typical range for admitted students");
    }
  }

  // 2. Budget fit (max 25 points)
  if (profile.budget >= uni.tuition) {
    score += 25;
    reasons.push("Within your budget");
  } else if (profile.needsScholarship && uni.scholarships.toLowerCase().includes("full")) {
    score += 18;
    reasons.push("Full scholarships available — could bridge the gap");
  } else if (profile.budget >= uni.tuition * 0.7) {
    score += 12;
    reasons.push("Partial scholarships could make this affordable");
  } else {
    score += 3;
    warnings.push("Tuition exceeds your budget — scholarships would be essential");
  }

  // 3. Test scores (max 15 points)
  if (uni.avgSAT && profile.sat) {
    if (profile.sat >= uni.avgSAT) { score += 15; reasons.push("SAT score is competitive"); }
    else if (profile.sat >= uni.avgSAT - 80) { score += 8; }
    else { score -= 3; warnings.push("SAT score is below the typical range"); }
  }
  if (uni.minIELTS && profile.ielts) {
    if (profile.ielts >= uni.minIELTS) { score += 10; reasons.push("IELTS score meets requirement"); }
    else { score -= 5; warnings.push("IELTS score below minimum — consider retaking"); }
  }
  if (uni.minTOEFL && profile.toefl) {
    if (profile.toefl >= uni.minTOEFL) { score += 10; reasons.push("TOEFL score meets requirement"); }
    else { score -= 5; warnings.push("TOEFL score below minimum"); }
  }

  // 4. Program match (max 20 points)
  const matchedPrograms = profile.fields.filter(f => uni.programs.includes(f));
  if (matchedPrograms.length > 0) {
    score += Math.min(matchedPrograms.length * 10, 20);
    reasons.push(`Offers ${matchedPrograms.join(", ")}`);
  }

  // 5. Acceptance rate realism (max 10 points)
  if (uni.acceptRate >= 40) { score += 10; reasons.push("Good acceptance rate"); }
  else if (uni.acceptRate >= 15) { score += 5; }
  else { warnings.push(`Very competitive (${uni.acceptRate}% acceptance rate)`); }

  // Classify match type
  let matchType = "Safety";
  if (score >= 60) matchType = "Strong Match";
  else if (score >= 40) matchType = "Good Match";
  else if (score >= 25) matchType = "Reach";
  else matchType = "High Reach";

  return { uni, score: Math.max(score, 0), reasons, warnings, matchType, matchedPrograms };
}

function normalizeGPA(value, system) {
  if (!value) return 0;
  switch (system) {
    case "Percentage (100)": return (value / 100) * 4;
    case "A-Levels (A*-E)": return Math.min(value * 0.8, 4.0);
    case "IB (45 points)": return (value / 45) * 4;
    default: return value;
  }
}

// ============ STYLES ============
const theme = {
  bg: "#0a0f1a",
  card: "#111827",
  cardHover: "#1a2236",
  border: "#1e293b",
  accent: "#6366f1",
  accentLight: "#818cf8",
  accentGlow: "rgba(99,102,241,0.15)",
  green: "#22c55e",
  yellow: "#eab308",
  orange: "#f97316",
  red: "#ef4444",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
  textDim: "#64748b",
  inputBg: "#1e293b",
};

// ============ COMPONENTS ============
function StepIndicator({ current, total }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
            background: i <= current ? theme.accent : theme.inputBg,
            color: i <= current ? "#fff" : theme.textDim,
            fontSize: 13, fontWeight: 600,
            transition: "all 0.3s ease",
            boxShadow: i === current ? `0 0 16px ${theme.accentGlow}` : "none"
          }}>{i + 1}</div>
          {i < total - 1 && <div style={{ width: 40, height: 2, background: i < current ? theme.accent : theme.border }} />}
        </div>
      ))}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, min, max, step }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, color: theme.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        min={min} max={max} step={step}
        style={{
          width: "100%", padding: "10px 14px", background: theme.inputBg, border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.text, fontSize: 15, outline: "none", boxSizing: "border-box",
          transition: "border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = theme.accent}
        onBlur={e => e.target.style.borderColor = theme.border}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, color: theme.textMuted, marginBottom: 6, fontWeight: 500 }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "10px 14px", background: theme.inputBg, border: `1px solid ${theme.border}`,
          borderRadius: 8, color: theme.text, fontSize: 15, outline: "none", appearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
        }}
      >
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange, max = 3 }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else if (selected.length < max) onChange([...selected, opt]);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 13, color: theme.textMuted, marginBottom: 8, fontWeight: 500 }}>{label} <span style={{ color: theme.textDim }}>(max {max})</span></label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => (
          <button key={opt} onClick={() => toggle(opt)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: `1px solid ${selected.includes(opt) ? theme.accent : theme.border}`,
              background: selected.includes(opt) ? theme.accentGlow : "transparent",
              color: selected.includes(opt) ? theme.accentLight : theme.textMuted,
              fontSize: 13, cursor: "pointer", transition: "all 0.2s",
            }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

function MatchBadge({ type }) {
  const colors = {
    "Strong Match": theme.green,
    "Good Match": theme.accentLight,
    "Reach": theme.yellow,
    "High Reach": theme.orange,
    "Safety": theme.green,
  };
  return (
    <span style={{
      padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600, letterSpacing: 0.5,
      background: `${colors[type]}18`, color: colors[type], textTransform: "uppercase",
    }}>{type}</span>
  );
}

function ResultCard({ result, rank }) {
  const [expanded, setExpanded] = useState(false);
  const { uni, score, reasons, warnings, matchType, matchedPrograms } = result;
  const scoreColor = score >= 60 ? theme.green : score >= 40 ? theme.accentLight : score >= 25 ? theme.yellow : theme.orange;

  return (
    <div style={{
      background: theme.card, border: `1px solid ${theme.border}`, borderRadius: 12,
      padding: 20, marginBottom: 12, cursor: "pointer", transition: "all 0.2s",
    }} onClick={() => setExpanded(!expanded)}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: theme.textDim, minWidth: 28 }}>#{rank}</span>
            <span style={{ fontSize: 22 }}>{uni.logo}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>{uni.name}</div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>{uni.city} · {uni.type} · QS #{uni.ranking}</div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <MatchBadge type={matchType} />
          <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor, marginTop: 4 }}>{score}</div>
          <div style={{ fontSize: 10, color: theme.textDim, textTransform: "uppercase", letterSpacing: 1 }}>match score</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        <MiniStat label="Tuition" value={`$${(uni.tuition / 1000).toFixed(0)}k/yr`} />
        <MiniStat label="Accept Rate" value={`${uni.acceptRate}%`} />
        <MiniStat label="IELTS Min" value={uni.minIELTS || "N/A"} />
        <MiniStat label="Deadline" value={uni.deadline} />
      </div>

      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${theme.border}` }}>
          {reasons.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ fontSize: 13, color: theme.green, marginBottom: 4 }}>✓ {r}</div>
              ))}
            </div>
          )}
          {warnings.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              {warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 13, color: theme.yellow, marginBottom: 4 }}>⚠ {w}</div>
              ))}
            </div>
          )}
          <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 8 }}>
            <strong style={{ color: theme.text }}>Scholarships:</strong> {uni.scholarships}
          </div>
          <div style={{ fontSize: 13, color: theme.textMuted }}>
            <strong style={{ color: theme.text }}>Programs:</strong> {uni.programs.join(", ")}
          </div>
        </div>
      )}
      <div style={{ textAlign: "center", marginTop: 8 }}>
        <span style={{ fontSize: 11, color: theme.textDim }}>{expanded ? "▲ Less" : "▼ Tap for details"}</span>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div style={{ background: theme.inputBg, padding: "6px 12px", borderRadius: 8, minWidth: 80 }}>
      <div style={{ fontSize: 10, color: theme.textDim, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{value}</div>
    </div>
  );
}

// ============ MAIN APP ============
export default function UniversityMatcher() {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    name: "", country: "", gpa: "", gradingSystem: "GPA (4.0 scale)",
    sat: "", ielts: "", toefl: "",
    preferredCountries: [], fields: [],
    budget: "", needsScholarship: false, extracurriculars: "", careerGoal: "",
  });
  const [showResults, setShowResults] = useState(false);

  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }));

  const results = useMemo(() => {
    if (!showResults) return [];
    const filtered = UNIVERSITIES.filter(u => profile.preferredCountries.includes(u.country));
    return filtered.map(u => scoreUniversity(u, profile))
      .sort((a, b) => b.score - a.score);
  }, [showResults, profile]);

  const canProceed = () => {
    if (step === 0) return profile.name && profile.country;
    if (step === 1) return profile.gpa && profile.gradingSystem;
    if (step === 2) return profile.preferredCountries.length > 0 && profile.fields.length > 0;
    if (step === 3) return profile.budget;
    return true;
  };

  if (showResults) {
    const strongCount = results.filter(r => r.matchType === "Strong Match" || r.matchType === "Safety").length;
    const goodCount = results.filter(r => r.matchType === "Good Match").length;
    const reachCount = results.filter(r => r.matchType === "Reach" || r.matchType === "High Reach").length;

    return (
      <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <button onClick={() => { setShowResults(false); setStep(3); }}
            style={{ background: "none", border: "none", color: theme.accentLight, fontSize: 14, cursor: "pointer", marginBottom: 16, padding: 0 }}>
            ← Edit your profile
          </button>

          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Your Matches, {profile.name.split(" ")[0]} 🎓</h1>
          <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 20 }}>
            {results.length} universities matched · {strongCount} strong · {goodCount} good · {reachCount} reach
          </p>

          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {profile.preferredCountries.map(c => (
              <span key={c} style={{ padding: "4px 12px", background: theme.accentGlow, color: theme.accentLight, borderRadius: 16, fontSize: 12 }}>{c}</span>
            ))}
            {profile.fields.map(f => (
              <span key={f} style={{ padding: "4px 12px", background: `${theme.green}15`, color: theme.green, borderRadius: 16, fontSize: 12 }}>{f}</span>
            ))}
          </div>

          {results.map((r, i) => <ResultCard key={r.uni.id} result={r} rank={i + 1} />)}

          {results.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: theme.textMuted }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div>No matches found. Try adjusting your preferences or budget.</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0: About You
    <div key="0">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Tell us about yourself</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>We'll use this to find universities that fit you best.</p>
      <Input label="Full Name" value={profile.name} onChange={v => update("name", v)} placeholder="Ahmed Khan" />
      <Select label="Country of Residence" value={profile.country} onChange={v => update("country", v)} options={COUNTRIES_LIST} />
    </div>,
    // Step 1: Academics
    <div key="1">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Your academics</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>Enter your grades and any test scores you have.</p>
      <Select label="Grading System" value={profile.gradingSystem} onChange={v => update("gradingSystem", v)} options={GRADING_SYSTEMS} />
      <Input label={profile.gradingSystem === "GPA (4.0 scale)" ? "GPA (out of 4.0)" : profile.gradingSystem === "Percentage (100)" ? "Percentage" : profile.gradingSystem === "A-Levels (A*-E)" ? "A-Level Points (1-5, where 5=A*)" : "IB Score (out of 45)"}
        type="number" value={profile.gpa} onChange={v => update("gpa", parseFloat(v) || "")}
        placeholder={profile.gradingSystem === "GPA (4.0 scale)" ? "3.7" : profile.gradingSystem === "Percentage (100)" ? "85" : "38"} />
      <Input label="SAT Score (optional)" type="number" value={profile.sat} onChange={v => update("sat", parseInt(v) || "")} placeholder="1400" />
      <Input label="IELTS Score (optional)" type="number" value={profile.ielts} onChange={v => update("ielts", parseFloat(v) || "")} placeholder="7.0" step="0.5" />
      <Input label="TOEFL Score (optional)" type="number" value={profile.toefl} onChange={v => update("toefl", parseInt(v) || "")} placeholder="95" />
    </div>,
    // Step 2: Preferences
    <div key="2">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Where & what do you want to study?</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>Pick your preferred countries and fields of interest.</p>
      <MultiSelect label="Preferred Countries" options={["USA","UK","Canada","Australia"]} selected={profile.preferredCountries} onChange={v => update("preferredCountries", v)} max={4} />
      <MultiSelect label="Fields of Interest" options={STUDY_FIELDS} selected={profile.fields} onChange={v => update("fields", v)} max={3} />
    </div>,
    // Step 3: Budget & Extras
    <div key="3">
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Budget & goals</h2>
      <p style={{ color: theme.textMuted, fontSize: 14, marginBottom: 24 }}>Help us find universities you can afford.</p>
      <Input label="Maximum Annual Budget (USD)" type="number" value={profile.budget} onChange={v => update("budget", parseInt(v) || "")} placeholder="30000" />
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div onClick={() => update("needsScholarship", !profile.needsScholarship)}
            style={{
              width: 44, height: 24, borderRadius: 12, padding: 2, cursor: "pointer", transition: "all 0.2s",
              background: profile.needsScholarship ? theme.accent : theme.inputBg,
            }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s",
              transform: profile.needsScholarship ? "translateX(20px)" : "translateX(0)",
            }} />
          </div>
          <span style={{ fontSize: 14, color: theme.text }}>I need a scholarship to attend</span>
        </label>
      </div>
      <Input label="Career Goal (optional)" value={profile.careerGoal} onChange={v => update("careerGoal", v)} placeholder="Software Engineer" />
      <Input label="Extracurricular Activities (optional)" value={profile.extracurriculars} onChange={v => update("extracurriculars", v)} placeholder="Debate, Coding club, Volunteer work" />
    </div>,
  ];

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, color: theme.text, padding: "24px 16px", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>University Finder</h1>
          <p style={{ color: theme.textMuted, fontSize: 13, margin: "4px 0 0" }}>Find your best-fit universities abroad</p>
        </div>

        <StepIndicator current={step} total={4} />
        {steps[step]}

        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              style={{
                flex: 1, padding: "12px 0", borderRadius: 10, border: `1px solid ${theme.border}`,
                background: "transparent", color: theme.textMuted, fontSize: 15, fontWeight: 600, cursor: "pointer",
              }}>Back</button>
          )}
          <button
            onClick={() => { if (step < 3) setStep(s => s + 1); else setShowResults(true); }}
            disabled={!canProceed()}
            style={{
              flex: 2, padding: "12px 0", borderRadius: 10, border: "none",
              background: canProceed() ? theme.accent : theme.inputBg,
              color: canProceed() ? "#fff" : theme.textDim,
              fontSize: 15, fontWeight: 600, cursor: canProceed() ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: canProceed() ? `0 4px 20px ${theme.accentGlow}` : "none",
            }}>
            {step < 3 ? "Continue" : "Find My Universities →"}
          </button>
        </div>
      </div>
    </div>
  );
}
