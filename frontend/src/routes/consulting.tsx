import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";

export const Route = createFileRoute("/consulting")({
  component: LUMSCounselling,
});



const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#3B7DD8" opacity="0.12" />
    <path d="M6 10.5L8.5 13L14 7.5" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
    <circle cx="10" cy="10" r="10" fill="#F5A623" opacity="0.12" />
    <path d="M10 4L11.8 7.6L15.8 8.2L12.9 11L13.6 15L10 13.1L6.4 15L7.1 11L4.2 8.2L8.2 7.6L10 4Z" fill="#F5A623" />
  </svg>
);

const TrophyIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8 21H16M12 17V21M6 3H18V7C18 10.31 15.31 13 12 13C8.69 13 6 10.31 6 7V3Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 7H3V8C3 9.66 4.34 11 6 11V7Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 7H21V8C21 9.66 19.66 11 18 11V7Z" stroke="#F5A623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const tier1Features = [
  {
    heading: "Personal Statement: Collaborative Deep Dive",
    bullets: [
      "Work 1-on-1 with a counsellor who knows exactly what LUMS looks for",
      "Uncover the real story behind your experiences, not the version everyone else writes",
      "Shape your narrative until it's sharp, authentic, and impossible to forget",
      "Multiple rounds of feedback until your voice comes through on every line",
    ],
  },
  {
    heading: "Extracurricular & Awards Descriptions",
    bullets: [
      "Rewrite every entry to highlight leadership, initiative, and measurable impact",
      "Position activities strategically because LUMS values depth over breadth",
      "Optimized phrasing that makes the most of every character",
    ],
  },
  {
    heading: "Cohesive Application Narrative",
    bullets: [
      "Connect your PS, ECs, and awards into one unified, intentional story",
      "Eliminate contradictions and repetition across sections",
      "Ensure the admissions committee sees a focused applicant with clear direction",
    ],
  },
];

const tier2Features = [
  {
    heading: "Personal Statement: Written For You",
    bullets: [
      "We craft your entire LUMS Personal Statement from the ground up",
      "Already have a draft? We'll transform it into something compelling",
      "Built on in-depth interviews to capture your authentic voice",
      "Unlimited revisions until you're fully confident in the result",
    ],
  },
  {
    heading: "Complete EC & Awards Build-Out",
    bullets: [
      "All extracurricular and awards descriptions written from scratch",
      "Profile analysis to identify hidden strengths and fill gaps",
      "Strategic positioning of activities to match what LUMS values most",
    ],
  },
  {
    heading: "Opportunity & Competition Guidance",
    bullets: [
      "Curated recommendations for competitions and programs that elevate your profile",
      "Guidance on national and international level opportunities that LUMS respects",
      "Hands-on support from registration through to winning",
      "Build real, verifiable achievements before your application deadline",
    ],
  },
];

const wins = [
  "International Math Olympiad medalists",
  "National Science competition winners",
  "International debate & MUN champions",
  "National level hackathon finalists",
];

interface FeatureBlockProps {
  heading: string;
  bullets: string[];
  Icon: React.ComponentType;
}

