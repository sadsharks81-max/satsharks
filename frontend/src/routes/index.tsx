import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import heroAsset from "@/assets/hero.png.asset.json";
import logoImg from "@/assets/logo.png";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/sections/Hero";
import { Stats } from "../components/sections/Stats";
import { Services } from "../components/sections/Services";
import { Testimonials } from "../components/sections/Testimonials";
import { CTA } from "../components/sections/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SAT Sharks | Achieve Your Dream SAT Score & College Admission" },
      {
        name: "description",
        content:
          "Personalized SAT preparation, expert college counseling, essay reviews, and proven strategies.",
      },
      { property: "og:title", content: "SAT Sharks | Achieve Your Dream SAT Score" },
      {
        property: "og:description",
        content: "Personalized SAT prep, college counseling, and essay reviews.",
      },
      { property: "og:image", content: heroAsset.url },
      { property: "twitter:image", content: heroAsset.url },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Landing,
});

function Landing() {
  const [homepageReady, setHomepageReady] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);

  const revealHomepage = useCallback(() => {
    setHomepageReady(true);
    try {
      window.localStorage.setItem("satsharks-home-assets-ready-v2", "true");
    } catch {
      // Storage can be disabled; readiness still applies to this render.
    }
  }, []);

  useEffect(() => {
    try {
      if (window.localStorage.getItem("satsharks-home-assets-ready-v2") === "true") {
        setHomepageReady(true);
      }
    } catch {
      // Treat storage-disabled browsers as first visits.
    }

    const fallback = window.setTimeout(revealHomepage, 4500);
    return () => window.clearTimeout(fallback);
  }, [revealHomepage]);

  useEffect(() => {
    const logo = new Image();
    const markReady = () => setLogoReady(true);
    logo.onload = markReady;
    logo.onerror = markReady;
    logo.src = logoImg;
    if (logo.complete) markReady();
    return () => {
      logo.onload = null;
      logo.onerror = null;
    };
  }, []);

  useEffect(() => {
    if (heroReady && logoReady) revealHomepage();
  }, [heroReady, logoReady, revealHomepage]);

  return (
    <>
      {!homepageReady && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background" role="status" aria-label="Loading website">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className="h-11 w-11 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <div>
              <p className="font-display text-xl font-bold text-primary">SAT Sharks</p>
              <p className="mt-1 text-sm text-on-surface-variant">Preparing your experience...</p>
            </div>
          </div>
        </div>
      )}
      <div className={`min-h-screen bg-background text-on-background overflow-x-hidden transition-opacity duration-200 ${homepageReady ? "opacity-100" : "opacity-0"}`}>
        <Header />
        <main>
          <Hero onReady={() => setHeroReady(true)} />
          <Stats />
          <Services />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </div>
    </>
  );
}
