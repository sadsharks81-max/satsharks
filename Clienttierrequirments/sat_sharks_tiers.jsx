import { useState } from "react";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#3B7DD8" opacity="0.15" />
    <path d="M6 10.5L8.5 13L14 7.5" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#F5A623" opacity="0.15" />
    <path d="M10 4L11.8 7.6L15.8 8.2L12.9 11L13.6 15L10 13.1L6.4 15L7.1 11L4.2 8.2L8.2 7.6L10 4Z" fill="#F5A623" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const tier1Features = [
  {
    heading: "Personal Statement — Collaborative Deep Dive",
    bullets: [
      "Work 1-on-1 with a counsellor to uncover your authentic story",
      "Move beyond generic narratives that admissions teams skip over",
      "Shape raw experiences into a compelling, memorable essay",
      "Multiple rounds of feedback until your voice shines through",
    ],
  },
  {
    heading: "Extracurricular & Awards Descriptions",
    bullets: [
      "Rewrite all activity entries to emphasize leadership and impact",
      "Optimized character count — every word earns its place",
      "Strategic ordering to lead with your strongest contributions",
    ],
  },
  {
    heading: "Cohesive Application Narrative",
    bullets: [
      "Connect your PS, ECs, and awards into one clear story",
      "Eliminate contradictions and repetition across sections",
      "Ensure admissions committees see a unified, intentional applicant",
    ],
  },
];

const tier2Features = [
  {
    heading: "Personal Statement — Written For You",
    bullets: [
      "We craft your entire Personal Statement from the ground up",
      "Already have a draft? We'll transform it into something powerful",
      "Built on deep interviews to capture your real voice and story",
      "Unlimited revisions until you're fully confident in the result",
    ],
  },
  {
    heading: "Complete EC & Awards Build-Out",
    bullets: [
      "All extracurricular and awards descriptions written from scratch",
      "Profile analysis to identify gaps and hidden strengths",
      "Strategic positioning of activities for maximum admissions impact",
    ],
  },
  {
    heading: "Opportunity & Competition Guidance",
    bullets: [
      "Curated recommendations for competitions and programs that fit your profile",
      "Guidance on national and international-level opportunities",
      "Hands-on support from participation through to winning",
      "Strengthen your application with real, verifiable achievements",
    ],
  },
];

