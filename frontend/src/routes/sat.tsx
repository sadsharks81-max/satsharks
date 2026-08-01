import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../hooks/useAuth";
import { Modal } from "../components/ui/Modal";
import { Icon } from "../components/common/Icon";
import { api, getBackendUrl } from "../services/api";
import {
  PORTAL_FEATURES,
  LUMS_SCHOLARSHIPS,
  LUMS_PROGRAMS,
  LUMS_FEATURES_GUIDED,
  LUMS_FEATURES_COMPLETE,
  ADMISSION_COUNTRIES_PK,
  ADMISSION_COUNTRIES_INTL,
  FeatureCategory,
  Scholarship,
  CountryData
} from "../utils/pricingData";

export const Route = createFileRoute("/sat")({
  validateSearch: (search: Record<string, unknown>): { tab?: "sat" | "admission" | "lums" } => {
    return {
      tab: (search.tab as "sat" | "admission" | "lums") || undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Elite SAT Prep & Admissions Counseling Pricing | SAT Sharks" },
      {
        name: "description",
        content: "Affordable, milestone-based pricing for SAT prep, LUMS admissions counseling, and global university admissions counseling.",
      },
    ],
    links: [{ rel: "canonical", href: "/sat" }],
  }),
  component: SATPrepPage,
});

function useRegion() {
  const [region, setRegion] = useState("loading");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isPK = tz === "Asia/Karachi";
      setRegion(isPK ? "pk" : "intl");
    } catch {
      setRegion("intl");
    }
  }, []);

  return region;
}

const PRICING = {
  pk: {
    portal: { amount: "Rs 15,000", period: "/ month", planName: "Portal Only" },
    group: { amount: "Rs 40,000", period: "/ full course", planName: "Group Sessions" },
    oneOnOne: { amount: "Rs 100,000", period: "/ month", planName: "1-on-1 Sessions" },
  },
  intl: {
    portal: { amount: "$70", period: "/ month", planName: "Portal Only" },
    group: { amount: "$300", period: "/ full course", planName: "Group Sessions" },
    oneOnOne: { amount: "$500", period: "/ month", planName: "1-on-1 Sessions" },
  },
};

const CheckIcon = ({ color = "#3B7DD8" }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill={color} opacity="0.12" />
    <path d="M6 10.5L8.5 13L14 7.5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FireIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#F5A623" opacity="0.12" />
    <path d="M10 3C10 3 6 7.5 6 11C6 13.2 7.8 15 10 15C12.2 15 14 13.2 14 11C14 7.5 10 3 10 3Z" fill="#F5A623" />
    <path d="M10 9C10 9 8.5 11 8.5 12.5C8.5 13.3 9.2 14 10 14C10.8 14 11.5 13.3 11.5 12.5C11.5 11 10 9 10 9Z" fill="#FFFFFF" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#F5A623" opacity="0.12" />
    <path d="M10 4L11.8 7.6L15.8 8.2L12.9 11L13.6 15L10 13.1L6.4 15L7.1 11L4.2 8.2L8.2 7.6L10 4Z" fill="#F5A623" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
    <path d="M8 21H16M12 17V21M6 3H18V7C18 10.31 15.31 13 12 13C8.69 13 6 10.31 6 7V3Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7H3V8C3 9.66 4.34 11 6 11V7Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 7H21V8C21 9.66 19.66 11 18 11V7Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const groupFeatures = [
  {
    heading: "Intensive Weekly Schedule",
    bullets: [
      "6 live online sessions every week, 3 English, 3 Math",
      "23 sessions per month with 7 dedicated practice tests",
      "Consistent structure that builds momentum week after week",
    ],
  },
  {
    heading: "Real SAT Practice, Not Random Questions",
    bullets: [
      "Weekly full-length tests using actual past SAT papers",
      "You practice under real conditions, no surprises on test day",
      "Detailed score analysis after every test to track your growth",
    ],
  },
  {
    heading: "Desmos, Shortcuts & Strategy",
    bullets: [
      "Dedicated time mastering Desmos, the graphing calculator allowed in SAT Math",
      "English shortcuts and tricks that save critical minutes per section",
      "Math strategies that turn hard problems into quick wins",
    ],
  },
  {
    heading: "Full Support, Nothing Extra to Buy",
    bullets: [
      "All study materials provided, books, past papers, question banks",
      "Your instructor's number is yours, ask questions anytime after class",
      "After your first month, you get a personal 1-on-1 session with your instructor",
    ],
  },
];

const oneOnOneFeatures = [
  {
    heading: "Your Own Dedicated Tutor",
    bullets: [
      "Every session is built around your specific strengths and weaknesses",
      "Diagnostic test on day one to build a custom study roadmap",
      "Flexible scheduling, sessions happen when they work for you",
    ],
  },
  {
    heading: "The Same Proven Curriculum, Personalized",
    bullets: [
      "Same 6-session weekly intensity, 3 English, 3 Math",
      "Full-length SAT past papers every week under timed conditions",
      "Individual score breakdowns with targeted action plans after each test",
    ],
  },
  {
    heading: "Deeper Desmos & Strategy Training",
    bullets: [
      "1-on-1 Desmos walkthroughs tailored to the question types you struggle with",
      "Personalized shortcut toolkit for both English and Math",
      "Advanced techniques for students targeting 1500+",
    ],
  },
  {
    heading: "Always-On Access & Materials",
    bullets: [
      "All books, past papers, and resources included, nothing extra to buy",
      "Direct WhatsApp access to your tutor, not a group chat, just you",
      "Continuous progress tracking and strategy adjustments between sessions",
    ],
  },
];

