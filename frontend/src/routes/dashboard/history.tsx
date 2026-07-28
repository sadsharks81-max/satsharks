import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import type { TestAttempt } from "../../types";

export const Route = createFileRoute("/dashboard/history")({
  component: TestHistory,
});

function TestHistory() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchHistory = async (p: number) => {
    setLoading(true);
    const res = await api.get(`/api/analytics/history?page=${p}&limit=15`);
    if (res.success) {
      setAttempts(res.attempts || []);
      setTotalPages(res.pagination?.pages || 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory(page);
  }, [page]);

  const sectionLabel = (s: string) => {
    if (s === "READING_WRITING") return "R&W";
    if (s === "MATH") return "Math";
    return "Full";
  };

  return (
    <StudentLayout activeItem="/dashboard/history">
      <h1 className="text-3xl font-bold mb-2">Test History</h1>
      <p className="text-on-surface-variant mb-8">Review all your completed diagnostic tests</p>

      {loading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading history...</div>
      ) : attempts.length === 0 ? (
        <EmptyState
          icon="history"
          title="No test history yet"
          description="Complete a Digital SAT practice test to see your results here"
          action={
            <Link
              to="/dashboard/sat-tests"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary hover:bg-accent transition-colors"
            >
              <Icon name="quiz" className="text-[18px]" /> Take a Test
            </Link>
          }
        />
      ) : (
        <>
          <div className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden shark-shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/40 text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="p-4 font-semibold">Test</th>
                  <th className="p-4 font-semibold">Section</th>
                  <th className="p-4 font-semibold">Score</th>
                  <th className="p-4 font-semibold">Result</th>
                  <th className="p-4 font-semibold">Time</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {attempts.map((a: any) => (
                  <tr key={a._id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4 font-semibold text-sm">
                      {a.test?.title || `Test #${a._id.slice(-6).toUpperCase()}`}
                    </td>
                    <td className="p-4">
                      <Badge variant="info">{sectionLabel(a.test?.section || "FULL")}</Badge>
                    </td>
                    <td className="p-4 font-mono font-bold text-sm">
                      {a.totalCorrect ?? a.correctCount ?? 0}/{a.totalQuestions}
                    </td>
                    <td className="p-4">
                      <Badge variant={a.percentage >= 70 ? "success" : a.percentage >= 50 ? "warning" : "error"}>
                        {a.percentage}%
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {Math.floor((a.totalTimeTaken ?? a.timeTaken ?? 0) / 60)}m {(a.totalTimeTaken ?? a.timeTaken ?? 0) % 60}s
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {new Date(a.completedAt || a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/dashboard/sat-result/${a._id}`}
                        className="text-primary hover:underline text-sm font-semibold"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-on-surface-variant px-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-outline-variant text-sm disabled:opacity-30 hover:bg-surface-container-low transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </StudentLayout>
  );
}
