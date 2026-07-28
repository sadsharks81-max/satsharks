import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Icon } from "../components/common/Icon";
import { Button } from "../components/ui/Button";

export const Route = createFileRoute("/payment/cancel")({
  component: PaymentCancel,
});

function PaymentCancel() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-[500px] w-full text-center bg-surface border border-outline-variant/30 rounded-3xl p-12 shark-shadow animate-fade-up">
          <div className="w-24 h-24 bg-red-400/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="error_outline" className="text-5xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Payment Cancelled</h1>
          <p className="text-on-surface-variant mb-8">
            Your payment process was interrupted and you have not been charged. If you experienced an issue, please try again or contact support.
          </p>
          <div className="flex flex-col gap-4">
            <Link to="/sat">
              <Button className="w-full py-4">Try Again</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="w-full py-4">Return to Dashboard</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