function FeatureBlock({ heading, bullets, Icon }: FeatureBlockProps) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <h4 style={{ color: "#0F1B2D", fontWeight: 700, fontSize: "15px", marginBottom: "10px", letterSpacing: "-0.01em" }}>
        {heading}
      </h4>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {bullets.map((b: string, i: number) => (
          <div key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Icon />
            <span style={{ color: "#3A4A5C", fontSize: "14px", lineHeight: "1.55" }}>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LUMSCounsellingContent() {
  const [activeTier, setActiveTier] = useState<number | null>(null);
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [whatsappHover, setWhatsappHover] = useState(false);

  return (
    <div style={{ background: "#F7F9FC", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0B1929 0%, #162D4D 50%, #1A3558 100%)", padding: "48px 24px 52px", textAlign: "center" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(245,166,35,0.15)", border: "1px solid rgba(245,166,35,0.3)", borderRadius: "20px", padding: "6px 16px", marginBottom: "20px" }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F5A623", letterSpacing: "0.05em", textTransform: "uppercase" }}>LUMS Admissions Counselling</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            LUMS Doesn't Pick<br />
            <span style={{ color: "#5BA3F5" }}>The Loudest Applicant.</span>
          </h1>
          <p style={{ fontSize: "clamp(15px, 2.5vw, 17px)", color: "#94A7BF", lineHeight: 1.6, margin: 0, maxWidth: "580px", marginLeft: "auto", marginRight: "auto" }}>
            They pick the one with the clearest story. We help you find yours and write it in a way the admissions committee won't forget.
          </p>
        </div>
      </div>

      {/* Social Proof Strip */}
      <div style={{ background: "#0F1B2D", borderBottom: "1px solid rgba(59,125,216,0.15)" }}>
        <div style={{ maxWidth: "780px", margin: "0 auto", padding: "18px 20px", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
            <TrophyIcon />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#F5A623", letterSpacing: "0.03em", textTransform: "uppercase" }}>Our Students' Track Record</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
            {wins.map((w, i) => (
              <span key={i} style={{
                fontSize: "12px", fontWeight: 500, color: "#94A7BF",
                background: "rgba(59,125,216,0.08)", border: "1px solid rgba(59,125,216,0.12)",
                borderRadius: "20px", padding: "5px 14px",
              }}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 20px" }}>

        {/* Toggle */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "4px",
          margin: "28px auto 0", background: "#FFFFFF", borderRadius: "14px",
          padding: "5px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", maxWidth: "420px",
        }}>
          {["Guided", "Complete"].map((label, i) => {
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
                {i === 0 ? "Guided Support" : "Complete Package"}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))", gap: "24px", marginTop: "28px", paddingBottom: "36px" }}>

          {/* Tier 1: Guided */}
          <div
            onMouseEnter={() => setHoveredTier(0)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 0 ? null : 0)}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "32px 28px",
              cursor: "pointer", transition: "all 0.3s ease",
              border: activeTier === 0 ? "2px solid #3B7DD8" : "2px solid transparent",
              boxShadow: hoveredTier === 0 || activeTier === 0 ? "0 8px 32px rgba(59,125,216,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 0 ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(59,125,216,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#3B7DD8" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M2 17L12 22L22 17" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 12L12 17L22 12" stroke="#3B7DD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0 }}>Guided Support</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 20px", paddingLeft: "46px" }}>
              We work alongside you to build an application that's authentically yours, with expert guidance shaping every section.
            </p>

            <div>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {tier1Features.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} Icon={CheckIcon} />
                ))}
              </div>
            </div>

            <a
              href="https://wa.me/923164514334?text=Hi%2C%20I'm%20interested%20in%20the%20Guided%20Support%20LUMS%20counselling."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", 
                marginTop: "20px", padding: "12px", background: "#25D366", color: "#FFF", 
                fontSize: "14px", fontWeight: 700, borderRadius: "10px", textDecoration: "none"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Tap to chat
            </a>
          </div>

          {/* Tier 2: Complete */}
          <div
            onMouseEnter={() => setHoveredTier(1)}
            onMouseLeave={() => setHoveredTier(null)}
            onClick={() => setActiveTier(activeTier === 1 ? null : 1)}
            style={{
              background: "#FFFFFF", borderRadius: "16px", padding: "32px 28px",
              cursor: "pointer", transition: "all 0.3s ease", position: "relative", overflow: "visible",
              border: activeTier === 1 ? "2px solid #F5A623" : "2px solid transparent",
              boxShadow: hoveredTier === 1 || activeTier === 1 ? "0 8px 32px rgba(245,166,35,0.15)" : "0 2px 12px rgba(0,0,0,0.04)",
              transform: hoveredTier === 1 ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            <div style={{ position: "absolute", top: "-12px", right: "24px", background: "#F5A623", color: "#1A1400", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Most Popular
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,166,35,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#F5A623" />
                </svg>
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F1B2D", margin: 0 }}>Complete Package</h3>
            </div>
            <p style={{ fontSize: "14px", color: "#6B7C8F", lineHeight: 1.55, margin: "0 0 20px", paddingLeft: "46px" }}>
              We handle everything, from writing your essays to putting you on the podium at competitions that LUMS actually cares about.
            </p>

            <div>
              <div style={{ borderTop: "1px solid #EDF1F5", paddingTop: "20px" }}>
                {tier2Features.map((f, i) => (
                  <FeatureBlock key={i} heading={f.heading} bullets={f.bullets} Icon={StarIcon} />
                ))}

                <div style={{
                  background: "linear-gradient(135deg, rgba(245,166,35,0.06) 0%, rgba(59,125,216,0.06) 100%)",
                  border: "1px solid rgba(245,166,35,0.15)",
                  borderRadius: "12px", padding: "16px 18px", marginTop: "4px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <TrophyIcon />
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F1B2D" }}>This isn't theoretical. Our students win.</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#4A6580", lineHeight: 1.55, margin: 0 }}>
                    Our students have medaled at International Math Olympiads, won national level science and debate competitions, and placed at international hackathons. When we say we support you from participation to winning, we mean it.
                  </p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/923164514334?text=Hi%2C%20I'm%20interested%20in%20the%20Complete%20Package%20LUMS%20counselling."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", 
                marginTop: "20px", padding: "12px", background: "#25D366", color: "#FFF", 
                fontSize: "14px", fontWeight: 700, borderRadius: "10px", textDecoration: "none"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Tap to chat
            </a>
          </div>
        </div>

        {/* Why LUMS section */}
        <div style={{
          background: "#FFFFFF", borderRadius: "16px", padding: "28px 28px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.04)", marginBottom: "32px",
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F1B2D", margin: "0 0 14px" }}>
            Why LUMS Applications Need a Different Approach
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              "LUMS reads thousands of personal statements every cycle and most sound exactly the same. Generic volunteering stories, vague leadership claims, and recycled \"I learned the value of teamwork\" essays get skimmed and forgotten.",
              "What works is specificity. A clear narrative thread connecting who you are, what you've done, and why you're applying to that specific program. Your ECs need to reinforce the same story your PS is telling.",
              "We've helped students get into SBASSE, SDSB, HSS, SAHSOL, and SOE. We know what each school values, and we build your application around that, not around a template.",
            ].map((text, i) => (
              <p key={i} style={{ fontSize: "14px", color: "#4A5E73", lineHeight: 1.65, margin: 0 }}>{text}</p>
            ))}
          </div>
        </div>


      </div>

      {/* Sticky WhatsApp Bubble */}
      <a
        href="https://wa.me/923164514334?text=Hi%2C%20I'm%20interested%20in%20LUMS%20counselling.%20Could%20you%20share%20more%20details%3F"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setWhatsappHover(true)}
        onMouseLeave={() => setWhatsappHover(false)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "#25D366",
          color: "#FFFFFF",
          padding: whatsappHover ? "14px 24px" : "14px 16px",
          borderRadius: "50px",
          textDecoration: "none",
          boxShadow: "0 6px 24px rgba(37,211,102,0.4)",
          transition: "all 0.3s ease",
          transform: whatsappHover ? "scale(1.05)" : "scale(1)",
          zIndex: 100,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span style={{
          fontSize: "14px",
          fontWeight: 600,
          whiteSpace: "nowrap",
          maxWidth: whatsappHover ? "200px" : "0px",
          overflow: "hidden",
          transition: "max-width 0.3s ease, opacity 0.3s ease",
          opacity: whatsappHover ? 1 : 0,
        }}>
          Let's talk about LUMS
        </span>
      </a>
    </div>
  );
}


function LUMSCounselling() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <LUMSCounsellingContent />
      </main>
      <Footer />
    </div>
  );
}
