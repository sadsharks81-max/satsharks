import { useState, useEffect } from "react";

/*
  GEO-PRICING LOGIC
  -----------------
  In this demo: detects Pakistan via browser timezone ("Asia/Karachi").
  
  On your real website, use IP geolocation for accuracy:
  - Cloudflare: request.cf.country (free, built-in)
  - Vercel: request.geo.country (free, built-in)
  - API: fetch('https://ipapi.co/json/') → response.country_code
  
  Replace the useEffect below with your preferred method.
*/

function useRegion() {
  const [region, setRegion] = useState("loading");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      // Asia/Karachi = Pakistan
      const isPK = tz === "Asia/Karachi";
      setRegion(isPK ? "pk" : "intl");
    } catch {
      setRegion("intl");
    }
  }, []);

  return region;
}

// ── Pricing Config (edit these) ──
const PRICING = {
  pk: {
    group:    { amount: "Rs 40,000",  period: "/ full course" },
    oneOnOne: { amount: "Rs 100,000", period: "/ month" },
  },
  intl: {
    group:    { amount: "$400",  period: "/ full course" },
    oneOnOne: { amount: "$800",  period: "/ month" },
  },
};

// ── Icons ──
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

// ── Feature Data ──
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

// ── Components ──
function FeatureBlock({ heading, bullets, IconComp }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <h4 style={{ color: "#0F1B2D", fontWeight: 700, fontSize: "15px", marginBottom: "10px", letterSpacing: "-0.01em" }}>
        {heading}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <IconComp />
            <span style={{ color: "#3A4A5C", fontSize: "14px", lineHeight: "1.55" }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceBadge({ amount, period, accent }) {
  const isGold = accent === "gold";
  return (
    <div style={{
      display: "inline-flex", alignItems: "baseline", gap: "5px",
      background: isGold ? "rgba(245,166,35,0.08)" : "rgba(59,125,216,0.08)",
      border: `1px solid ${isGold ? "rgba(245,166,35,0.2)" : "rgba(59,125,216,0.2)"}`,
      borderRadius: "10px", padding: "7px 16px",
    }}>
      <span style={{
        fontSize: "22px", fontWeight: 800, letterSpacing: "-0.02em",
        color: isGold ? "#D4911E" : "#2B6BC0",
      }}>{amount}</span>
      <span style={{
        fontSize: "12px", fontWeight: 500,
        color: isGold ? "#B07A15" : "#4A7FCC",
      }}>{period}</span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{
      display: "inline-block", width: "160px", height: "38px",
      borderRadius: "10px", background: "linear-gradient(90deg, #EDF1F5 25%, #F7F9FC 50%, #EDF1F5 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
  );
}

// ── Main Page ──
export default function SATPrepPage() {
  const region = useRegion();
  const [activeTier, setActiveTier] = useState(null);
  const [hoveredTier, setHoveredTier] = useState(null);

  const prices = region === "loading" ? null : PRICING[region];

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1929 0%, #162D4D 50%, #1A3558 100%)", padding: "48px 24px 56px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F5A623", letterSpacing: "0.05em", textTransform: "uppercase" }}>SAT / ACT Preparation</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Stop Guessing.<br />
            <span style={{ color: "#5BA3F5" }}>Start Scoring.</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 17px)", color: "#94A7BF", lineHeight: 1.6, margin: 0, maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
            6 live sessions a week. Actual past papers every week. Desmos mastery. Shortcuts that save minutes.
          </p>
        </div>
      </div>

      {/* Stat strip */}
      <div style={{ background: "#0F1B2D", borderBottom: "1px solid rgba(59,125,216,0.15)" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "clamp(24px, 6vw, 60px)", padding: "16px 20px" }}>
          {[
            ["6", "Live Sessions / Week"],
            ["23", "Sessions / Month"],
            ["7", "Practice Tests / Month"],
          ].map(([num, label], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#F5A623", letterSpacing: "-0.02em" }}>{num}</div>
              <div style={{ fontSize: "11px", color: "#6B8099", fontWeight: 500, letterSpacing: "0.02em", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 20px" }}>

        {/* Tier Toggle */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "4px",
          margin: "28px auto 0", background: "#FFFFFF", borderRadius: "14px",
          padding: "5px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", maxWidth: "380px",
        }}>
          {["Group", "1-on-1"].map((label, i) => {
            const isActive = activeTier === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTier(isActive ? null : i)}
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: "10px", border: "none",
                  cursor: "pointer", fontSize: "14px", fontWeight: 600,
                  transition: "all 0.25s ease",
                  background: isActive ? (i === 0 ? "#3B7DD8" : "#F5A623") : "transparent",
                  color: isActive ? "#FFFFFF" : "#5A6B7F",
                }}
              >
                {label} Sessions
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "24px", marginTop: "24px", paddingBottom: "36px" }}>

          {/* ── Group Card ── */}
          <div
            onMouseEnter={() => setHoveredTier(0)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 0 ? null : 0)}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "28px 26px",
              cursor: "pointer", transition: "all 0.3s ease",
              border: activeTier === 0 ? "2px solid #3B7DD8" : "2px solid transparent",
              boxShadow: hoveredTier === 0 || activeTier === 0 ? "0 8px 32px rgba(59,125,216,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 0 ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(59,125,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M17 21V19C17 16.79 15.21 15 13 15H5C2.79 15 1 16.79 1 19V21" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="#3B7DD8" strokeWidth="2"/>
                  <path d="M23 21V19C23 17.14 21.73 15.57 20 15.13" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="19" cy="7" r="3" stroke="#3B7DD8" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0 }}>Group Sessions</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 10px", paddingLeft: "46px" }}>
              Learn alongside peers in a structured, high-intensity program designed to push everyone forward.
            </p>
            <div style={{ paddingLeft: "46px", marginBottom: "16px" }}>
              {prices ? (
                <PriceBadge amount={prices.group.amount} period={prices.group.period} accent="blue" />
              ) : (
                <LoadingSkeleton />
              )}
            </div>

            <div style={{
              maxHeight: activeTier === 0 ? "800px" : "0px",
              overflow: "hidden", transition: "max-height 0.45s ease, opacity 0.3s ease",
              opacity: activeTier === 0 ? 1 : 0,
            }}>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {groupFeatures.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={() => <CheckIcon color="#3B7DD8" />} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", color: "#3B7DD8", fontSize: "13px", fontWeight: 600 }}>
              {activeTier === 0 ? "Tap to collapse" : "See full course details"}
              <span style={{ transform: activeTier === 0 ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#3B7DD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>

          {/* ── 1-on-1 Card ── */}
          <div
            onMouseEnter={() => setHoveredTier(1)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 1 ? null : 1)}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "28px 26px",
              cursor: "pointer", transition: "all 0.3s ease", position: "relative", overflow: "visible",
              border: activeTier === 1 ? "2px solid #F5A623" : "2px solid transparent",
              boxShadow: hoveredTier === 1 || activeTier === 1 ? "0 8px 32px rgba(245,166,35,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 1 ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div style={{ position: "absolute", top: "-12px", right: "24px", background: "#F5A623", color: "#1A1400", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Maximum Results
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21V19C20 16.79 18.21 15 16 15H8C5.79 15 4 16.79 4 19V21" stroke="#F5A623" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="7" r="4" stroke="#F5A623" strokeWidth="2"/>
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0 }}>1-on-1 Sessions</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 10px", paddingLeft: "46px" }}>
              Every session is built around you — your weaknesses, your pace, your target score.
            </p>
            <div style={{ paddingLeft: "46px", marginBottom: "16px" }}>
              {prices ? (
                <PriceBadge amount={prices.oneOnOne.amount} period={prices.oneOnOne.period} accent="gold" />
              ) : (
                <LoadingSkeleton />
              )}
            </div>

            <div style={{
              maxHeight: activeTier === 1 ? "800px" : "0px",
              overflow: "hidden", transition: "max-height 0.45s ease, opacity 0.3s ease",
              opacity: activeTier === 1 ? 1 : 0,
            }}>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {oneOnOneFeatures.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} IconComp={FireIcon} />
                ))}
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", color: "#F5A623", fontSize: "13px", fontWeight: 600 }}>
              {activeTier === 1 ? "Tap to collapse" : "See full course details"}
              <span style={{ transform: activeTier === 1 ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center", paddingBottom: "48px" }}>
          <p style={{ fontSize: "15px", color: "#5A6B7F", marginBottom: "20px", lineHeight: 1.6 }}>
            Not sure which format is right for you? We'll help you decide — no pressure.
          </p>
          <a
            href="https://wa.me/923164514334?text=Hi%2C%20I'm%20interested%20in%20SAT%20prep.%20Could%20you%20share%20more%20details%3F"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "#0F1B2D", color: "#FFFFFF", fontSize: "15px",
              fontWeight: 600, padding: "14px 32px", borderRadius: "12px",
              textDecoration: "none", boxShadow: "0 4px 16px rgba(15,27,45,0.2)",
            }}
          >
            Book a Free Trial Session
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <p style={{ fontSize: "12px", color: "#8A9BB5", marginTop: "12px" }}>
            satsharks.org  ·  0316 451 4334
          </p>
        </div>
      </div>
    </div>
  );
}
