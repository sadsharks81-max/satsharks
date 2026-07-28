import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { SATTest } from "../../types";

export const Route = createFileRoute("/dashboard/sat-tests")({
  component: SATTestList,
});

function SATTestList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState<SATTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [startingTestId, setStartingTestId] = useState<string | null>(null);

  const lockedCount = tests.filter((t) => t.accessLevel === "PAID" && user?.subscription === "FREE").length;

  useEffect(() => {
    api.get("/api/sat").then((res) => {
      if (res.success) setTests(res.tests || []);
      setLoading(false);
    });
  }, []);

  const handleStart = async (testId: string) => {
    setStartingTestId(testId);
    const res = await api.post(`/api/sat/${testId}/start`, {});
    if (res.success) {
      navigate({ to: `/dashboard/sat-runner/${res.attempt._id}` });
    } else {
      setStartingTestId(null);
    }
  };

  if (startingTestId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="hourglass_top" className="text-5xl text-primary mb-4 animate-pulse" />
          <div className="text-on-surface-variant font-semibold">Loading your SAT test...</div>
        </div>
      </div>
    );
  }

  return (
    <StudentLayout activeItem="/dashboard/sat-tests">
      <div className="mb-8 rounded-2xl bg-surface-container-low p-6 border border-outline-variant/20 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Digital SAT Practice Tests</h1>
          <p className="text-sm text-on-surface-variant max-w-2xl">
            Take full-length adaptive Digital SAT mock tests. The test structure matches the official digital SAT with a total of 98 questions spanning 4 modules and a 10-minute break.
          </p>
        </div>
        <div className="flex gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-semibold">
            <Icon name="help_center" className="text-primary text-[18px]" />
            <span>98 Questions</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-semibold">
            <Icon name="timer" className="text-accent text-[18px]" />
            <span>134 Min + Break</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-xl border border-outline-variant/30 text-xs font-semibold">
            <Icon name="device_hub" className="text-secondary text-[18px]" />
            <span>Adaptive Routing</span>
          </div>
        </div>
      </div>

      {lockedCount > 0 && (
        <div className="mb-6 p-5 rounded-2xl bg-surface-container-low border border-outline-variant/40 flex flex-col sm:flex-row items-center justify-between gap-4 shark-shadow">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent">
              <Icon name="lock" className="text-[20px]" />
            </div>
            <div>
              <div className="font-bold text-sm text-on-surface">Upgrade to Premium to Unlock {lockedCount} Mock Tests!</div>
              <div className="text-xs text-on-surface-variant font-medium">You currently have a FREE subscription. Upgrade to gain unlimited access to all premium full-length adaptive Digital SAT tests.</div>
            </div>
          </div>
          <Link
            to="/sat"
            className="btn-shimmer bg-primary text-on-primary hover:bg-accent text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg whitespace-nowrap cursor-pointer transition-all duration-300"
          >
            Upgrade Now
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading SAT tests...</div>
      ) : tests.length === 0 ? (
        <EmptyState icon="school" title="No SAT tests available" description="SAT practice tests will appear here once imported by an administrator" />
      ) : (
        <div className="space-y-6">
          {tests.map((test) => {
            const locked = test.accessLevel === "PAID" && user?.subscription === "FREE";
            return (
              <div key={test._id} className={`rounded-2xl bg-surface-container-lowest p-6 border border-outline-variant/40 shark-shadow hover-lift ${locked ? "opacity-70" : ""}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h2 className="text-xl font-bold">{test.title}</h2>
                      {locked ? (
                        <Badge variant="warning"><Icon name="lock" className="text-[12px] mr-1" />PAID</Badge>
                      ) : (
                        <Badge variant="success">FREE</Badge>
                      )}
                      {(test.attemptCount ?? 0) > 0 && (
                        <Badge variant="info">
                          <Icon name="check_circle" className="text-[12px] mr-1" /> Taken {test.attemptCount}x
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant">Digital SAT Year: {test.year} · Exam #{test.testNumber}</p>

                    {/* PDF Actions */}
                    {!locked && test.explanationPdfUrl && (
                      <div className="mt-4 flex gap-3 flex-wrap">
                        <a
                          href={test.explanationPdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-xs font-semibold text-on-surface cursor-pointer"
                        >
                          <Icon name="description" className="text-[14px]" />
                          <span>Explanations (PDF)</span>
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {locked ? (
                      <Link
                        to="/sat"
                        className="inline-block text-center px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all btn-shimmer bg-accent text-primary shark-shadow hover:bg-accent/90 cursor-pointer"
                      >
                        Upgrade to Access
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleStart(test._id)}
                        className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all btn-shimmer bg-primary text-on-primary shark-shadow hover:bg-accent cursor-pointer"
                      >
                        Start Test
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}
