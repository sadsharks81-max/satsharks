import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../hooks/useAuth";
import { Modal } from "../components/ui/Modal";
import { Icon } from "../components/common/Icon";
import { ContactForm } from "../components/common/ContactForm";
import { getBackendUrl } from "../services/api";

export const Route = createFileRoute("/sat")({
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
    group: { amount: "Rs 40,000", period: "/ full course" },
    oneOnOne: { amount: "Rs 100,000", period: "/ month" },
  },
  intl: {
    group: { amount: "$400", period: "/ full course" },
    oneOnOne: { amount: "$800", period: "/ month" },
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

const groupFeatures = [
  {
    heading: "Intensive Weekly Schedule",
    bullets: [
      "6 live online sessions every week — 3 English, 3 Math",
      "23 sessions per month with 7 dedicated practice tests",
      "Consistent structure that builds momentum week after week",
    ],
  },
  {
    heading: "Real SAT Practice, Not Random Questions",
    bullets: [
      "Weekly full-length tests using actual past SAT papers",
      "You practice under real conditions — no surprises on test day",
      "Detailed score analysis after every test to track your growth",
    ],
  },
  {
    heading: "Desmos, Shortcuts & Strategy",
    bullets: [
      "Dedicated time mastering Desmos — the graphing calculator allowed in SAT Math",
      "English shortcuts and tricks that save critical minutes per section",
      "Math strategies that turn hard problems into quick wins",
    ],
  },
  {
    heading: "Full Support, Nothing Extra to Buy",
    bullets: [
      "All study materials provided — books, past papers, question banks",
      "Your instructor's number is yours — ask questions anytime after class",
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
      "Flexible scheduling — sessions happen when they work for you",
    ],
  },
  {
    heading: "The Same Proven Curriculum, Personalized",
    bullets: [
      "Same 6-session weekly intensity — 3 English, 3 Math",
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
      "All books, past papers, and resources included — nothing extra to buy",
      "Direct WhatsApp access to your tutor — not a group chat, just you",
      "Continuous progress tracking and strategy adjustments between sessions",
    ],
  },
];

interface FeatureBlockProps {
  heading: string;
  bullets: string[];
  IconComp: React.ComponentType;
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
  return (
    <div className={`inline-flex items-baseline gap-1 rounded-xl px-4 py-2 border ${
      isGold ? "bg-accent/10 border-accent/25" : "bg-secondary/10 border-secondary/25"
    }`}>
      <span className={`text-2xl font-extrabold font-mono tracking-tight ${
        isGold ? "text-[#D4911E]" : "text-secondary"
      }`}>{amount}</span>
      <span className={`text-xs font-semibold ${
        isGold ? "text-[#B07A15]" : "text-secondary/80"
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
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);

  const prices = region === "loading" ? null : PRICING[region as keyof typeof PRICING];

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

  const handleCardPayment = async () => {
    if (!selectedPlan) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${getBackendUrl()}/api/payment/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          planId: selectedPlan.id,
          region: region === "pk" ? "LOCAL" : "INTERNATIONAL",
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setUploadError(data.error || "Failed to create checkout session.");
      }
    } catch (err) {
      setUploadError("Failed to initiate card payment. Server connection error.");
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
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-accent/15 border border-accent/30 rounded-full px-4 py-1.5 mb-6">
                <span className="font-mono text-xs font-bold text-accent tracking-widest uppercase">SAT Preparation</span>
              </div>
              <h1 className="font-display text-4xl font-extrabold text-white leading-tight mb-4 tracking-tight md:text-5xl">
                Stop Guessing.<br />
                <span className="text-[#5BA3F5]">Start Scoring.</span>
              </h1>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
                6 live sessions a week. Actual past papers every week. Desmos mastery. Shortcuts that save minutes. Everything you need — nothing you don't.
              </p>
            </div>
          </div>

          {/* Stat strip */}
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

          {/* Cards */}
          <div id="pricing" className="max-w-[880px] mx-auto px-6">

            {/* Tier Toggle */}
            <div className="flex justify-center gap-1 mt-8 mx-auto bg-surface-container-lowest rounded-2xl p-1.5 shadow-sm border border-outline-variant/40 max-w-sm">
              {["Group", "1-on-1"].map((label, i) => {
                const isActive = activeTier === i;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveTier(isActive ? null : i)}
                    className={`flex-1 py-3 px-4 rounded-xl border-none cursor-pointer text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? (i === 0 ? "bg-primary text-white shadow-sm" : "bg-[#F5A623] text-white shadow-sm") 
                        : "bg-transparent text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {label} Sessions
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pb-12">

              {/* Group Card */}
              <div
                onMouseEnter={() => setHoveredTier(0)}
                onMouseLeave={() => setHoveredTier(null)}
                onClick={() => setActiveTier(activeTier === 0 ? null : 0)}
                className={`bg-surface-container-lowest rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  activeTier === 0 ? "border-primary" : "border-outline-variant/30 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" className="text-primary" />
                      <path d="M23 21V19C23 17.14 21.73 15.57 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
                      <circle cx="19" cy="7" r="3" stroke="currentColor" strokeWidth="2" className="text-primary" />
                    </svg>
                  </div>
                  <h3 className="font-body font-bold text-xl text-on-surface">Group Sessions</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 pl-12">
                  Learn alongside peers in a structured, high-intensity program designed to push everyone forward.
                </p>
                <div className="pl-12 mb-6 flex flex-wrap items-center gap-3">
                  {prices ? (
                    <PriceBadge amount={prices.group.amount} period={prices.group.period} accent="blue" />
                  ) : (
                    <LoadingSkeleton />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan("group", "Group Sessions", prices?.group.amount || "Rs 40,000");
                    }}
                    className="py-2 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs transition-all shadow-sm cursor-pointer border border-transparent whitespace-nowrap"
                  >
                    Select Plan
                  </button>
                </div>

                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTier === 0 ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-outline-variant/40 pt-5 mt-2">
                    {groupFeatures.map((f, i) => (
                      <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-bold text-primary">
                  {activeTier === 0 ? "Tap to collapse" : "See full course details"}
                  <span className={`transition-transform duration-300 inline-flex ${activeTier === 0 ? "rotate-180" : "rotate-0"}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary" /></svg>
                  </span>
                </div>
              </div>

              {/* 1-on-1 Card */}
              <div
                onMouseEnter={() => setHoveredTier(1)}
                onMouseLeave={() => setHoveredTier(null)}
                onClick={() => setActiveTier(activeTier === 1 ? null : 1)}
                className={`bg-surface-container-lowest rounded-2xl p-8 cursor-pointer transition-all duration-300 border-2 shadow-sm hover:shadow-md hover:-translate-y-0.5 relative overflow-visible ${
                  activeTier === 1 ? "border-accent" : "border-outline-variant/30 hover:border-accent/50"
                }`}
              >
                <div className="absolute -top-3 right-6 bg-accent text-primary text-[10px] font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Maximum Results
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" className="text-accent" />
                    </svg>
                  </div>
                  <h3 className="font-body font-bold text-xl text-on-surface">1-on-1 Sessions</h3>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4 pl-12">
                  Every session is built around you — your weaknesses, your pace, your target score.
                </p>
                <div className="pl-12 mb-6 flex flex-wrap items-center gap-3">
                  {prices ? (
                    <PriceBadge amount={prices.oneOnOne.amount} period={prices.oneOnOne.period} accent="gold" />
                  ) : (
                    <LoadingSkeleton />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPlan("oneOnOne", "1-on-1 Sessions", prices?.oneOnOne.amount || "Rs 100,000");
                    }}
                    className="py-2 px-4 rounded-xl bg-accent hover:bg-accent/90 text-white font-bold text-xs transition-all shadow-sm cursor-pointer border border-transparent whitespace-nowrap"
                  >
                    Select Plan
                  </button>
                </div>

                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    activeTier === 1 ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="border-t border-outline-variant/40 pt-5 mt-2">
                    {oneOnOneFeatures.map((f, i) => (
                      <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={FireIcon} />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-4 text-xs font-bold text-accent">
                  {activeTier === 1 ? "Tap to collapse" : "See full course details"}
                  <span className={`transition-transform duration-300 inline-flex ${activeTier === 1 ? "rotate-180" : "rotate-0"}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent" /></svg>
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center py-12 pb-16">
              <p className="text-sm md:text-base text-on-surface-variant mb-6 max-w-md mx-auto leading-relaxed">
                Not sure which format is right for you? We'll help you decide — no pressure.
              </p>
              <a
                href="https://wa.me/923164514334?text=Hi%20I%20would%20like%20to%20get%20more%20info%20about%20SAT%20prep."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#25D366",
                  color: "#FFFFFF",
                  fontSize: "15px",
                  fontWeight: 600,
                  padding: "14px 32px",
                  borderRadius: "12px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 16px rgba(37,211,102,0.2)",
                }}
                className="hover:scale-[1.02] transition-transform"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.22h.004c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0012.012 2zm4.957 14.215c-.273.767-1.561 1.481-2.148 1.54-.58.06-1.169.311-3.709-.738-3.252-1.344-5.344-4.657-5.507-4.877-.162-.22-1.302-1.733-1.302-3.31 0-1.579.825-2.353 1.116-2.65.29-.297.77-.381 1.008-.381.238 0 .476.002.68.01.209.009.49-.078.766.587.283.682.966 2.356 1.05 2.528.083.172.138.373.023.602-.114.23-.172.373-.341.57-.169.196-.355.439-.508.587-.168.163-.344.341-.148.68.196.34 0 .34.872 1.121 1.125.998 2.08 1.307 2.375 1.454.296.147.47.127.646-.076.177-.203.766-.89.972-1.192.206-.303.411-.254.694-.148.283.106 1.796.848 2.106 1.002.311.155.518.23.593.36.074.13.074.754-.2 1.521z" />
                </svg>
                GET MORE INFO ON WHATSAPP
              </a>
            </div>
          </div>

          {/* Contact form block */}
          <ContactForm />
        </div>
      </main>
      <Footer />

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
                Click the button below to send your proof screenshot directly on WhatsApp. This allows our support team to verify and activate your dashboard instantly.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <a
                href={`https://wa.me/923164514334?text=Hi%20SAT%20Sharks!%20I%20have%20uploaded%20my%20payment%20proof%20for%20the%20${encodeURIComponent(selectedPlan?.name || "")}%20plan.%2520My%252520registered%252520email%252520is%252520${encodeURIComponent(user.email)}.%2520Please%2520approve%2520my%2520subscription.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.982L2 22l5.233-1.371a9.936 9.936 0 004.779 1.22h.004c5.505 0 9.989-4.478 9.99-9.985A9.983 9.983 0 0012.012 2zm4.957 14.215c-.273.767-1.561 1.481-2.148 1.54-.58.06-1.169.311-3.709-.738-3.252-1.344-5.344-4.657-5.507-4.877-.162-.22-1.302-1.733-1.302-3.31 0-1.579.825-2.353 1.116-2.65.29-.297.77-.381 1.008-.381.238 0 .476.002.68.01.209.009.49-.078.766.587.283.682.966 2.356 1.05 2.528.083.172.138.373.023.602-.114.23-.172.373-.341.57-.169.196-.355.439-.508.587-.168.163-.344.341-.148.68.196.34 0 .34.872 1.121 1.125.998 2.08 1.307 2.375 1.454.296.147.47.127.646-.076.177-.203.766-.89.972-1.192.206-.303.411-.254.694-.148.283.106 1.796.848 2.106 1.002.311.155.518.23.593.36.074.13.074.754-.2 1.521z" />
                </svg>
                Send Proof to WhatsApp
              </a>
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
                    Transfer the plan amount to our EasyPaisa/JazzCash account and upload the receipt screenshot below.
                  </p>
                  <div className="rounded-xl border border-outline-variant/40 bg-surface-container-lowest p-4 space-y-2.5">
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Mobile Wallet:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        EasyPaisa / JazzCash
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm pb-2 border-b border-outline-variant/20">
                      <span className="text-on-surface-variant text-xs">Account Title:</span>
                      <span className="font-semibold text-on-surface flex items-center">
                        HAFIZ MUHAMMAD TAYYAB
                        <button
                          type="button"
                          onClick={() => handleCopy("HAFIZ MUHAMMAD TAYYAB", "walletTitle")}
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
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon name="credit_card" className="text-2xl" />
                  </div>
                  <h4 className="font-bold text-sm">Pay Securely via Card / Stripe</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
                    Complete your enrollment immediately using any debit or credit card. Payments are processed securely.
                  </p>
                  <button
                    type="button"
                    onClick={handleCardPayment}
                    disabled={isUploading}
                    className="w-full max-w-xs py-3 rounded-xl bg-primary hover:bg-accent text-on-primary font-bold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-sm mx-auto"
                  >
                    {isUploading ? "Redirecting to checkout..." : "Proceed to Card Payment"}
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

                <div className="text-center pt-2">
                  <span className="text-xs text-on-surface-variant/70">Or, want instant activation? </span>
                  <a
                    href={`https://wa.me/923164514334?text=Hi%20SAT%20Sharks!%20I%20have%2520made%20the%20payment%20for%20the%20${encodeURIComponent(selectedPlan?.name || "")}%20plan.%20My%20registered%20email%20is%20${encodeURIComponent(user.email)}. Please activate my subscription.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#25D366] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    Send receipt via WhatsApp
                  </a>
                </div>
              </form>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
