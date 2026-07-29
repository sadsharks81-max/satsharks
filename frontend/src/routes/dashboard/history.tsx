import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Badge } from "../../components/ui/Badge";
import { EmptyState } from "../../components/ui/EmptyState";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import { stripQuestionTypeTags } from "../../utils/format";

export const Route = createFileRoute("/dashboard/history")({ component: TestHistory });

type HistoryTab = "ALL" | "FULL" | "PRACTICE" | "VOCAB";

function TestHistory() {
  const [data, setData] = useState<any>({ fullTests: [], practice: [], vocabulary: [] });
  const [tab, setTab] = useState<HistoryTab>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/analytics/history/all").then((res) => {
      if (res.success) setData(res);
      setLoading(false);
    });
  }, []);

  const rows = [
    ...data.fullTests.map((item: any) => ({ ...item, kind: "FULL", date: item.completedAt })),
    ...data.practice.map((item: any) => ({ ...item, kind: "PRACTICE", date: item.createdAt })),
    ...data.vocabulary.map((item: any) => ({ ...item, kind: "VOCAB", date: item.updatedAt })),
  ]
    .filter((item) => tab === "ALL" || item.kind === tab)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <StudentLayout activeItem="/dashboard/history">
      <h1 className="text-3xl font-bold mb-2">Test History</h1>
      <p className="text-on-surface-variant mb-6">Review full tests, individual practice, and vocabulary progress.</p>
      <div className="mb-6 flex flex-wrap gap-2">
        {(["ALL", "FULL", "PRACTICE", "VOCAB"] as HistoryTab[]).map((item) => (
          <button key={item} onClick={() => setTab(item)}
            className={`rounded-xl px-4 py-2 text-xs font-bold ${tab === item ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface"}`}>
            {item === "ALL" ? "All History" : item === "FULL" ? "Full Practice Tests" : item === "PRACTICE" ? "Practice Questions" : "Vocab Tests"}
          </button>
        ))}
      </div>
      {loading ? <div className="py-12 text-center">Loading history...</div> : rows.length === 0 ? (
        <EmptyState icon="history" title="No history in this category" description="Complete an activity to see it here." />
      ) : (
        <div className="space-y-3">
          {rows.map((item: any) => {
            const total = item.kind === "FULL" ? item.totalQuestions : item.kind === "VOCAB" ? item.totalAttempts : 1;
            const correct = item.kind === "FULL" ? item.totalCorrect : item.kind === "VOCAB" ? item.totalCorrect : Number(item.correct);
            const percentage = item.kind === "FULL" ? item.percentage : item.kind === "VOCAB" ? item.percentage : Number(item.correct) * 100;
            return (
              <div key={`${item.kind}-${item._id}`} className="flex flex-wrap items-center gap-4 rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
                <Icon name={item.kind === "FULL" ? "quiz" : item.kind === "PRACTICE" ? "exercise" : "spellcheck"} className="text-2xl text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{item.test?.title || item.title}</div>
                  {item.question && <div className="mt-1 line-clamp-1 text-xs text-on-surface-variant">{stripQuestionTypeTags(item.question)}</div>}
                  <div className="mt-1 text-xs text-on-surface-variant">{new Date(item.date).toLocaleString()}</div>
                </div>
                <Badge variant={percentage >= 70 ? "success" : percentage >= 50 ? "warning" : "error"}>{correct}/{total}, {percentage}%</Badge>
                <span className="text-xs font-mono text-on-surface-variant">
                  {Math.floor((item.totalTimeTaken ?? item.timeSpent ?? 0) / 60)}m {(item.totalTimeTaken ?? item.timeSpent ?? 0) % 60}s
                </span>
                {item.kind === "FULL" && (
                  <Link to={`/dashboard/sat-result/${item._id}` as any} className="text-sm font-bold text-primary hover:underline">Review</Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </StudentLayout>
  );
}
