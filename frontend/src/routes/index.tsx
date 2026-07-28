import { createFileRoute } from "@tanstack/react-router";
import heroAsset from "@/assets/hero.png.asset.json";
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
  return (
    <div className="min-h-screen bg-background text-on-background overflow-x-hidden animate-fade-up">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
