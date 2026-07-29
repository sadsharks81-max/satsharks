import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { StatCard } from "../../components/ui/StatCard";
import { ScoreCircle } from "../../components/ui/ScoreCircle";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { api } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import type { PerformanceDataPoint, CategoryBreakdown, PredictedScore, DashboardStats } from "../../types";
import { stripEmojis, stripQuestionTypeTags } from "../../utils/format";

export const Route = createFileRoute("/dashboard/analytics")({
  component: Analytics,
});

function Analytics() {
  const { user, refreshUser } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [performance, setPerformance] = useState<PerformanceDataPoint[]>([]);
  const [breakdown, setBreakdown] = useState<CategoryBreakdown[]>([]);
  const [predicted, setPredicted] = useState<PredictedScore | null>(null);
  const [recentPractice, setRecentPractice] = useState<any[]>([]);
  
  // New States for Phase 4A
  const [errorStats, setErrorStats] = useState<any[]>([]);
  const [incorrectQuestions, setIncorrectQuestions] = useState<any[]>([]);
  const [timingStats, setTimingStats] = useState<any>(null);
  const [slowQuestions, setSlowQuestions] = useState<any[]>([]);
  
  const [activeTab, setActiveTab] = useState<"overview" | "errors" | "timing" | "skills">("overview");
  const [loading, setLoading] = useState(true);
  
  // Settings Modal States
  const [showSettings, setShowSettings] = useState(false);
  const [targetScoreInput, setTargetScoreInput] = useState(user?.targetScore || 1400);
  const [dailyGoalInput, setDailyGoalInput] = useState(user?.dailyGoal || 10);
  const [updatingSettings, setUpdatingSettings] = useState(false);

  // Question Modal preview
  const [selectedQuestionText, setSelectedQuestionText] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [statsRes, perfRes, catRes, predRes, errorRes, timingRes] = await Promise.all([
        api.get("/api/analytics/dashboard"),
        api.get("/api/analytics/performance"),
        api.get("/api/analytics/category-breakdown"),
        api.get("/api/analytics/predicted-score"),
        api.get("/api/analytics/error-analysis"),
        api.get("/api/analytics/timing-analysis")
      ]);
      
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentPractice(statsRes.recentPractice || []);
      }
      if (perfRes.success) setPerformance(perfRes.performance || []);
      if (catRes.success) setBreakdown(catRes.breakdown || []);
      if (predRes.success && predRes.predicted) setPredicted(predRes.predicted);
      
      if (errorRes.success) {
        setErrorStats(errorRes.errorStats || []);
        setIncorrectQuestions(errorRes.incorrectQuestions || []);
      }
      if (timingRes.success) {
        setTimingStats(timingRes.stats || null);
        setSlowQuestions(timingRes.slowQuestions || []);
      }
    } catch (err) {
      console.error("Failed to load analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingSettings(true);
    const res = await api.put("/api/users/me/settings", {
      targetScore: targetScoreInput,
      dailyGoal: dailyGoalInput,
    });
    if (res.success) {
      await refreshUser();
      setShowSettings(false);
      loadData();
    } else {
      alert(res.error || "Failed to update preferences");
    }
    setUpdatingSettings(false);
  };

  if (loading) {
    return (
      <StudentLayout activeItem="/dashboard/analytics">
        <div className="flex items-center justify-center py-24">
          <Icon name="hourglass_top" className="text-4xl text-primary animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  const totalTaken = stats?.totalTests || 0;
  const avgPercent = stats?.avgScore || 0;

  if (totalTaken === 0 && stats?.practiceCount === 0) {
    return (
      <StudentLayout activeItem="/dashboard/analytics">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Performance Analytics</h1>
          <button
            onClick={() => {
              setTargetScoreInput(user?.targetScore || 1400);
              setDailyGoalInput(user?.dailyGoal || 10);
              setShowSettings(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-outline-variant hover:bg-surface-container-low rounded-xl transition-all cursor-pointer bg-surface"
          >
            <Icon name="settings" className="text-[16px]" />
            Settings
          </button>
        </div>
        <EmptyState
          icon="insights"
          title="Analyze Your SAT Growth"
          description="Complete at least one practice question or full mock test to unlock comprehensive performance dashboards and timing insights!"
        />

        {/* Settings Modal */}
        <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Goal Settings" icon="settings" maxWidth="max-w-md">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">Target SAT Score (400 - 1600)</label>
              <input
                type="number"
                min="400"
                max="1600"
                step="10"
                value={targetScoreInput}
                onChange={(e) => setTargetScoreInput(parseInt(e.target.value))}
                className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">Daily Practice Goal (Questions / day)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={dailyGoalInput}
                onChange={(e) => setDailyGoalInput(parseInt(e.target.value))}
                className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updatingSettings}
                className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm border-none"
              >
                {updatingSettings ? "Saving..." : "Save Preferences"}
              </button>
            </div>
          </form>
        </Modal>
      </StudentLayout>
    );
  }

  // Group Categories for strong/weak section
  const strongSkills = breakdown.filter((b) => b.percentage >= 70);
  const weakSkills = breakdown.filter((b) => b.percentage < 70);

  return (
    <StudentLayout activeItem="/dashboard/analytics">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Performance Analytics</h1>
          <p className="text-on-surface-variant text-sm font-medium">Diagnose errors, monitor timing metrics, and track progress relative to your score goal</p>
        </div>
        <button
          onClick={() => {
            setTargetScoreInput(user?.targetScore || 1400);
            setDailyGoalInput(user?.dailyGoal || 10);
            setShowSettings(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold border border-outline-variant hover:bg-surface-container-low rounded-xl transition-all cursor-pointer bg-surface"
        >
          <Icon name="settings" className="text-[16px]" />
          Settings
        </button>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard label="Tests Taken" value={totalTaken} icon="quiz" color="primary" />
        <StatCard label="Average Accuracy" value={`${avgPercent}%`} icon="trending_up" color="secondary" />
        <StatCard label="Questions Solved" value={stats?.practiceCount || 0} icon="fitness_center" color="accent" />
        <StatCard label="Practice Correct" value={stats?.practiceCorrect || 0} icon="check_circle" color="primary" />
        <StatCard label="Practice Accuracy" value={`${stats?.practiceAccuracy || 0}%`} icon="target" color="secondary" />
        <StatCard label="Target SAT Score" value={user?.targetScore || 1400} icon="my_location" color="secondary" />
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-outline-variant/40 mb-8 overflow-x-auto select-none gap-2 shrink-0">
        {[
          { id: "overview", label: "Overview", icon: "insights" },
          { id: "errors", label: "Error Analysis", icon: "bug_report" },
          { id: "timing", label: "Timing Analysis", icon: "timer" },
          { id: "skills", label: "Skills Breakdown", icon: "bar_chart" },
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 pb-3.5 px-4 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer bg-transparent border-none ${
                active
                  ? "border-primary text-primary font-extrabold"
                  : "border-transparent text-on-surface-variant hover:text-on-surface hover:border-outline"
              }`}
            >
              <Icon name={t.icon} className="text-[16px]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Predicted Score Card */}
            <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow flex flex-col items-center justify-between text-center min-h-[300px]">
              <div className="w-full text-left">
                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Predicted SAT Score</h3>
                <p className="text-[10px] text-on-surface-variant mt-0.5">Based on mock difficulty weights & recency factors</p>
              </div>
              {predicted ? (
                <div className="py-6 flex flex-col items-center">
                  <ScoreCircle score={predicted.score} label="Predicted" sublabel={`${predicted.range.low} – ${predicted.range.high}`} />
                  <Badge variant="info" className="mt-4">{predicted.confidence}% Confidence Rating</Badge>
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant py-12">Take at least one mock test to generate predictions</p>
              )}
            </div>

            {/* Target vs predicted chart */}
            <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow lg:col-span-2 flex flex-col justify-between">
              <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4">Goal Comparison</h3>
              <div className="space-y-6 flex-1 flex flex-col justify-center">
                {/* Predicted Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>Estimated Predicted Score</span>
                    <span className="font-mono text-primary font-bold">{predicted?.score || "N/A"}</span>
                  </div>
                  <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${predicted ? (predicted.score / 1600) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Target Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>Target SAT Goal</span>
                    <span className="font-mono text-accent font-bold">{user?.targetScore || 1400}</span>
                  </div>
                  <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${((user?.targetScore || 1400) / 1600) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-[11px] text-on-surface-variant border-t border-outline-variant/20 pt-4 mt-4 leading-relaxed font-semibold">
                {predicted && predicted.score >= (user?.targetScore || 1400) ? (
                  <span className="text-success flex items-center gap-1">
                    <Icon name="check_circle" className="text-sm" /> Great work! You are currently on track to hit your target SAT score.
                  </span>
                ) : (
                  <span className="text-[#E08F00] flex items-center gap-1">
                    <Icon name="info" className="text-sm" /> You are {predicted ? (user?.targetScore || 1400) - predicted.score : 200} points away from your goal. Solve incorrect topics to bridge the gap.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Performance Data Point Timeline */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider">Practice Question Results</h3>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {stats?.practiceCorrect || 0} correct and {stats?.practiceIncorrect || 0} incorrect from {stats?.practiceCount || 0} attempts
                </p>
              </div>
              <Badge variant={(stats?.practiceAccuracy || 0) >= 70 ? "success" : "warning"}>
                {stats?.practiceAccuracy || 0}% accuracy
              </Badge>
            </div>
            {recentPractice.length > 0 ? (
              <div className="space-y-3">
                {recentPractice.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
                    <Icon
                      name={entry.isCorrect ? "check_circle" : "cancel"}
                      className={`mt-0.5 text-xl ${entry.isCorrect ? "text-success" : "text-error"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-sm font-semibold text-on-surface">{stripQuestionTypeTags(entry.question)}</div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-on-surface-variant">
                        <span>{entry.category}</span>
                        <span>{entry.difficulty}</span>
                        <span>{entry.timeSpent || 0}s</span>
                      </div>
                    </div>
                    <Badge variant={entry.isCorrect ? "success" : "error"}>
                      {entry.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-6 text-center text-sm text-on-surface-variant">No practice-question attempts recorded.</p>
            )}
          </div>

          {/* Performance Data Point Timeline */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-6">Mock Test History</h3>
            {performance.length > 0 ? (
              <div className="space-y-3">
                {performance.map((p, i) => {
                  const prev = i > 0 ? performance[i - 1].score : p.score;
                  const diff = p.score - prev;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-12 text-xs font-semibold text-on-surface-variant whitespace-nowrap text-right">Test #{p.index}</span>
                      <div className="flex-1 h-6 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            p.score >= 70 ? "bg-primary" : p.score >= 50 ? "bg-accent" : "bg-error"
                          }`}
                          style={{ width: `${p.score}%` }}
                        />
                      </div>
                      <span className="w-10 text-xs font-mono font-bold text-right">{p.score}%</span>
                      {i > 0 && (
                        <span className={`w-14 text-xs font-bold text-right ${diff > 0 ? "text-success" : diff < 0 ? "text-error" : "text-on-surface-variant"}`}>
                          {diff > 0 ? `+${diff}` : diff}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">No test results recorded.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "errors" && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary error counters */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-6">Error Frequency by Category</h3>
            {errorStats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {errorStats.map((stat) => (
                  <div key={stat.name} className="p-4 rounded-xl border border-outline-variant/35 bg-surface-container-low flex justify-between items-center shadow-sm">
                    <div>
                      <h4 className="text-xs font-bold text-on-surface leading-snug">{stat.name}</h4>
                      <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">{stat.section === "MATH" ? "Math" : "R&W"}</span>
                    </div>
                    <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-error/15 text-error font-mono">
                      {stat.errors} mistakes
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">No incorrect answers recorded yet. Perfect score!</p>
            )}
          </div>

          {/* Incorrect Questions Log */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-6">Mistake Logging & Review</h3>
            {incorrectQuestions.length > 0 ? (
              <div className="space-y-4">
                {incorrectQuestions.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low/20 transition-all flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="error">{q.skipped ? "Skipped" : q.difficulty}</Badge>
                          <span className="text-xs font-semibold text-primary">{q.categoryName}</span>
                          <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">· {q.sectionName}</span>
                        </div>
                        <p className="text-sm text-on-surface font-body leading-relaxed pt-2 line-clamp-2 max-w-4xl">{q.text}</p>
                      </div>
                      <button
                        onClick={() => setSelectedQuestionText(q.text + "\n\nCORRECT ANSWER: " + q.correctAnswer + "\nEXPLANATION:\n" + q.explanation)}
                        className="px-3 py-1.5 rounded-lg border border-primary hover:bg-primary hover:text-on-primary text-primary transition-colors text-xs font-bold whitespace-nowrap cursor-pointer"
                      >
                        Review Solution
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">All clear! No logged mistakes.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "timing" && (
        <div className="space-y-8 animate-fade-in">
          {/* Timing Averages Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">R&W Average Speed</h4>
                <p className="text-2xl font-mono font-extrabold text-primary mt-1">{timingStats?.rwAvg ?? 0} seconds</p>
                <span className="text-[10px] text-on-surface-variant leading-none font-semibold">Suggested: 71s / question</span>
              </div>
              <span className="p-3 bg-primary/10 text-primary rounded-xl">
                <Icon name="history_edu" className="text-2xl" />
              </span>
            </div>

            <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs text-on-surface-variant uppercase tracking-wider">Math Average Speed</h4>
                <p className="text-2xl font-mono font-extrabold text-primary mt-1">{timingStats?.mathAvg ?? 0} seconds</p>
                <span className="text-[10px] text-on-surface-variant leading-none font-semibold">Suggested: 95s / question</span>
              </div>
              <span className="p-3 bg-accent/15 text-accent rounded-xl">
                <Icon name="calculate" className="text-2xl" />
              </span>
            </div>
          </div>

          {/* Slow Questions Log */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-6">Questions Exceeding Average Timing Limits</h3>
            {slowQuestions.length > 0 ? (
              <div className="space-y-4">
                {slowQuestions.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-xl border border-outline-variant/30 bg-surface-container-lowest hover:bg-surface-container-low/20 transition-all flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error/15 text-error">
                            {q.timeSpent}s spent (Avg: {q.avgTime}s)
                          </span>
                          <span className="text-xs font-semibold text-primary">{q.categoryName}</span>
                          <span className="text-[10px] text-on-surface-variant font-mono uppercase tracking-wider">· {q.sectionName}</span>
                        </div>
                        <p className="text-sm text-on-surface font-body leading-relaxed pt-2 line-clamp-2 max-w-4xl">{q.text}</p>
                      </div>
                      <button
                        onClick={() => setSelectedQuestionText(q.text)}
                        className="px-3 py-1.5 rounded-lg border border-primary hover:bg-primary hover:text-on-primary text-primary transition-colors text-xs font-bold whitespace-nowrap cursor-pointer"
                      >
                        View Question
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">All questions answered within standard timing brackets.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "skills" && (
        <div className="space-y-8 animate-fade-in">
          {/* Strong Skills */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-success uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <Icon name="check_circle" className="text-success text-[18px]" /> Strong Areas (70%+ Accuracy)
            </h3>
            {strongSkills.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strongSkills.map((cat) => (
                  <div key={cat.category} className="p-4 rounded-xl border border-success/20 bg-success/5 flex flex-col justify-between gap-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-on-surface leading-snug">{cat.category}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-success/20 text-success rounded-md">{cat.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">Collect more mock answers to identify strong sections.</p>
            )}
          </div>

          {/* Weak Skills */}
          <div className="rounded-2xl bg-surface p-8 border border-outline-variant/40 shark-shadow">
            <h3 className="font-bold text-sm text-error uppercase tracking-wider mb-6 flex items-center gap-1.5">
              <Icon name="warning" className="text-error text-[18px]" /> Areas to Improve (&lt; 70% Accuracy)
            </h3>
            {weakSkills.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {weakSkills.map((cat) => (
                  <div key={cat.category} className="p-4 rounded-xl border border-error/20 bg-error/5 flex flex-col justify-between gap-3 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-xs text-on-surface leading-snug">{cat.category}</span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-error/20 text-error rounded-md">{cat.percentage}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-error rounded-full" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant text-center py-6">All topics maintain high accuracy! Excellent status.</p>
            )}
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Goal Settings" icon="settings" maxWidth="max-w-md">
        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">Target SAT Score (400 - 1600)</label>
            <input
              type="number"
              min="400"
              max="1600"
              step="10"
              value={targetScoreInput}
              onChange={(e) => setTargetScoreInput(parseInt(e.target.value))}
              className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant font-body">Daily Practice Goal (Questions / day)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={dailyGoalInput}
              onChange={(e) => setDailyGoalInput(parseInt(e.target.value))}
              className="w-full rounded-xl border-2 border-outline-variant/60 bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30">
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="px-4 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updatingSettings}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm border-none"
            >
              {updatingSettings ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Question Details / Explanation Modal */}
      <Modal open={selectedQuestionText !== null} onClose={() => setSelectedQuestionText(null)} title="Question Details" icon="menu_book" maxWidth="max-w-2xl">
        <div className="p-1 space-y-4">
          <p className="text-sm leading-relaxed text-on-surface whitespace-pre-wrap">{stripEmojis(stripQuestionTypeTags(selectedQuestionText))}</p>
          <div className="flex justify-end pt-4 border-t border-outline-variant/20">
            <button
              onClick={() => setSelectedQuestionText(null)}
              className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary text-xs font-bold transition-all cursor-pointer border-none"
            >
              Close Review
            </button>
          </div>
        </div>
      </Modal>
    </StudentLayout>
  );
}
