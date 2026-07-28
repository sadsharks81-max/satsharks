import { createFileRoute } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Booking } from "../components/sections/Booking";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Book a Session | SAT Sharks" },
      {
        name: "description",
        content: "Schedule your private SAT preparation and college admissions consultation.",
      },
    ],
    links: [{ rel: "canonical", href: "/booking" }],
  }),
  component: BookingPage,
});

function BookingPage() {
  return (
    <div className="min-h-screen bg-background text-on-background animate-fade-up flex flex-col">
      <Header />
      <main className="flex-1">
        <Booking />
      </main>
      <Footer />
    </div>
  );
}
