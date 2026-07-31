import { useState, useEffect, useRef } from "react";

const TIERS = [
  {
    id: 1,
    name: "Tier 1",
    label: "Guided",
    headline: "We craft it with you",
    gradient: "linear-gradient(135deg, #4A90D9, #7B68EE)",
    glow: "rgba(123,104,238,0.35)",
    bullet: "#7B68EE",
    features: [
      {
        icon: "📝",
        title: "Personal Statement — Co-Written",
        text: "We work alongside you to shape your narrative and find your authentic voice. Not a template. Your story, sharpened.",
      },
      {
        icon: "🏆",
        title: "ECs & Awards — Polished",
        text: "Compelling write-ups for every activity and achievement. Each one crafted to hit, not fill space.",
      },
      {
        icon: "🔗",
        title: "Unified Story — Connected",
        text: "Your PS, ECs, and awards woven into one cohesive narrative. Everything tells the same powerful story.",
      },
    ],
  },
  {
    id: 2,
    name: "Tier 2",
    label: "Full Package",
    headline: "We handle everything",
    gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    glow: "rgba(245,158,11,0.35)",
    bullet: "#F59E0B",
    features: [
      {
        icon: "✍️",
        title: "Personal Statement — Written For You",
        text: "From scratch or from your draft — we write the whole thing. You show up with your story, we turn it into an acceptance letter magnet.",
      },
      {
        icon: "🎯",
        title: "ECs & Awards — Built From Zero",
        text: "Full write-ups highlighting impact and leadership. We don't list what you did — we show why it mattered.",
      },
      {
        icon: "🧭",
        title: "Opportunity Mapping",
        text: "We assess your profile and steer you toward competitions, programs, and activities that actually move the needle.",
      },
      {
        icon: "🥇",
        title: "Competition Support — To The Podium",
        text: "Hands-on guidance from selection to preparation to winning. Not just participation — results.",
      },
    ],
    achievement: true,
  },
];

function AnimatedCounter({ target, suffix, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function FeatureRow({ feature, index, isVisible }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: "16px",
        padding: "18px 20px",
        borderRadius: "14px",
        background: hovered ? "rgba(255,255,255,0.06)" : "transparent",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: isVisible ? "translateX(0)" : "translateX(-30px)",
        opacity: isVisible ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
        cursor: "default",
      }}
    >
      <span
        style={{
          fontSize: "26px",
          flexShrink: 0,
          transition: "transform 0.2s ease",
          transform: hovered ? "scale(1.15)" : "scale(1)",
        }}
      >
        {feature.icon}
      </span>
      <div>
        <h4
          style={{
            margin: "0 0 4px",
            fontSize: "15px",
            fontWeight: 700,
            color: "#fff",
            letterSpacing: "-0.01em",
          }}
        >
          {feature.title}
        </h4>
        <p
          style={{
            margin: 0,
            fontSize: "13.5px",
            lineHeight: 1.65,
            color: hovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
            transition: "color 0.3s ease",
          }}
        >
          {feature.text}
        </p>
      </div>
    </div>
  );
}

function TierCard({ tier, isActive, onClick }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        flex: "1 1 400px",
        maxWidth: "480px",
        position: "relative",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: isActive
          ? `1.5px solid ${tier.bullet}55`
          : "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
        transform: visible
          ? isActive
            ? "translateY(-4px)"
            : "translateY(0)"
          : "translateY(30px)",
        opacity: visible ? 1 : 0,
        boxShadow: isActive
          ? `0 8px 40px ${tier.glow}, 0 0 0 1px ${tier.bullet}22`
          : "0 4px 24px rgba(0,0,0,0.3)",
      }}
    >
      <div
        style={{
          height: "4px",
          background: tier.gradient,
          opacity: isActive ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
      />

      <div style={{ padding: "28px 28px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 800,
              background: tier.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
            }}
          >
            {tier.name}
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: tier.bullet,
              background: `${tier.bullet}18`,
              padding: "3px 10px",
              borderRadius: "100px",
            }}
          >
            {tier.label}
          </span>
        </div>
        <h3
          style={{
            margin: "0 0 20px",
            fontSize: "clamp(22px, 3.5vw, 28px)",
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
          }}
        >
          {tier.headline}
        </h3>
      </div>

      <div
        style={{
          height: "1px",
          margin: "0 28px",
          background: `linear-gradient(to right, ${tier.bullet}33, transparent)`,
        }}
      />

      <div style={{ padding: "16px 10px 10px" }}>
        {tier.features.map((f, i) => (
          <FeatureRow
            key={i}
            feature={f}
            index={i}
            tierColor={tier.bullet}
            isVisible={visible}
          />
        ))}
      </div>

      {tier.achievement && (
        <div style={{ padding: "4px 20px 24px" }}>
          <div
            style={{
              position: "relative",
              padding: "18px 20px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(245,158,11,0.12), rgba(239,68,68,0.08))",
              border: "1px solid rgba(245,158,11,0.2)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "200%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,215,0,0.07), transparent)",
                animation: "shimmer 3s infinite linear",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                position: "relative",
              }}
            >
              <span
                style={{
                  fontSize: "32px",
                  animation: "float 3s ease-in-out infinite",
                }}
              >
                🏅
              </span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#F59E0B",
                    lineHeight: 1.4,
                  }}
                >
                  Our student won the International Maths Olympiad
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "11.5px",
                    color: "rgba(245,158,11,0.55)",
                    fontWeight: 500,
                  }}
                >
                  Competition support that delivers results.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LUMSCounselling() {
  const [activeTier, setActiveTier] = useState(2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0B0B1A",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        color: "#fff",
        padding: "48px 20px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(50%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(123,104,238,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "pulse-glow 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-15%",
          right: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          animation: "pulse-glow 6s ease-in-out infinite 3s",
        }}
      />

      {/* Hero */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "56px",
          position: "relative",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "100px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.08)",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#4ADE80",
              boxShadow: "0 0 8px rgba(74,222,128,0.5)",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
            }}
          >
            LUMS COUNSELLING
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(32px, 7vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            margin: "0 0 16px",
            background:
              "linear-gradient(to right, #fff 30%, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Your story.
          <br />
          Their acceptance.
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.4)",
            maxWidth: "420px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          Choose how much support you need — we'll make sure the application
          does its job.
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          maxWidth: "980px",
          margin: "0 auto",
          flexWrap: "wrap",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {TIERS.map((tier) => (
          <TierCard
            key={tier.id}
            tier={tier}
            isActive={activeTier === tier.id}
            onClick={() => setActiveTier(tier.id)}
          />
        ))}
      </div>

      {/* Stats */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "48px",
          marginTop: "56px",
          flexWrap: "wrap",
          position: "relative",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transition: "opacity 1s ease 0.5s",
        }}
      >
        {[
          { num: 100, suffix: "%", label: "Personalized" },
          { num: 50, suffix: "+", label: "Students Guided" },
          { num: 1, suffix: "st", label: "Olympiad Winner" },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: "32px",
                fontWeight: 900,
                margin: 0,
                background:
                  "linear-gradient(135deg, #fff, rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.03em",
              }}
            >
              <AnimatedCounter target={stat.num} suffix={stat.suffix} />
            </p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: "12px",
                color: "rgba(255,255,255,0.3)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