function FeatureBlock({ heading, bullets, icon: Icon }) {
  return (
    <div className="mb-5 last:mb-0">
      <h4 style={{ color: "#0F1B2D", fontWeight: 700, fontSize: "15px", marginBottom: "10px", letterSpacing: "-0.01em" }}>
        {heading}
      </h4>
      <div className="flex flex-col gap-2.5">
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-2.5 items-start">
            <Icon />
            <span style={{ color: "#3A4A5C", fontSize: "14px", lineHeight: "1.55" }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SATSharksTiers() {
  const [activeTier, setActiveTier] = useState(null);
  const [hoveredTier, setHoveredTier] = useState(null);

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1929 0%, #162D4D 50%, #1A3558 100%)", padding: "48px 24px 52px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F5A623", letterSpacing: "0.05em", textTransform: "uppercase" }}>USA Admissions Counselling</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Your Application Should<br />
            <span style={{ color: "#5BA3F5" }}>Tell a Story Worth Reading</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 17px)", color: "#94A7BF", lineHeight: 1.6, margin: 0, maxWidth: "560px", marginLeft: "auto", marginRight: "auto" }}>
            Most students submit applications that blend in. We make sure yours stands out — with a narrative admissions committees actually remember.
          </p>
        </div>
      </div>

      {/* Tier Toggle */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "-22px auto 0", background: "#FFFFFF", borderRadius: "14px", padding: "5px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", maxWidth: "420px", position: "relative", zIndex: 2 }}>
          {["Guided", "Complete"].map((label, i) => {
            const isActive = activeTier === i;
            return (
              <button
                key={i}
                onClick={() => setActiveTier(isActive ? null : i)}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: 600,
                  transition: "all 0.25s ease",
                  background: isActive ? (i === 0 ? "#3B7DD8" : "#F5A623") : "transparent",
                  color: isActive ? "#FFFFFF" : "#5A6B7F",
                }}
              >
                {i === 0 ? "Guided Support" : "Complete Package"}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "24px", marginTop: "32px", paddingBottom: "40px" }}>
          
          {/* Tier 1 Card */}
          <div
            onMouseEnter={() => setHoveredTier(0)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 0 ? null : 0)}
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "32px 28px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: activeTier === 0 ? "2px solid #3B7DD8" : "2px solid transparent",
              boxShadow: hoveredTier === 0 || activeTier === 0
                ? "0 8px 32px rgba(59,125,216,0.15)"
                : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 0 ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(59,125,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B7DD8" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0, letterSpacing: "-0.01em" }}>Guided Support</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 24px", paddingLeft: "46px" }}>
              We work alongside you to craft an application that's authentically yours — with expert guidance at every step.
            </p>

            {/* Features */}
            <div style={{
              maxHeight: activeTier === 0 ? "600px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.4s ease, opacity 0.3s ease",
              opacity: activeTier === 0 ? 1 : 0,
            }}>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {tier1Features.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} icon={CheckIcon} />
                ))}
              </div>
            </div>

            {/* Expand hint */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px", color: "#3B7DD8", fontSize: "13px", fontWeight: 600 }}>
              {activeTier === 0 ? "Tap to collapse" : "See what's included"}
              <span style={{ transform: activeTier === 0 ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#3B7DD8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>

          {/* Tier 2 Card */}
          <div
            onMouseEnter={() => setHoveredTier(1)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 1 ? null : 1)}
            style={{
              background: "#FFFFFF",
              borderRadius: "16px",
              padding: "32px 28px",
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: activeTier === 1 ? "2px solid #F5A623" : "2px solid transparent",
              boxShadow: hoveredTier === 1 || activeTier === 1
                ? "0 8px 32px rgba(245,166,35,0.15)"
                : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 1 ? "translateY(-2px)" : "translateY(0)",
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Popular tag */}
            <div style={{ position: "absolute", top: "-12px", right: "24px", background: "#F5A623", color: "#1A1400", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Most Popular
            </div>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F5A623" />
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0, letterSpacing: "-0.01em" }}>Complete Package</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 24px", paddingLeft: "46px" }}>
              We handle everything — from writing your essays to guiding you toward competitions that strengthen your profile.
            </p>

            {/* Features */}
            <div style={{
              maxHeight: activeTier === 1 ? "700px" : "0px",
              overflow: "hidden",
              transition: "max-height 0.4s ease, opacity 0.3s ease",
              opacity: activeTier === 1 ? 1 : 0,
            }}>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {tier2Features.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} icon={StarIcon} />
                ))}
              </div>
            </div>

            {/* Expand hint */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "16px", color: "#F5A623", fontSize: "13px", fontWeight: 600 }}>
              {activeTier === 1 ? "Tap to collapse" : "See what's included"}
              <span style={{ transform: activeTier === 1 ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", display: "inline-flex" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#F5A623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", paddingBottom: "48px" }}>
          <p style={{ fontSize: "15px", color: "#5A6B7F", marginBottom: "20px", lineHeight: 1.6 }}>
            Not sure which tier fits you? Let's talk — no commitment needed.
          </p>
          <a
            href="https://wa.me/923164514334"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#0F1B2D",
              color: "#FFFFFF",
              fontSize: "15px",
              fontWeight: 600,
              padding: "14px 32px",
              borderRadius: "12px",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 16px rgba(15,27,45,0.2)",
            }}
          >
            Book a Free Consultation <ArrowIcon />
          </a>
          <p style={{ fontSize: "12px", color: "#8A9BB5", marginTop: "12px" }}>
            satsharks.org  ·  0316 451 4334
          </p>
        </div>
      </div>
    </div>
  );
}
