import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { StatCard } from "../../components/ui/StatCard";
import { ScoreCircle } from "../../components/ui/ScoreCircle";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { DashboardStats, TestAttempt, PredictedScore } from "../../types";
import { PortalAccessCountdown } from "../../components/common/PortalAccessCountdown";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

function DashboardHome() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<TestAttempt[]>([]);
  const [predicted, setPredicted] = useState<PredictedScore | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setStats({
          totalTests: 3,
          avgScore: 68,
          bestScore: 82,
          practiceCount: 142,
        } as any);
        setRecentAttempts([
          { _id: "attempt1", percentage: 82, createdAt: "2026-07-29T12:00:00.000Z" },
          { _id: "attempt2", percentage: 65, createdAt: "2026-07-27T12:00:00.000Z" },
          { _id: "attempt3", percentage: 58, createdAt: "2026-07-26T12:00:00.000Z" },
        ] as any);
        setPredicted({
          score: 1420,
          range: { low: 1380, high: 1460 },
          confidence: 85,
          basedOn: 3,
        } as any);
        setLoading(false);
        return;
      }

      await refreshUser();
      const [statsRes, predRes] = await Promise.all([
        api.get("/api/analytics/dashboard"),
        api.get("/api/analytics/predicted-score"),
      ]);
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentAttempts(statsRes.recentAttempts || []);
      }
      if (predRes.success && predRes.predicted) {
        setPredicted(predRes.predicted);
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <StudentLayout activeItem="/dashboard">
      <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>

      {!loading && (
        <div className="mb-8">
          {user?.subscription === "PAID" ? (
            <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl flex items-center gap-4 animate-fade-in shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
                <Icon name="workspace_premium" className="text-2xl animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-on-surface">You are a Premium Member!</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                  Enjoy unlimited access to all practice questions, diagnostic tests, and full course material. Thank you for your support!
                </p>
              </div>
            </div>
          ) : user?.hasPendingPayment ? (
            <div className="p-5 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl flex flex-col md:flex-row md:items-center gap-4 animate-fade-in shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0 animate-pulse">
                <Icon name="hourglass_empty" className="text-2xl" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-on-surface">Subscription Request Pending Approval</h2>
                <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                  Your payment screenshot has been uploaded and is in review. We will upgrade your account as soon as the transfer is verified.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-5 bg-gradient-to-r from-surface-container-high via-surface-container-low to-transparent border border-outline-variant/35 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in shadow-xs">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant shrink-0">
                  <Icon name="info" className="text-2xl" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-on-surface">You are on the Free Plan</h2>
                  <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5 font-medium">
                    Upgrade your account to access our complete question bank, master adaptive full-length tests, and see your predicted SAT score.
                  </p>
                </div>
              </div>
              <Link
                to="/sat"
                className="px-4 py-2.5 bg-primary hover:bg-accent text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0 w-fit text-center"
              >
                Upgrade Plan
              </Link>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading your dashboard...</div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatCard label="Tests Taken" value={stats?.totalTests ?? 0} icon="quiz" color="primary" />
            <StatCard label="Average Score" value={`${stats?.avgScore ?? 0}%`} icon="trending_up" color="secondary" />
            <StatCard label="Best Score" value={`${stats?.bestScore ?? 0}%`} icon="emoji_events" color="accent" />
            <StatCard label="Questions Practiced" value={stats?.practiceCount ?? 0} icon="fitness_center" color="primary" />
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-10">
            <div className="lg:col-span-1 rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-6 self-start">Predicted SAT Score</h2>
              {predicted ? (
                <>
                  <ScoreCircle score={predicted.score} label="Predicted Score" sublabel={`${predicted.range.low} – ${predicted.range.high} range`} />
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="info">{predicted.confidence}% Confidence</Badge>
                    <span className="text-xs text-on-surface-variant">Based on {predicted.basedOn} tests</span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Icon name="psychology" className="text-4xl text-on-surface-variant/40 mb-2" />
                  <p className="text-sm text-on-surface-variant">Take a Digital SAT practice test to see your predicted score</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Recent Tests</h2>
                <Link to="/dashboard/history" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">
                  View All
                </Link>
              </div>
              {recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((a: any) => (
                    <Link
                      key={a._id}
                      to={`/dashboard/sat-result/${a._id}`}
                      className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 hover:bg-surface-container-low transition-colors group"
                    >
                      <div>
                        <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                          Test #{a._id.slice(-6).toUpperCase()}
                        </div>
                        <div className="text-xs text-on-surface-variant">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={a.percentage >= 70 ? "success" : a.percentage >= 50 ? "warning" : "error"}>
                          {a.percentage}%
                        </Badge>
                        <Icon name="chevron_right" className="text-on-surface-variant text-[20px]" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Icon name="assignment" className="text-4xl text-on-surface-variant/40 mb-2" />
                  <p className="text-sm text-on-surface-variant">No tests taken yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              to="/dashboard/sat-tests"
              className="flex items-center gap-4 p-6 rounded-2xl bg-primary text-on-primary shark-shadow hover:-translate-y-1 transition-transform"
            >
              <Icon name="quiz" className="text-[28px]" />
              <div>
                <div className="font-semibold">Take a Test</div>
                <div className="text-xs text-on-primary/70">Start a practice mock test</div>
              </div>
            </Link>
            <Link
              to="/dashboard/practice"
              className="flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover:-translate-y-1 transition-transform"
            >
              <Icon name="fitness_center" className="text-[28px] text-accent" />
              <div>
                <div className="font-semibold">Practice Questions</div>
                <div className="text-xs text-on-surface-variant">Sharpen your skills</div>
              </div>
            </Link>
            <Link
              to="/dashboard/analytics"
              className="flex items-center gap-4 p-6 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shark-shadow hover:-translate-y-1 transition-transform"
            >
              <Icon name="insights" className="text-[28px] text-secondary" />
              <div>
                <div className="font-semibold">View Analytics</div>
                <div className="text-xs text-on-surface-variant">Track your progress</div>
              </div>
            </Link>
          </div>
        </>
      )}
      <PortalAccessCountdown />
    </StudentLayout>
  );
}
