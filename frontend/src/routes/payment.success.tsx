import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Icon } from "../components/common/Icon";
import { Button } from "../components/ui/Button";

export const Route = createFileRoute("/payment/success")({
  component: PaymentSuccess,
});

function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="max-w-[500px] w-full text-center bg-surface border border-outline-variant/30 rounded-3xl p-12 shark-shadow animate-fade-up">
          <div className="w-24 h-24 bg-green-400/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="check_circle" className="text-5xl" />
          </div>
          <h1 className="text-3xl font-display font-bold text-primary mb-4">Payment Successful!</h1>
          <p className="text-on-surface-variant mb-8">
            Thank you for your subscription. Your account has been upgraded and you now have access to premium features. Welcome to the Gold Standard of Ivy League Admissions!
          </p>
          <Link to="/dashboard">
            <Button className="w-full py-4">Go to Dashboard</Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
