import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { ScoreCircle } from "../../components/ui/ScoreCircle";
import { Badge } from "../../components/ui/Badge";
import { Icon } from "../../components/common/Icon";
import { api, resolveImageUrl } from "../../services/api";
import { ZoomableImage } from "../../components/ui/ZoomableImage";
import type { SATTestAttempt, SATTest, Question } from "../../types";
import { renderFormattedText } from "../../utils/format";

export const Route = createFileRoute("/dashboard/sat-result/$attemptId")({
  component: SATResult,
});

function SATResult() {
  const { attemptId } = Route.useParams();
  const [attempt, setAttempt] = useState<SATTestAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    api.get(`/api/sat/attempt/${attemptId}`).then((res) => {
      if (res.success) setAttempt(res.attempt);
      setLoading(false);
    });
  }, [attemptId]);

  if (loading) {
    return (
      <StudentLayout activeItem="/dashboard/sat-tests">
        <div className="text-center py-12 text-on-surface-variant">Loading results...</div>
      </StudentLayout>
    );
  }

  if (!attempt) {
    return (
      <StudentLayout activeItem="/dashboard/sat-tests">
        <div className="text-center py-12 text-error">Result not found</div>
      </StudentLayout>
    );
  }

  const test = attempt.test as SATTest;
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  // Calculate section scores
  const rwModules = attempt.moduleAttempts.filter((ma) => {
    const mod = test?.modules?.[ma.moduleIndex];
    return ma.startedAt && mod?.section === "READING_WRITING";
  });
  const mathModules = attempt.moduleAttempts.filter((ma) => {
    const mod = test?.modules?.[ma.moduleIndex];
    return ma.startedAt && mod?.section === "MATH";
  });

  const rwCorrect = rwModules.reduce((s, m) => s + m.correctCount, 0);
  const rwTotal = rwModules.reduce((s, m) => s + m.totalQuestions, 0);
  const mathCorrect = mathModules.reduce((s, m) => s + m.correctCount, 0);
  const mathTotal = mathModules.reduce((s, m) => s + m.totalQuestions, 0);

  // Approximate SAT section scores (200-800 range per section)
  const rwScoreMapping = test?.rwScoreMapping;
  const mathScoreMapping = test?.mathScoreMapping;

  const rwScoreScaled = rwTotal > 0
    ? (rwScoreMapping && rwScoreMapping.length > rwCorrect
        ? rwScoreMapping[rwCorrect]
        : Math.round(200 + (rwCorrect / rwTotal) * 600))
    : 200;

  const mathScoreScaled = mathTotal > 0
    ? (mathScoreMapping && mathScoreMapping.length > mathCorrect
        ? mathScoreMapping[mathCorrect]
        : Math.round(200 + (mathCorrect / mathTotal) * 600))
    : 200;

  const totalScoreScaled = rwScoreScaled + mathScoreScaled;

  return (
    <StudentLayout activeItem="/dashboard/sat-tests">
      <div className="max-w-[1000px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">SAT Test Results</h1>
          <p className="text-on-surface-variant mb-4">{test?.title || "SAT Practice Test"}</p>
          
          {test?.explanationPdfUrl && (
            <div className="flex justify-center gap-3">
              <a
                href={test.explanationPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest hover:bg-surface-container-low border border-outline-variant/60 rounded-xl text-xs font-bold uppercase tracking-wider text-on-surface transition-all duration-300 shadow-sm cursor-pointer"
              >
                <Icon name="description" className="text-[16px]" />
                Explanations PDF
              </a>
            </div>
          )}
        </div>

        {/* Overall Score */}
        <div className="rounded-2xl bg-primary text-on-primary p-10 shark-shadow mb-8">
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center">
              <div className="text-6xl font-extrabold font-display">{totalScoreScaled}</div>
              <div className="text-sm text-on-primary/70 mt-1">Total Score (400–1600)</div>
            </div>
            <div className="h-16 w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-bold font-display">{rwScoreScaled}</div>
              <div className="text-sm text-on-primary/70 mt-1">Reading & Writing (200–800)</div>
            </div>
            <div className="h-16 w-px bg-white/20 hidden md:block" />
            <div className="text-center">
              <div className="text-4xl font-bold font-display">{mathScoreScaled}</div>
              <div className="text-sm text-on-primary/70 mt-1">Math (200–800)</div>
            </div>
          </div>
        </div>

        {/* Raw Score Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Reading & Writing</h3>
            <ScoreCircle score={rwTotal > 0 ? Math.round((rwCorrect / rwTotal) * 100) : 0} maxScore={100} size={140} label={`${rwCorrect} / ${rwTotal}`} sublabel="correct answers" />
          </div>
          <div className="rounded-2xl bg-surface-container-lowest p-8 shark-shadow border border-outline-variant/40 flex flex-col items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4">Math</h3>
            <ScoreCircle score={mathTotal > 0 ? Math.round((mathCorrect / mathTotal) * 100) : 0} maxScore={100} size={140} label={`${mathCorrect} / ${mathTotal}`} sublabel="correct answers" />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="text-2xl font-bold text-primary">{attempt.totalCorrect}</div>
            <div className="text-xs text-on-surface-variant mt-1">Correct</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="text-2xl font-bold text-error">{attempt.totalQuestions - attempt.totalCorrect}</div>
            <div className="text-xs text-on-surface-variant mt-1">Incorrect</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="text-2xl font-bold text-on-surface">{attempt.totalQuestions}</div>
            <div className="text-xs text-on-surface-variant mt-1">Total</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/40">
            <div className="text-2xl font-bold text-accent">{formatTime(attempt.totalTimeTaken)}</div>
            <div className="text-xs text-on-surface-variant mt-1">Time Taken</div>
          </div>
        </div>

        {/* Per-Module Breakdown */}
        <h2 className="text-xl font-bold mb-4">Module Breakdown</h2>
        <div className="space-y-4 mb-8">
          {attempt.moduleAttempts
            .filter((mod) => mod.startedAt)
            .map((mod) => {
              const idx = mod.moduleIndex;
              const moduleName = test?.modules?.[idx]?.name || `Module ${idx + 1}`;
              const isExpanded = expandedModule === idx;
              const pct = mod.totalQuestions > 0 ? Math.round((mod.correctCount / mod.totalQuestions) * 100) : 0;

            return (
              <div key={idx} className="rounded-xl bg-surface-container-lowest border border-outline-variant/40 overflow-hidden">
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : idx)}
                  className="w-full flex items-center justify-between p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">{moduleName}</span>
                    <Badge variant={pct >= 70 ? "success" : pct >= 50 ? "warning" : "error"}>
                      {mod.correctCount}/{mod.totalQuestions} ({pct}%)
                    </Badge>
                  </div>
                  <Icon name={isExpanded ? "expand_less" : "expand_more"} className="text-[24px] text-on-surface-variant" />
                </button>

                {isExpanded && (
                  <div className="border-t border-outline-variant/30 p-5 space-y-3">
                    {mod.answers.map((ans, ai) => {
                      const q = ans.question as Question;
                      if (!q || typeof q === "string") return null;

                      const isAttempted = !!ans.selectedAnswer;
                      let cardStyle = "border-outline-variant/40 bg-surface-container-low/20";
                      let badgeText = "Not Attempted";
                      let badgeVariant: "success" | "error" | "warning" | "info" | "default" = "warning";

                      if (isAttempted) {
                        if (ans.isCorrect) {
                          cardStyle = "border-primary/30 bg-primary/5";
                          badgeText = "Correct";
                          badgeVariant = "success";
                        } else {
                          cardStyle = "border-error/30 bg-error/5";
                          badgeText = "Incorrect";
                          badgeVariant = "error";
                        }
                      }

                      return (
                        <div
                          key={ai}
                          className={`rounded-xl p-6 border transition-all duration-300 hover:shadow-sm ${cardStyle}`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="font-mono text-xs text-on-surface-variant font-semibold">Question {ai + 1}</span>
                            <Badge variant={badgeVariant}>
                              {badgeText}
                            </Badge>
                          </div>
                           {q.imageUrl && (
                            <ZoomableImage src={resolveImageUrl(q.imageUrl)} className="mb-4" />
                          )}
                          <p className="text-sm mb-4 leading-relaxed text-on-surface whitespace-pre-wrap">{renderFormattedText(q.text)}</p>
                          
                          {q.options && q.options.length > 0 ? (
                            <div className="space-y-2">
                              {q.options.map((opt) => {
                                const isSelected = ans.selectedAnswer === opt.label;
                                const isCorrectOption = q.correctAnswer === opt.label;
                                return (
                                  <div
                                    key={opt.label}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors border ${
                                      isCorrectOption
                                        ? "bg-primary/15 text-primary font-semibold border-primary/30"
                                        : isSelected && !ans.isCorrect
                                        ? "bg-error/15 text-error border-error/30"
                                        : "text-on-surface-variant border-transparent"
                                    }`}
                                  >
                                    <span className="font-bold w-6">{opt.label}.</span>
                                    <span>{renderFormattedText(opt.text)}</span>
                                    {isCorrectOption && <Icon name="check_circle" className="ml-auto text-primary text-[18px]" />}
                                    {isSelected && !isCorrectOption && <Icon name="cancel" className="ml-auto text-error text-[18px]" />}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            /* Display answers for student-produced responses */
                            <div className="space-y-2 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 text-sm max-w-md">
                              <div className="flex justify-between items-center">
                                <span className="text-on-surface-variant font-medium">Your Answer:</span>
                                <span className={`font-mono font-bold ${!isAttempted ? "text-on-surface-variant italic" : ans.isCorrect ? "text-primary" : "text-error"}`}>
                                  {ans.selectedAnswer || "Not Attempted"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center border-t border-outline-variant/30 pt-2">
                                <span className="text-on-surface-variant font-medium">Correct Answer:</span>
                                <span className="font-mono font-bold text-primary">
                                  {q.correctAnswer}
                                </span>
                              </div>
                            </div>
                          )}

                          {q.explanation && (
                            <div className="mt-4 p-3 rounded-lg bg-surface-container-low text-xs text-on-surface-variant border border-outline-variant/20">
                              <strong className="block mb-1 text-on-surface">Explanation:</strong> 
                              <div className="whitespace-pre-wrap leading-relaxed">{renderFormattedText(q.explanation)}</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4">
          <Link
            to="/dashboard/sat-tests"
            className="flex-1 py-3 rounded-xl border border-outline-variant text-center text-sm font-semibold hover:bg-surface-container-low transition-colors"
          >
            Back to SAT Tests
          </Link>
        </div>
      </div>
    </StudentLayout>
  );
}