interface FeatureBlockProps {
  heading: string;
  bullets: string[];
  IconComp: React.ComponentType<any>;
}

function FeatureBlock({ heading, bullets, IconComp }: FeatureBlockProps) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="font-body font-bold text-[15px] text-on-surface tracking-tight mb-2">
        {heading}
      </h4>
      <div className="flex flex-col gap-2.5">
        {bullets.map((b: string, i: number) => (
          <div key={i} className="flex gap-2.5 items-start">
            <IconComp />
            <span className="text-on-surface-variant text-sm leading-relaxed">{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface PriceBadgeProps {
  amount: string;
  period: string;
  accent: string;
}

function PriceBadge({ amount, period, accent }: PriceBadgeProps) {
  const isGold = accent === "gold";
  const isBlue = accent === "blue";
  return (
    <div className={`inline-flex items-baseline gap-1 rounded-xl px-4 py-2 border ${
      isGold 
        ? "bg-accent/10 border-accent/25" 
        : isBlue 
          ? "bg-primary/10 border-primary/25"
          : "bg-secondary/10 border-secondary/25"
    }`}>
      <span className={`text-2xl font-extrabold font-mono tracking-tight ${
        isGold ? "text-[#D4911E]" : isBlue ? "text-primary" : "text-secondary"
      }`}>{amount}</span>
      <span className={`text-xs font-semibold ${
        isGold ? "text-[#B07A15]" : isBlue ? "text-primary/80" : "text-secondary/80"
      }`}>{period}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="inline-block w-40 h-[38px] rounded-xl bg-surface-container-high animate-pulse" />
  );
}

function SATPrepPage() {
  const { user } = useAuth();
  const region = useRegion();
  const { tab } = Route.useSearch();

  // Tab State
  const [pricingTab, setPricingTab] = useState<"sat" | "admission" | "lums">(
    tab === "admission" || tab === "lums" ? tab : "sat"
  );

  useEffect(() => {
    if (tab === "sat" || tab === "admission" || tab === "lums") {
      setPricingTab(tab);
    }
  }, [tab]);

  const [dbPricing, setDbPricing] = useState<any>(null);

  useEffect(() => {
    api.get("/api/homepage-stats")
      .then((res) => {
        if (res.success && res.stats) {
          setDbPricing(res.stats);
        }
      })
      .catch((err) => console.error("Error loading pricing:", err));
  }, []);

  const getSatPrice = (plan: "portal" | "group" | "oneOnOne") => {
    if (region === "pk") {
      if (plan === "portal") return dbPricing?.satPortalPk || "Rs 15,000";
      if (plan === "group") return dbPricing?.satGroupPk || "Rs 40,000";
      return dbPricing?.satOneOnOnePk || "Rs 100,000";
    } else {
      if (plan === "portal") return dbPricing?.satPortalIntl || "$70";
      if (plan === "group") return dbPricing?.satGroupIntl || "$300";
      return dbPricing?.satOneOnOneIntl || "$500";
    }
  };

  const getLumsPrice = (plan: "guided" | "complete") => {
    if (region === "pk") {
      return plan === "guided" ? (dbPricing?.lumsGuidedPk || "Rs. 30,000") : (dbPricing?.lumsCompletePk || "Rs. 60,000");
    } else {
      return plan === "guided" ? (dbPricing?.lumsGuidedIntl || "$300") : (dbPricing?.lumsCompleteIntl || "$550");
    }
  };

  const getAdmissionPrice = (country: any, type: "guided" | "complete") => {
    const isIntl = region === "intl";
    if (!dbPricing) return country[type === "guided" ? "t1" : "t2"];
    const key = `adm${type === "guided" ? "Guided" : "Complete"}${country.id.charAt(0).toUpperCase() + country.id.slice(1)}${isIntl ? "Intl" : "Pk"}`;
    return dbPricing[key] || country[type === "guided" ? "t1" : "t2"];
  };

  // Country Selection for Admissions
  const [selectedCountry, setSelectedCountry] = useState<string>("usa");

  // Accordion Open States
  const [scholarshipsOpen, setScholarshipsOpen] = useState(false);
  const [lumsScholarshipsOpen, setLumsScholarshipsOpen] = useState(false);
  const [lumsProgramsOpen, setLumsProgramsOpen] = useState(false);

  // Interest Modal States (Counseling)
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestDone, setInterestDone] = useState(false);
  const [interestTitle, setInterestTitle] = useState("");
  const [interestSubject, setInterestSubject] = useState<"lums" | "admission">("lums");
  const [interestForm, setInterestForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    target: "",
    package: ""
  });

  const openInterestModal = (subject: "lums" | "admission", packageName: string, price: string) => {
    setInterestSubject(subject);
    setInterestTitle(`${packageName} — ${price}`);
    setInterestForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      location: "",
      target: "",
      package: `${packageName} (${price})`
    });
    setInterestDone(false);
    setShowInterestModal(true);
  };

  const prices = region === "loading" ? null : PRICING[region as keyof typeof PRICING];

  // Counseling pricing configuration variables
  const waRecipient = "923164514334";
  const countriesData = region === "pk" ? ADMISSION_COUNTRIES_PK : ADMISSION_COUNTRIES_INTL;
  const c = countriesData.find((co) => co.id === selectedCountry) || countriesData[0];

  // Payment proof states
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; amount: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"bank" | "wallet" | "card">("bank");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleSelectPlan = (id: string, name: string, amount: string) => {
    setSelectedPlan({ id, name, amount });
    setUploadSuccess(false);
    setFile(null);
    setPreviewUrl(null);
    setUploadError("");
    setActiveTab("bank");
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !selectedPlan) {
      setUploadError("Please upload a payment proof screenshot.");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("screenshot", file);
    formData.append("planId", selectedPlan.id);
    formData.append("planName", selectedPlan.name);
    formData.append("amount", selectedPlan.amount);
    formData.append("paymentMethod", activeTab.toUpperCase());

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${getBackendUrl()}/api/payment/upload-proof`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUploadSuccess(true);
      } else {
        setUploadError(data.error || "Failed to upload payment proof.");
      }
    } catch (err) {
      setUploadError("Failed to submit proof. Server connection error.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="bg-surface-container-low min-h-screen font-body text-on-surface">
          {/* Hero */}
          <div className="bg-gradient-to-br from-[#0B1929] via-[#162D4D] to-[#1A3558] py-10 px-6 text-center">
            <div key={pricingTab} className="max-w-2xl mx-auto animate-in fade-in duration-500">
              {pricingTab === "sat" && (
                <>
                  <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                    <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">SAT Preparation</span>
                  </div>
                  <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight md:text-5xl">
                    Stop Guessing.<br />
                    <span className="text-[#5BA3F5]">Start Scoring.</span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    6 live sessions a week. Actual past papers every week. Desmos mastery. Shortcuts that save minutes. Everything you need, nothing you don't.
                  </p>
                </>
              )}
              {pricingTab === "admission" && (
                <>
                  <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                    <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">Admission Counseling</span>
                  </div>
                  <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight md:text-5xl">
                    Your Application Should<br />
                    <span className="text-[#5BA3F5]">Tell a Story Worth Reading</span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    Most students submit applications that blend in. We make sure yours stands out, with a narrative admissions committees actually remember.
                  </p>
                </>
              )}
              {pricingTab === "lums" && (
                <>
                  <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                    <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">LUMS Admissions Counselling</span>
                  </div>
                  <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight md:text-5xl">
                    LUMS Doesn't Pick<br />
                    <span className="text-[#5BA3F5]">The Loudest Applicant.</span>
                  </h1>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                    They pick the one with the clearest story. We help you find yours and write it in a way the admissions committee won't forget.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Stat strip / Track record strip */}
          {pricingTab === "lums" ? (
            <div className="bg-[#0F1B2D] border-b border-[#3B7DD8]/15">
              <div className="max-w-4xl mx-auto py-4 px-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <TrophyIcon />
                  <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">Our Students' Track Record</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "International Math Olympiad medalists",
                    "National Science competition winners",
                    "International debate & MUN champions",
                    "National level hackathon finalists",
                  ].map((w, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium text-slate-300 bg-[#3B7DD8]/8 border border-[#3B7DD8]/12 rounded-full px-3.5 py-1.5"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : pricingTab === "admission" ? (
            <div className="bg-[#0F1B2D] border-b border-[#3B7DD8]/15">
              <div className="max-w-2xl mx-auto flex justify-center gap-8 md:gap-16 py-4 px-6">
                {[
                  ["12+", "Global Destinations"],
                  ["1-on-1", "Expert Counseling"],
                  ["100%", "Milestone-Based Payments"],
                ].map(([num, label], i) => (
                  <div key={i} className="text-center">
                    <div className="font-body text-2xl md:text-3xl font-extrabold text-accent tracking-tight">{num}</div>
                    <div className="font-mono text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#0F1B2D] border-b border-[#3B7DD8]/15">
              <div className="max-w-2xl mx-auto flex justify-center gap-8 md:gap-16 py-4 px-6">
                {[
                  ["6", "Live Sessions / Week"],
                  ["23", "Sessions / Month"],
                  ["7", "Practice Tests / Month"],
                ].map(([num, label], i) => (
                  <div key={i} className="text-center">
                    <div className="font-body text-2xl md:text-3xl font-extrabold text-accent tracking-tight">{num}</div>
                    <div className="font-mono text-[10px] md:text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cards */}
          <div id="pricing" className="max-w-6xl mx-auto px-6">

            {/* Pricing Main Category Toggle & Switcher */}
            <div className="flex flex-wrap justify-center gap-3 mb-10 mt-8">
              {[
                { id: "sat", label: "SAT Prep & Mastery", icon: "menu_book" },
                { id: "admission", label: "Admission Counseling", icon: "account_balance" },
                { id: "lums", label: "LUMS Counseling", icon: "monitoring" }
              ].map((tab) => {
                const isActive = pricingTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setPricingTab(tab.id as any);
                    }}
                    className={`flex items-center gap-2 py-3 px-6 rounded-2xl cursor-pointer text-sm font-semibold border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                        : "bg-surface-container-lowest border-outline-variant/30 text-on-surface-variant hover:border-primary/50 hover:text-on-surface"
                    }`}
                  >
                    <Icon name={tab.icon} className="text-lg" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT: SAT PREP & MASTERY */}
            {pricingTab === "sat" && (
              <div className="animate-in fade-in duration-300">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-extrabold mb-2 text-on-surface">Choose Your Plan</h2>
                  <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                    From self study to fully personalized tutoring. Pick the style that fits your learning.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start pb-12">
                  {/* Portal Only */}
                  <div
                    className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-outline-variant/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                          <Icon name="computer" className="text-lg" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Portal Only</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4 pl-10">
                        Self study at your own pace with the most powerful SAT prep platform available.
                      </p>
                      <div className="pl-10 mb-4 flex flex-wrap items-center gap-3">
                        <PriceBadge amount={getSatPrice("portal")} period="/ month" accent="blue" />
                      </div>

                      <div className="border-t border-outline-variant/40 pt-4 mt-2">
                        {PORTAL_FEATURES.map((f, i) => (
                          <FeatureBlock key={i} heading={f.cat} bullets={f.items} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan("portal", "Portal Only", getSatPrice("portal"));
                        }}
                        className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow-sm transition-all"
                      >
                        Select Plan
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent("Hi! I'm interested in Portal Only access for SAT prep.")}`, "_blank");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Group Sessions */}
                  <div
                    className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-outline-variant/30 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
                          <Icon name="groups" className="text-lg" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Group Sessions</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4 pl-10">
                        Learn alongside peers in a structured, high-intensity program designed to push everyone forward.
                      </p>
                      <div className="pl-10 mb-4 flex flex-wrap items-center gap-3">
                        <PriceBadge amount={getSatPrice("group")} period="/ full course" accent="blue" />
                      </div>

                      <div className="border-t border-outline-variant/40 pt-4 mt-2">
                        {groupFeatures.map((f, i) => (
                          <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan("group", "Group Sessions", getSatPrice("group"));
                        }}
                        className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow-sm transition-all"
                      >
                        Select Plan
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent("Hi! I'm interested in SAT Group Sessions.")}`, "_blank");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* One on One */}
                  <div
                    className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-outline-variant/30 hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between relative overflow-visible"
                  >
                    <div className="absolute -top-3 right-6 bg-accent text-primary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                      Maximum Results
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent">
                          <Icon name="person" className="text-lg" />
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">1-on-1 Sessions</h3>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed mb-4 pl-10">
                        Every session is built around you, your weaknesses, your pace, your target score.
                      </p>
                      <div className="pl-10 mb-4 flex flex-wrap items-center gap-3">
                        <PriceBadge amount={getSatPrice("oneOnOne")} period="/ month" accent="gold" />
                      </div>

                      <div className="border-t border-outline-variant/40 pt-4 mt-2">
                        {oneOnOneFeatures.map((f, i) => (
                          <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={FireIcon} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlan("oneOnOne", "1-on-1 Sessions", getSatPrice("oneOnOne"));
                        }}
                        className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/95 text-primary font-bold text-xs shadow-sm transition-all"
                      >
                        Select Plan
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent("Hi! I'm interested in SAT One on One Sessions.")}`, "_blank");
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center py-10">
                  <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Not sure which format is right for you? We'll help you decide, no pressure.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENT: ADMISSION COUNSELING */}
            {pricingTab === "admission" && (
              <div className="animate-in fade-in duration-300 space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold mb-2 text-on-surface">Where Do You Want to Study?</h2>
                  <p className="text-sm text-on-surface-variant max-w-lg mx-auto">
                    Select a destination to see pricing, services, and scholarships.
                  </p>
                </div>

                {/* Country Grid Selector */}
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6">
                  {countriesData.map((co) => {
                    const isSelected = selectedCountry === co.id;
                    return (
                      <button
                        key={co.id}
                        onClick={() => setSelectedCountry(co.id)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-accent bg-accent/5 scale-105 shadow-[0_0_12px_rgba(245,166,35,0.15)]"
                            : "border-outline-variant/30 bg-surface-container-lowest hover:border-accent/40"
                        }`}
                      >
                        <span className="text-2xl">{co.flag}</span>
                        <span className="text-xs font-bold text-center leading-tight text-on-surface">
                          {co.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Country Details */}
                {c && (
                  <div className="space-y-6 pt-4 animate-in fade-in duration-300">
                    <div className="text-center py-4">
                      <span className="text-4xl mb-2 block">{c.flag}</span>
                      <h3 className="text-2xl font-extrabold text-on-surface">{c.name} Admissions</h3>
                      <p className="text-sm text-on-surface-variant mt-1 max-w-lg mx-auto leading-relaxed">
                        {c.tagline}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                      {/* Guided Support Card */}
                      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-500">
                              <Icon name="menu_book" className="text-lg" />
                            </div>
                            <h4 className="text-lg font-bold text-on-surface">Guided Support</h4>
                          </div>
                          <p className="text-xs text-on-surface-variant mb-4 pl-10">
                            We guide, you write, with expert eyes on every draft.
                          </p>
                          <div className="pl-10 mb-6">
                            <div className="text-2xl font-extrabold text-primary font-mono">{c.t1l ? `Rs. ${getAdmissionPrice(c, "guided")}` : getAdmissionPrice(c, "guided")}</div>
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                              {c.t1l ? `${c.t1l} PKR` : "USD"}
                            </span>
                          </div>
                          <div className="border-t border-outline-variant/30 pt-4">
                            {c.guided.map((g, idx) => (
                              <FeatureBlock key={idx} heading={g.cat} bullets={g.items} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                          <button
                            onClick={() => handleSelectPlan("admission_guided_" + c.id, `Guided Support (${c.name})`, (c.t1l ? "Rs. " : "") + getAdmissionPrice(c, "guided"))}
                            className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow-sm transition-all"
                          >
                            Select Plan
                          </button>
                          <button
                            onClick={() => window.open("https://www.instagram.com/sat_sharks", "_blank")}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-[#E1306C] hover:bg-[#C13584] transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            Instagram
                          </button>
                        </div>
                      </div>

                      {/* Complete Package Card */}
                      <div className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-accent flex flex-col justify-between relative overflow-visible hover:shadow-md transition-all">
                        <div className="absolute -top-3 right-6 bg-accent text-primary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                          Most Popular
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent">
                              <Icon name="star" className="text-lg" />
                            </div>
                            <h4 className="text-lg font-bold text-on-surface">Complete Package</h4>
                          </div>
                          <p className="text-xs text-on-surface-variant mb-4 pl-10">
                            We handle everything. You just show up and get accepted.
                          </p>
                          <div className="pl-10 mb-6">
                            <div className="text-2xl font-extrabold text-accent font-mono">{c.t2l ? `Rs. ${getAdmissionPrice(c, "complete")}` : getAdmissionPrice(c, "complete")}</div>
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                              {c.t2l ? `${c.t2l} PKR` : "USD"}
                            </span>
                          </div>
                          <div className="border-t border-outline-variant/30 pt-4">
                            {c.complete.map((comp, idx) => (
                              <FeatureBlock key={idx} heading={comp.cat} bullets={comp.items} IconComp={StarIcon} />
                            ))}
                          </div>
                        </div>

                        <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                          <button
                            onClick={() => handleSelectPlan("admission_complete_" + c.id, `Complete Package (${c.name})`, (c.t2l ? "Rs. " : "") + getAdmissionPrice(c, "complete"))}
                            className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/95 text-primary font-bold text-xs shadow-sm transition-all"
                          >
                            Select Plan
                          </button>
                          <button
                            onClick={() => window.open("https://www.instagram.com/sat_sharks", "_blank")}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-[#E1306C] hover:bg-[#C13584] transition-colors"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                            Instagram
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Scholarships Accordion */}
                    <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest mt-8">
                      <button
                        onClick={() => setScholarshipsOpen(!scholarshipsOpen)}
                        className="w-full flex items-center justify-between p-5 text-left cursor-pointer outline-none border-none bg-transparent"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                            <Icon name="card_membership" className="text-xl" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-on-surface">Scholarships & Profile Strategy</h4>
                            <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Explore support and extracurricular edge guidelines</p>
                          </div>
                        </div>
                        <Icon name="expand_more" className={`transition-transform duration-300 text-on-surface-variant ${scholarshipsOpen ? "rotate-180" : ""}`} />
                      </button>
                      
                      {scholarshipsOpen && (
                        <div className="px-5 pb-5 border-t border-outline-variant/20 pt-4 animate-in fade-in duration-300">
                          {/* EC Edge Highlight Banner */}
                          <div className="p-4 rounded-xl mb-4 bg-amber-500/10 border border-amber-500/25 flex gap-3 items-start">
                            <span className="text-lg">🚀</span>
                            <div>
                              <h5 className="text-xs font-bold text-amber-700 mb-0.5">Extracurricular Edge</h5>
                              <p className="text-xs text-amber-800 leading-relaxed">{c.ecHighlight}</p>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {c.scholarships.map((s, idx) => (
                              <div key={idx} className="flex gap-3 items-start p-3 bg-surface-container rounded-xl">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white bg-emerald-600">
                                  {idx + 1}
                                </div>
                                <div>
                                  <h5 className="text-sm font-bold text-on-surface">{s.name}</h5>
                                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.detail}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <p className="text-center text-xs font-bold mt-4 py-2 bg-emerald-500/10 text-emerald-700 rounded-lg">
                            ✦ We match you with the scholarships that fit your specific profile best.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Why Families Trust Us */}
                    <div className="pt-8">
                      <h4 className="text-center text-lg font-bold mb-6 text-on-surface">Why Families Trust SAT Sharks</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { icon: "payments", title: "Milestone Based Payments", desc: "You do not pay everything upfront. Fees are divided into milestones. If you are satisfied with the previous milestone, only then do you pay for the next. If not, you stop. Zero risk." },
                          { icon: "verified_user", title: "Honest Tier Recommendation", desc: "We do not automatically push the Complete Package. We first assess your profile, scholarship needs, and the level of support you genuinely require. If Guided Support is enough, that is what we recommend." },
                          { icon: "ads_click", title: "Strategy, Not Just Admission", desc: "Our goal is not simply to secure any admission offer. We build a focused strategy around universities and scholarships where your profile can compete most effectively." }
                        ].map((t, idx) => (
                          <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
                            <div className="text-primary text-2xl mb-3">
                              <Icon name={t.icon} />
                            </div>
                            <h5 className="text-sm font-bold mb-2 text-on-surface">{t.title}</h5>
                            <p className="text-xs text-on-surface-variant leading-relaxed">{t.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {pricingTab === "lums" && (
              <div className="animate-in fade-in duration-300 space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                  {/* Guided Support Card */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-all">
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-100 text-blue-500">
                          <Icon name="school" className="text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-on-surface">Guided Support</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-4 pl-10">
                        We work alongside you to build an application that's authentically yours.
                      </p>
                      <div className="pl-10 mb-6">
                        <div className="text-2xl font-extrabold text-primary font-mono">{getLumsPrice("guided")}</div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                          {region === "pk" ? "PKR" : "USD"}
                        </span>
                      </div>
                      <div className="border-t border-outline-variant/30 pt-4">
                        {LUMS_FEATURES_GUIDED.map((g, idx) => (
                          <FeatureBlock key={idx} heading={g.cat} bullets={g.items} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={() => handleSelectPlan("lums_guided", "LUMS Guided Support", getLumsPrice("guided"))}
                        className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-primary/95 text-xs font-bold shadow-sm transition-all"
                      >
                        Select Plan
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent("Hi! I'm interested in LUMS Guided Support counselling.")}`, "_blank")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                            WhatsApp
                          </button>
                        </div>
                      </div>

                  {/* Complete Package Card */}
                  <div className="bg-surface-container-lowest rounded-2xl p-6 border-2 border-[#F5A623] flex flex-col justify-between relative overflow-visible hover:shadow-md transition-all">
                    <div className="absolute -top-3 right-6 bg-[#F5A623] text-primary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                      Most Popular
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent/10 text-accent">
                          <Icon name="military_tech" className="text-lg" />
                        </div>
                        <h4 className="text-lg font-bold text-on-surface">Complete Package</h4>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-4 pl-10">
                        We handle everything, from essays to competitions LUMS cares about.
                      </p>
                      <div className="pl-10 mb-6">
                        <div className="text-2xl font-extrabold text-accent font-mono">{getLumsPrice("complete")}</div>
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                          {region === "pk" ? "PKR" : "USD"}
                        </span>
                      </div>
                      <div className="border-t border-outline-variant/30 pt-4">
                        {LUMS_FEATURES_COMPLETE.map((comp, idx) => (
                          <FeatureBlock key={idx} heading={comp.cat} bullets={comp.items} IconComp={StarIcon} />
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 flex flex-col sm:flex-row gap-2.5">
                      <button
                        onClick={() => handleSelectPlan("lums_complete", "LUMS Complete Package", getLumsPrice("complete"))}
                        className="flex-1 py-3 rounded-xl bg-accent hover:bg-accent/95 text-primary font-bold text-xs shadow-sm transition-all"
                      >
                        Select Plan
                      </button>
                      <button
                        onClick={() => window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent("Hi! I'm interested in LUMS Complete Package counselling.")}`, "_blank")}
                        className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-white font-bold text-xs bg-emerald-500 hover:bg-emerald-600 transition-colors"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* LUMS Scholarships Accordion */}
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest mt-6">
                  <button
                    onClick={() => setLumsScholarshipsOpen(!lumsScholarshipsOpen)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer outline-none border-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                        <Icon name="card_membership" className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">LUMS Scholarships, Financial Aid & Campus Opportunities</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Explore financial aid structures and NOP options</p>
                      </div>
                    </div>
                    <Icon name="expand_more" className={`transition-transform duration-300 text-on-surface-variant ${lumsScholarshipsOpen ? "rotate-180" : ""}`} />
                  </button>

                  {lumsScholarshipsOpen && (
                    <div className="px-5 pb-5 border-t border-outline-variant/20 pt-4 animate-in fade-in duration-300">
                      <div className="p-4 rounded-xl mb-4 bg-amber-500/10 border border-amber-500/25 flex gap-3 items-start">
                        <span className="text-lg">🚀</span>
                        <div>
                          <h5 className="text-xs font-bold text-amber-700 mb-0.5">Extracurricular Edge</h5>
                          <p className="text-xs text-amber-800 leading-relaxed">
                            Our EC developers build Model UN portfolios, Math Olympiad prep, and hackathon projects that directly strengthen your LUMS scholarship application.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {LUMS_SCHOLARSHIPS.map((s, idx) => (
                          <div key={idx} className="flex gap-3 items-start p-3 bg-surface-container rounded-xl">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white bg-emerald-600">
                              {idx + 1}
                            </div>
                            <div>
                              <h5 className="text-sm font-bold text-on-surface">{s.name}</h5>
                              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* LUMS Programs Accordion */}
                <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest mt-4">
                  <button
                    onClick={() => setLumsProgramsOpen(!lumsProgramsOpen)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer outline-none border-none bg-transparent"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                        <Icon name="library_books" className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-on-surface">All LUMS Programs We Cover</h4>
                        <p className="text-xs text-on-surface-variant mt-0.5 font-medium">Verify schools and degrees we guide you on</p>
                      </div>
                    </div>
                    <Icon name="expand_more" className={`transition-transform duration-300 text-on-surface-variant ${lumsProgramsOpen ? "rotate-180" : ""}`} />
                  </button>

                  {lumsProgramsOpen && (
                    <div className="px-5 pb-5 border-t border-outline-variant/20 pt-4 animate-in fade-in duration-300">
                      <div className="space-y-3">
                        {LUMS_PROGRAMS.map((p, idx) => (
                          <div key={idx} className="p-3 bg-surface-container rounded-xl">
                            <h5 className="text-sm font-bold text-on-surface">{p.school}</h5>
                            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{p.progs}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Why Families Trust Us for LUMS */}
                <div className="pt-8">
                  <h4 className="text-center text-lg font-bold mb-6 text-on-surface">Why Families Trust SAT Sharks for LUMS</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: "payments", title: "Milestone Based Payments", desc: "Fees divided into milestones. Satisfied with the previous one? Pay for the next. If not, you stop. Zero risk." },
                      { icon: "verified_user", title: "Honest Recommendation", desc: "We do not automatically push the Complete Package. If Guided Support is enough for your profile, that is what we recommend." },
                      { icon: "ads_click", title: "Strategy, Not Just Admission", desc: "We do not chase any offer. We build strategy around the LUMS program where your profile competes most effectively." }
                    ].map((t, idx) => (
                      <div key={idx} className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm">
                        <div className="text-primary text-2xl mb-3">
                          <Icon name={t.icon} />
                        </div>
                        <h5 className="text-sm font-bold mb-2 text-on-surface">{t.title}</h5>
                        <p className="text-xs text-on-surface-variant leading-relaxed">{t.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Contact form block */}
        </div>
      </main>
      <Footer />

      {/* Dynamic Interest Registration Modal (Counseling) */}
      <Modal
        open={showInterestModal}
        onClose={() => setShowInterestModal(false)}
        title={`Register Interest: ${interestTitle}`}
        icon="contact_page"
        maxWidth="max-w-md"
      >
        {!interestDone ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const isLums = interestSubject === "lums";
              let text = "";
              if (isLums) {
                text = `Hi! I just registered for LUMS counselling. My name is ${interestForm.name} from ${interestForm.location}.\nWhatsApp: ${interestForm.phone}\nEmail: ${interestForm.email}\nTarget Program: ${interestForm.target}\nSelected: ${interestForm.package}`;
              } else {
                const countryName = countriesData.find((co) => co.id === selectedCountry)?.name;
                text = `Hi! I just registered for Admissions Counselling. My name is ${interestForm.name} from ${interestForm.location}.\nWhatsApp: ${interestForm.phone}\nEmail: ${interestForm.email}\nTarget Year: ${interestForm.target}\nCountry of Interest: ${countryName}\nSelected: ${interestForm.package}`;
              }
              setInterestDone(true);
              window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent(text)}`, "_blank");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface-variant">Full Name *</label>
              <input
                required
                value={interestForm.name}
                onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-accent text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface-variant">Email Address *</label>
              <input
                required
                type="email"
                value={interestForm.email}
                onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                placeholder="you@email.com"
                className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-accent text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface-variant">WhatsApp Number</label>
              <input
                value={interestForm.phone}
                onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                placeholder="e.g. 03XX XXXXXXX"
                className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface placeholder-on-surface-variant/50 outline-none focus:border-accent text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface-variant">
                {region === "pk" ? "City *" : "Country *"}
              </label>
              {region === "pk" ? (
                <select
                  required
                  value={interestForm.location}
                  onChange={(e) => setInterestForm({ ...interestForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface outline-none focus:border-accent text-sm transition-all bg-white"
                >
                  <option value="">Select city</option>
                  {["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Peshawar", "Faisalabad", "Multan", "Quetta", "Other"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  required
                  value={interestForm.location}
                  onChange={(e) => setInterestForm({ ...interestForm, location: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface outline-none focus:border-accent text-sm transition-all bg-white"
                >
                  <option value="">Select country</option>
                  {["UAE", "Saudi Arabia", "Qatar", "Bahrain", "Kuwait", "Oman", "United Kingdom", "United States", "Canada", "Turkey", "Afghanistan", "Other"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-on-surface-variant">
                {interestSubject === "lums" ? "Target Program" : "Target Year"}
              </label>
              {interestSubject === "lums" ? (
                <select
                  value={interestForm.target}
                  onChange={(e) => setInterestForm({ ...interestForm, target: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface outline-none focus:border-accent text-sm transition-all bg-white"
                >
                  <option value="">Select program</option>
                  {[
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
                    "Not sure yet"
                  ].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={interestForm.target}
                  onChange={(e) => setInterestForm({ ...interestForm, target: e.target.value })}
                  className="w-full px-4 py-2.5 bg-surface-container rounded-xl border border-outline-variant/50 text-on-surface outline-none focus:border-accent text-sm transition-all bg-white"
                >
                  <option value="">Select year</option>
                  {["Fall 2026", "Fall 2027", "Fall 2028", "Not sure yet"].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setShowInterestModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent text-xs font-bold transition-all cursor-pointer shadow-sm text-center"
              >
                Submit & Message
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Icon name="check_circle" className="text-4xl" />
            </div>
            <h3 className="text-lg font-bold mb-2">Registration Saved!</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              Thanks {interestForm.name}! We have redirected you to WhatsApp so you can send your details directly.
            </p>
            <button
              type="button"
              onClick={() => {
                const isLums = interestSubject === "lums";
                let text = "";
                if (isLums) {
                  text = `Hi! I just registered for LUMS counselling. My name is ${interestForm.name} from ${interestForm.location}.\nWhatsApp: ${interestForm.phone}\nEmail: ${interestForm.email}\nTarget Program: ${interestForm.target}\nSelected: ${interestForm.package}`;
                } else {
                  const countryName = countriesData.find((co) => co.id === selectedCountry)?.name;
                  text = `Hi! I just registered for Admissions Counselling. My name is ${interestForm.name} from ${interestForm.location}.\nWhatsApp: ${interestForm.phone}\nEmail: ${interestForm.email}\nTarget Year: ${interestForm.target}\nCountry of Interest: ${countryName}\nSelected: ${interestForm.package}`;
                }
                window.open(`https://wa.me/${waRecipient}?text=${encodeURIComponent(text)}`, "_blank");
              }}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 mb-3 bg-[#25D366]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Message on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setShowInterestModal(false)}
              className="w-full py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Close Window
            </button>
          </div>
        )}
      </Modal>

      {/* Checkout Payment Modal */}
      <Modal
        open={selectedPlan !== null}
        onClose={() => setSelectedPlan(null)}
        title={`Subscribe to ${selectedPlan?.name || ""}`}
        icon="payments"
        maxWidth="max-w-xl"
      >
        {!user ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="lock" className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold mb-2">Account Required</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-sm mx-auto">
              Please sign in or create an account to purchase a prep course and activate your paid student features.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <Link
                to="/auth/login"
                search={{ redirect: "/sat" }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent text-sm font-semibold text-center transition-colors cursor-pointer"
              >
                Login / Register
              </Link>
            </div>
          </div>
        ) : user.role === "ADMIN" ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="admin_panel_settings" className="text-3xl" />
            </div>
            <h3 className="text-lg font-bold mb-2">Admin Account Detected</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              You are logged in as an Administrator. Admins already have access to all areas and cannot purchase plans or upload payment proofs.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent text-sm font-semibold text-center transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : uploadSuccess ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Icon name="check_circle" className="text-4xl animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">Proof Uploaded Successfully!</h3>
            <p className="text-on-surface-variant text-sm mb-6 max-w-md mx-auto leading-relaxed">
              Your transaction receipt has been submitted. Our administrators will verify the transfer details and upgrade your account to <strong>PAID</strong> shortly.
            </p>
            <div className="p-4 bg-surface-container-low border border-outline-variant/30 rounded-xl mb-6 text-left">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary mb-1">Tips for Faster Approval</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Your proof is already in the review queue. If you need help, use the WhatsApp icon at the bottom right.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-full py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/35 flex justify-between items-center">
              <div>
                <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider block">Course Plan</span>
                <span className="font-bold text-lg text-on-surface">{selectedPlan?.name}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-on-surface-variant font-mono uppercase tracking-wider block">Total Price</span>
                <span className="font-mono font-extrabold text-lg text-primary">{selectedPlan?.amount}</span>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 bg-error/15 text-error rounded-xl text-sm border border-error/25 flex items-center gap-2">
                <Icon name="error" className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-outline-variant/40">
              <button
                type="button"
                onClick={() => { setActiveTab("bank"); setUploadError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "bank"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("wallet"); setUploadError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "wallet"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Mobile Wallet
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("card"); setUploadError(""); }}
                className={`flex-1 pb-3 text-sm font-semibold transition-all border-b-2 cursor-pointer ${
                  activeTab === "card"
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Credit/Debit Card
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-2">
              {activeTab === "bank" && (
                <div className="space-y-3">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Transfer the plan amount to our bank account and upload a screenshot of the confirmation receipt below.
                  </p>
                  <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Bank Name:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        MEEZAN BANK
                        <button
                          type="button"
                          onClick={() => handleCopy("MEEZAN BANK", "bank")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "bank" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Account Title:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        HAFIZ MUHAMMAD TAYYAB
                        <button
                          type="button"
                          onClick={() => handleCopy("HAFIZ MUHAMMAD TAYYAB", "title")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "title" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Account Number:</span>
                      <span className="font-mono font-semibold text-on-surface flex items-center">
                        00300112919975
                        <button
                          type="button"
                          onClick={() => handleCopy("00300112919975", "acc")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "acc" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant text-xs">IBAN Number:</span>
                      <span className="font-mono font-semibold text-on-surface flex items-center">
                        PK09MEZN0000300112919975
                        <button
                          type="button"
                          onClick={() => handleCopy("PK09MEZN0000300112919975", "iban")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "iban" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "wallet" && (
                <div className="space-y-3">
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Transfer the plan amount to our JazzCash account and upload the receipt screenshot below.
                  </p>
                  <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Mobile Wallet:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        JazzCash
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Account Title:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        SAT Sharks
                        <button
                          type="button"
                          onClick={() => handleCopy("SAT Sharks", "walletTitle")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "walletTitle" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-on-surface-variant text-xs">Mobile Number:</span>
                      <span className="font-mono font-semibold text-on-surface flex items-center">
                        0316 451 4334
                        <button
                          type="button"
                          onClick={() => handleCopy("03164514334", "walletNum")}
                          className="ml-2 text-primary hover:text-accent p-0.5 cursor-pointer"
                        >
                          <Icon name="content_copy" className="text-sm" />
                        </button>
                        {copiedText === "walletNum" && <span className="text-[10px] text-success ml-1">Copied</span>}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "card" && (
                <div className="space-y-4 py-4 text-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                    <Icon name="construction" className="text-base" />
                    Payment option under development
                  </span>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="credit_card" className="text-2xl" />
                  </div>
                  <h4 className="font-bold text-sm">Card Payment Coming Soon</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                    Online card payments are not fully available yet. Please use Bank Transfer or Mobile Wallet for now.
                  </p>
                  <button
                    type="button"
                    disabled
                    className="w-full max-w-xs py-3 rounded-xl bg-primary text-on-primary font-bold text-sm opacity-50 cursor-not-allowed shadow-sm mx-auto"
                  >
                    Card Payment Unavailable
                  </button>
                </div>
              )}
            </div>

            {/* Receipt Image upload block (for Bank and Wallet) */}
            {(activeTab === "bank" || activeTab === "wallet") && (
              <form onSubmit={handleSubmitProof} className="space-y-4">
                <div>
                  <label className="mb-1.5 block font-mono text-[11px] uppercase tracking-[0.08em] text-on-surface-variant font-bold">
                    Upload Payment Proof Screenshot
                  </label>
                  <div className="border-2 border-dashed border-outline-variant/60 rounded-xl p-4 text-center hover:border-primary/40 transition-colors relative">
                    {previewUrl ? (
                      <div className="space-y-2">
                        <img
                          src={previewUrl}
                          alt="Payment Receipt Preview"
                          className="max-h-36 mx-auto rounded-lg object-contain border border-outline-variant/20"
                        />
                        <p className="text-xs text-on-surface-variant truncate font-semibold">
                          {file?.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => { setFile(null); setPreviewUrl(null); }}
                          className="text-xs text-error hover:underline cursor-pointer"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="py-2">
                        <Icon name="cloud_upload" className="text-3xl text-on-surface-variant/40 mb-1" />
                        <p className="text-xs text-on-surface-variant mb-1">
                          Click to select or drag & drop receipt image
                        </p>
                        <p className="text-[10px] text-on-surface-variant/60">
                          PNG, JPG, JPEG, WEBP up to 10MB
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(null)}
                    className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !file}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm text-center"
                  >
                    {isUploading ? "Uploading Proof..." : "Submit Payment Proof"}
                  </button>
                </div>

                <p className="pt-2 text-center text-xs text-on-surface-variant/70">
                  Need help? Use the WhatsApp icon at the bottom right.
                </p>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
