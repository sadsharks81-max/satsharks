import { useState } from "react";

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="flex-shrink-0 mt-0.5"
  >
    <circle cx="10" cy="10" r="10" fill="#0ea5e9" opacity="0.15" />
    <path
      d="M6 10.5l2.5 2.5 5.5-5.5"
      stroke="#0ea5e9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const StarIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className="flex-shrink-0 mt-0.5"
  >
    <path
      d="M10 2l2.35 4.76 5.25.77-3.8 3.7.9 5.24L10 13.97l-4.7 2.5.9-5.24-3.8-3.7 5.25-.77L10 2z"
      fill="#f59e0b"
    />
  </svg>
);
const WAIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const ChevDown = ({ open }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transition: "transform 0.3s",
      transform: open ? "rotate(180deg)" : "rotate(0deg)",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const WA = "923164514334";
const trackRecord = [
  "International Math Olympiad medalists",
  "National Science competition winners",
  "International debate and MUN champions",
  "National level hackathon finalists",
  "Published research authors",
  "Social enterprise founders",
];

const guided = [
  {
    cat: "Personal Statement, Collaborative Deep Dive",
    items: [
      "Work one on one with a counsellor who knows exactly what LUMS admissions looks for",
      "Uncover the real story behind your experiences, not the version everyone else writes",
      "Shape your narrative until it is sharp, authentic, and impossible to forget",
      "Multiple rounds of feedback until your voice comes through on every line",
    ],
  },
  {
    cat: "Extracurricular and Awards Descriptions",
    items: [
      "Rewrite every entry to highlight leadership, initiative, and measurable impact",
      "Position activities strategically because LUMS values depth over breadth",
      "Optimized phrasing that makes the most of every character",
    ],
  },
  {
    cat: "Cohesive Application Narrative",
    items: [
      "Connect your Personal Statement, Extracurriculars, and Awards into one unified, intentional story",
      "Eliminate contradictions and repetition across sections",
      "Ensure the admissions committee sees a focused applicant with clear direction",
    ],
  },
];

const complete = [
  {
    cat: "Personal Statement, Written For You",
    items: [
      "We craft your entire LUMS Personal Statement from the ground up",
      "Already have a draft? We will transform it into something compelling",
      "Built on deep interviews to capture your authentic voice",
      "Unlimited revisions until you are fully confident in the result",
    ],
  },
  {
    cat: "Complete Extracurricular and Awards Build Out",
    items: [
      "All extracurricular and awards descriptions written from scratch",
      "Profile analysis to identify hidden strengths and fill gaps",
      "Strategic positioning of activities to match what LUMS values most",
    ],
  },
  {
    cat: "Extracurricular Development",
    items: [
      "Our dedicated EC developers design and guide you through competitions, research projects, and leadership roles LUMS actually cares about",
      "Build Math Olympiad preparation, Science competition entries, MUN participation, or hackathon projects from scratch",
      "We don't just describe your activities. We help you create them before you even apply",
      "Real, verifiable achievements that make your application impossible to ignore",
    ],
  },
  {
    cat: "Opportunity and Competition Guidance",
    items: [
      "Curated recommendations for competitions and programs that elevate your profile",
      "Guidance on national and international opportunities that LUMS respects",
      "Support from registration through to winning",
      "Build real, verifiable achievements before your application goes in",
    ],
  },
];

const scholarships = [
  {
    name: "National Outreach Programme (NOP)",
    detail:
      "LUMS flagship full ride scholarship. Covers 100% tuition, hostel accommodation, meals, and living stipends for talented students from financially disadvantaged backgrounds across Pakistan",
  },
  {
    name: "Sekha Scholarship",
    detail:
      "100% tuition fee waiver for the entire undergraduate degree at SBASSE for FSc top 10 position holders from any of the 23 national boards",
  },
  {
    name: "PHEC Honhaar Undergraduate Scholarship",
    detail:
      "Joint initiative between LUMS and Punjab Higher Education Commission providing support to high achieving students to pursue undergraduate studies without financial burden",
  },
  {
    name: "Punjab Educational Endowment Fund (PEEF)",
    detail:
      "External scholarship available to LUMS students from Punjab providing financial support based on merit and need",
  },
  {
    name: "LUMS Merit Scholarships",
    detail:
      "100 scholarships for top ranked students on the admissions evaluation list. Covers partial to full tuition for one year, renewed based on CGPA and Dean's Honour List",
  },
  {
    name: "Need Based Tuition Fee Waiver",
    detail:
      "Covers 20% to 100% of tuition fees based on demonstrated financial need. Over 40% of LUMS students receive some form of financial aid",
  },
  {
    name: "SBASSE Honorific Fellowships",
    detail:
      "50% tuition waiver for top students majoring in Biology, Chemistry, Mathematics, and Physics. Awarded to sophomores, juniors, and seniors. Named fellowships include Bilqees Mujeeb (Biology), Ahmed H. Zewail (Chemistry), and Chandrasekhar (Physics)",
  },
  {
    name: "Teaching Assistantships and Research Assistantships",
    detail:
      "Paid positions for graduate and senior undergraduate students providing stipends and valuable academic experience working alongside LUMS faculty",
  },
  {
    name: "Shahid Hussain Foundation Scholarships",
    detail:
      "Financial support specifically for international students applying to LUMS",
  },
  {
    name: "Alumni and External Donor Funding",
    detail:
      "LUMS collaborates with various alumni and corporate donors to facilitate students through a range of named scholarships and financial support programs",
  },
];

const programs = [
  {
    school: "Suleman Dawood School of Business (SDSB)",
    progs:
      "BBA, MBA, Executive MBA, MS Healthcare Management, MS Technology Management, MS Business and Public Policy, MS Financial Management, MS Accounting and Analytics, PhD",
  },
  {
    school: "Syed Babar Ali School of Science and Engineering (SBASSE)",
    progs:
      "BSc Computer Science, BSc Electrical Engineering, BSc Mathematics, BSc Physics, BSc Chemistry, BSc Biology, BSc Economics and Mathematics, MS, PhD",
  },
  {
    school:
      "Mushtaq Ahmad Gurmani School of Humanities and Social Sciences (MGSHSS)",
    progs:
      "BA Economics, BA Political Science, BA Sociology, BA Psychology, BA History, BA English, BA Comparative Literary and Cultural Studies, MA, PhD",
  },
  {
    school: "Shaikh Ahmad Hassan School of Law (SAHSOL)",
    progs: "BA LLB (Hons), LLM",
  },
  {
    school: "Syed Ahsan Ali and Syed Maratib Ali School of Education (SOE)",
    progs:
      "BS Educational Psychology (New), MPhil Education Leadership and Management, Executive MPhil Education Leadership and Management, Undergraduate Minors in Education",
  },
];

export default function SATSharksLUMSPK() {
  const [showReg, setShowReg] = useState(false);
  const [selTier, setSelTier] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    program: "",
  });
  const [done, setDone] = useState(false);
  const [schlOpen, setSchlOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);
  const openReg = (tier) => {
    setSelTier(tier);
    setShowReg(true);
    setDone(false);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Inter','Segoe UI',system-ui,sans-serif" }}
    >
      {/* Nav */}
      <nav className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "#0f1b2d" }}
          >
            SAT
          </span>
          <span
            className="text-lg font-black tracking-tight"
            style={{ color: "#0ea5e9" }}
          >
            Sharks
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-sm font-semibold px-4 py-2 rounded-full"
            style={{ backgroundColor: "#0f1b2d", color: "white" }}
            onClick={() => openReg("")}
          >
            Register
          </button>
          <button
            className="text-sm font-semibold px-4 py-2 rounded-full text-white flex items-center gap-1.5"
            style={{ backgroundColor: "#25D366" }}
            onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}
          >
            <WAIcon />
            <span className="hidden sm:inline">Chat</span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="px-5 pt-14 pb-10 text-center"
        style={{
          background:
            "linear-gradient(165deg, #0f1b2d 0%, #1a2744 50%, #1e3054 100%)",
        }}
      >
        <span
          className="inline-block text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
        >
          LUMS Admissions Counselling
        </span>
        <h1 className="text-3xl font-extrabold text-white leading-tight mb-2">
          LUMS Doesn't Pick
        </h1>
        <h1
          className="text-3xl font-extrabold leading-tight mb-5"
          style={{ color: "#f59e0b" }}
        >
          The Loudest Applicant.
        </h1>
        <p
          className="text-sm leading-relaxed max-w-md mx-auto mb-8"
          style={{ color: "#94a3b8" }}
        >
          They pick the one with the clearest story. We help you find yours and
          write it in a way the admissions committee won't forget.
        </p>
        <div className="flex justify-center gap-6 mb-6">
          {[
            { num: "98%", label: "Acceptance 2026", color: "#22c55e" },
            { num: "100%", label: "Acceptance 2025", color: "#f59e0b" },
            { num: "All", label: "Programs Covered", color: "#60a5fa" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-2xl font-extrabold"
                style={{ color: s.color }}
              >
                {s.num}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mb-6" style={{ color: "#64748b" }}>
          All results verified on our Instagram
        </p>
        <button
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold uppercase tracking-wide"
          style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
          onClick={() => openReg("")}
        >
          Register for Free Consultation
        </button>
      </section>

      {/* Track Record */}
      <section
        className="px-5 py-6 text-center"
        style={{
          backgroundColor: "#f8fafc",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-base">🏆</span>
          <h3
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#0f1b2d" }}
          >
            Our Students' Track Record
          </h3>
        </div>
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
          {trackRecord.map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1.5 rounded-full font-medium bg-white border border-gray-200"
              style={{ color: "#475569" }}
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-2"
          style={{ color: "#0f1b2d" }}
        >
          We Don't Just Write Essays. We Build LUMS Applicants.
        </h2>
        <p
          className="text-center text-sm mb-8 max-w-lg mx-auto"
          style={{ color: "#64748b" }}
        >
          Most consultancies polish your existing profile. We build the profile
          LUMS actually wants to see.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "🔬",
              title: "EC Developers",
              desc: "Dedicated team that designs and guides you through Math Olympiads, Science competitions, MUN, hackathons, and research projects. We create the achievements, not just describe them.",
            },
            {
              icon: "✍️",
              title: "LUMS Specific Essays",
              desc: "Counsellors who know exactly what LUMS admissions looks for. Every word calibrated for LUMS, not generic university applications.",
            },
            {
              icon: "📊",
              title: "98% Acceptance Rate",
              desc: "Our track record speaks for itself. 98% in 2026, 100% in 2025. Every claim verified on our Instagram.",
            },
            {
              icon: "🎯",
              title: "Profile Gap Analysis",
              desc: "We analyze your profile against what LUMS values, identify exactly what is missing, and build those missing pieces before you apply.",
            },
          ].map((d, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow"
            >
              <div className="text-2xl mb-3">{d.icon}</div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#0f1b2d" }}
              >
                {d.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-4 py-6 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-1"
          style={{ color: "#0f1b2d" }}
        >
          Choose Your Path to LUMS
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "#64748b" }}>
          Transparent pricing. No hidden fees. Results that speak.
        </p>
        <div className="flex flex-col lg:flex-row gap-5 items-stretch">
          {/* Guided */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#e0f2fe" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#0f1b2d" }}>
                  Guided Support
                </h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#64748b" }}>
                We work alongside you to build an application that is
                authentically yours, with expert guidance shaping every section.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "#0f1b2d" }}
                >
                  Rs. 30,000
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                PKR
              </p>
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {guided.map((s, i) => (
                <div key={i} className={i > 0 ? "mt-4" : ""}>
                  <h4
                    className="text-sm font-bold mb-2"
                    style={{ color: "#0f1b2d" }}
                  >
                    {s.cat}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {s.items.map((it, j) => (
                      <div key={j} className="flex gap-2.5 items-start">
                        <CheckIcon />
                        <span
                          className="text-sm leading-snug"
                          style={{ color: "#475569" }}
                        >
                          {it}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-6 flex flex-col gap-2.5">
                <button
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: "#0f1b2d" }}
                  onClick={() => openReg("Guided Support")}
                >
                  Register Now
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm interested in the Guided Support package for LUMS.")}`,
                      "_blank",
                    )
                  }
                >
                  <WAIcon />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
          {/* Complete */}
          <div
            className="flex-1 rounded-2xl overflow-hidden flex flex-col relative bg-white"
            style={{ border: "2px solid #f59e0b" }}
          >
            <div
              className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
              style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
            >
              Most Popular
            </div>
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "#fef9c3" }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="#f59e0b"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold" style={{ color: "#0f1b2d" }}>
                  Complete Package
                </h3>
              </div>
              <p className="text-xs mb-4" style={{ color: "#64748b" }}>
                We handle everything, from writing your essays to putting you on
                the podium at competitions that LUMS actually cares about.
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: "#0f1b2d" }}
                >
                  Rs. 60,000
                </span>
              </div>
              <p className="text-xs mb-4" style={{ color: "#94a3b8" }}>
                PKR
              </p>
            </div>
            <div className="px-6 pb-6 flex-1 flex flex-col">
              {complete.map((s, i) => (
                <div key={i} className={i > 0 ? "mt-4" : ""}>
                  <h4
                    className="text-sm font-bold mb-2"
                    style={{ color: "#0f1b2d" }}
                  >
                    {s.cat}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {s.items.map((it, j) => (
                      <div key={j} className="flex gap-2.5 items-start">
                        <StarIcon />
                        <span
                          className="text-sm leading-snug"
                          style={{ color: "#475569" }}
                        >
                          {it}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="mt-auto pt-6 flex flex-col gap-2.5">
                <button
                  className="w-full py-3.5 rounded-xl font-semibold text-sm"
                  style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
                  onClick={() => openReg("Complete Package")}
                >
                  Register Now
                </button>
                <button
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WA}?text=${encodeURIComponent("Hi! I'm interested in the Complete Package for LUMS.")}`,
                      "_blank",
                    )
                  }
                >
                  <WAIcon />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white mt-6">
          <button
            onClick={() => setSchlOpen(!schlOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#ecfdf5" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#059669"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="8" r="7" />
                <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold" style={{ color: "#0f1b2d" }}>
                LUMS Scholarships, Financial Aid, and On Campus Opportunities
              </h4>
            </div>
            <ChevDown open={schlOpen} />
          </button>
          {schlOpen && (
            <div className="px-5 pb-5">
              <div
                className="p-3 rounded-xl mb-4 flex gap-3 items-start"
                style={{ backgroundColor: "#fefce8" }}
              >
                <span className="text-lg flex-shrink-0">🚀</span>
                <div>
                  <h5
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#92400e" }}
                  >
                    Extracurricular Edge
                  </h5>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#a16207" }}
                  >
                    Our EC developers build Math Olympiad preparation, Science
                    competition portfolios, MUN leadership, and hackathon
                    projects that directly strengthen your LUMS scholarship
                    application
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {scholarships.map((s, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start p-3 rounded-xl"
                    style={{ backgroundColor: "#f8fafc" }}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                      style={{ backgroundColor: "#059669" }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h5
                        className="text-sm font-semibold"
                        style={{ color: "#0f1b2d" }}
                      >
                        {s.name}
                      </h5>
                      <p
                        className="text-xs mt-0.5 leading-relaxed"
                        style={{ color: "#64748b" }}
                      >
                        {s.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p
                className="text-center text-xs font-semibold mt-4 py-2 rounded-lg"
                style={{ backgroundColor: "#f0fdf4", color: "#166534" }}
              >
                ✦ And many more scholarships and financial aid opportunities
                available. We match you with the ones that fit your profile
                best.
              </p>
            </div>
          )}
        </div>

        {/* Programs */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 bg-white mt-4">
          <button
            onClick={() => setProgOpen(!progOpen)}
            className="w-full flex items-center gap-3 px-5 py-4 text-left"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#e0f2fe" }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold" style={{ color: "#0f1b2d" }}>
                All LUMS Programs We Cover
              </h4>
            </div>
            <ChevDown open={progOpen} />
          </button>
          {progOpen && (
            <div className="px-5 pb-5 flex flex-col gap-3">
              {programs.map((p, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl"
                  style={{ backgroundColor: "#f8fafc" }}
                >
                  <h5
                    className="text-sm font-semibold"
                    style={{ color: "#0f1b2d" }}
                  >
                    {p.school}
                  </h5>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>
                    {p.progs}
                  </p>
                  {p.school.includes("Education") && (
                    <span
                      className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}
                    >
                      New: BS Educational Psychology
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust */}
      <section className="px-4 py-10 max-w-5xl mx-auto">
        <h2
          className="text-center text-xl font-bold mb-6"
          style={{ color: "#0f1b2d" }}
        >
          Why Families Trust SAT Sharks for LUMS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "💰",
              title: "Milestone Based Payments",
              desc: "Fees divided into milestones. Satisfied with the previous one? Pay for the next. If not, you stop. Zero risk.",
            },
            {
              icon: "🎯",
              title: "Honest Recommendation",
              desc: "We do not automatically push the Complete Package. If Guided Support is enough for your profile, that is what we recommend.",
            },
            {
              icon: "🏆",
              title: "Strategy, Not Just Admission",
              desc: "We do not chase any offer. We build strategy around the LUMS program where your profile competes most effectively.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="text-2xl mb-3">{t.icon}</div>
              <h3
                className="text-sm font-bold mb-2"
                style={{ color: "#0f1b2d" }}
              >
                {t.title}
              </h3>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#64748b" }}
              >
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-5 py-10 text-center"
        style={{ backgroundColor: "#0f1b2d" }}
      >
        <h3 className="text-white font-bold text-lg mb-2">
          98% of Our Students Got Into LUMS. You Could Be Next.
        </h3>
        <p
          className="text-xs leading-relaxed max-w-md mx-auto mb-6"
          style={{ color: "#94a3b8" }}
        >
          Everyone else polishes applications. We build applicants. From your
          Personal Statement to your competition trophies, we create the
          complete LUMS candidate. Don't take our word for it. Check our
          Instagram.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm"
            style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
            onClick={() => openReg("")}
          >
            Register Now
          </button>
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
            style={{ backgroundColor: "#25D366" }}
            onClick={() => window.open(`https://wa.me/${WA}`, "_blank")}
          >
            <WAIcon />
            Chat on WhatsApp
          </button>
        </div>
      </section>

      <footer className="px-5 py-6 text-center bg-white border-t border-gray-100">
        <p className="text-xs" style={{ color: "#94a3b8" }}>
          © 2026 SAT Sharks. All rights reserved.
        </p>
      </footer>

      {/* Modal */}
      {showReg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(15,27,45,0.7)",
            backdropFilter: "blur(4px)",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowReg(false);
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative max-h-screen overflow-y-auto">
            <div
              className="px-6 pt-6 pb-4"
              style={{ background: "linear-gradient(135deg,#0f1b2d,#1a2744)" }}
            >
              <button
                onClick={() => setShowReg(false)}
                className="absolute top-4 right-4 text-white opacity-60 hover:opacity-100"
              >
                <CloseIcon />
              </button>
              <span
                className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: "#f59e0b", color: "#0f1b2d" }}
              >
                {selTier || "LUMS Admissions"}
              </span>
              <h3 className="text-xl font-bold text-white">
                Register Your Interest
              </h3>
              <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                Fill in your details and our team will reach out within 24
                hours.
              </p>
            </div>
            {!done ? (
              <div className="px-6 py-6 flex flex-col gap-4">
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Full Name *
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    WhatsApp Number
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="03XX XXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    City *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                  >
                    {[
                      "",
                      "Lahore",
                      "Karachi",
                      "Islamabad",
                      "Rawalpindi",
                      "Peshawar",
                      "Faisalabad",
                      "Multan",
                      "Quetta",
                      "Other",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c || "Select city"}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#0f1b2d" }}
                  >
                    Target Program
                  </label>
                  <select
                    value={form.program}
                    onChange={(e) =>
                      setForm({ ...form, program: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none bg-white"
                  >
                    {[
                      "",
                      "BBA",
                      "BSc Computer Science",
                      "BSc Electrical Engineering",
                      "BSc Mathematics",
                      "BSc Physics",
                      "BSc Biology",
                      "BSc Chemistry",
                      "BSc Economics and Mathematics",
                      "BA Economics",
                      "BA Political Science",
                      "BA Sociology",
                      "BA Psychology",
                      "BA English",
                      "BA History",
                      "BA Comparative Literary and Cultural Studies",
                      "BA LLB (Hons)",
                      "BS Educational Psychology",
                      "MBA",
                      "MS",
                      "MPhil Education",
                      "PhD",
                      "Not sure yet",
                    ].map((p) => (
                      <option key={p} value={p}>
                        {p || "Select program"}
                      </option>
                    ))}
                  </select>
                </div>
                {selTier && (
                  <div
                    className="px-4 py-3 rounded-xl text-xs"
                    style={{ backgroundColor: "#f0f9ff", color: "#0369a1" }}
                  >
                    Selected: <strong>{selTier}</strong>
                  </div>
                )}
                <button
                  onClick={() => {
                    if (form.name && form.email && form.city) setDone(true);
                  }}
                  disabled={!form.name || !form.email || !form.city}
                  className="w-full py-3.5 rounded-xl text-white font-semibold text-sm mt-1 disabled:opacity-40"
                  style={{ backgroundColor: "#0f1b2d" }}
                >
                  Submit Registration
                </button>
              </div>
            ) : (
              <div className="px-6 py-10 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: "#d1fae5" }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#0f1b2d" }}
                >
                  You're Registered!
                </h3>
                <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                  Thanks {form.name}! Our team will reach out within 24 hours.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-sm"
                  style={{ backgroundColor: "#25D366" }}
                  onClick={() =>
                    window.open(
                      `https://wa.me/${WA}?text=${encodeURIComponent(`Hi! I just registered for LUMS counselling. My name is ${form.name} from ${form.city}.`)}`,
                      "_blank",
                    )
                  }
                >
                  <WAIcon />
                  Message Us Directly
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
