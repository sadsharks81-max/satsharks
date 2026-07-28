import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { Icon } from "../../components/common/Icon";
import { Badge } from "../../components/ui/Badge";
import { api, resolveImageUrl } from "../../services/api";
import { ZoomableImage } from "../../components/ui/ZoomableImage";
import { useAuth } from "../../hooks/useAuth";
import { SecurityWrapper } from "../../components/common/SecurityWrapper";
import { ReportIssueModal } from "../../components/common/ReportIssueModal";
import type { SATTest, SATModule, Question } from "../../types";
import { renderFormattedText } from "../../utils/format";

export const Route = createFileRoute("/dashboard/sat-runner/$attemptId")({
  component: SATRunner,
});

const MathFraction = ({ num, den }: { num: ReactNode; den: ReactNode }) => (
  <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-[10px] leading-none">
    <span className="border-b border-current pb-0.5 px-0.5">{num}</span>
    <span className="pt-0.5 px-0.5">{den}</span>
  </span>
);

interface LocalAnswer {
  question: string;
  selectedAnswer: string | null;
  markedForReview: boolean;
  timeSpent: number;
}

// Section Directions Content
const rwDirections = (
  <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
    <p className="font-bold text-on-surface text-base">Reading and Writing Section Directions</p>
    <p>The questions in this section address a number of important reading and writing skills. Each question includes one or more passages, which may include a table or graph. Read each passage and question carefully, and then choose the best answer to the question based on the passage(s).</p>
    <p>All questions in this section are multiple-choice with four answer choices. Each question has a single best answer.</p>
  </div>
);

const mathDirections = (
  <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed max-h-[400px] overflow-y-auto pr-2">
    <p className="font-bold text-on-surface text-base">Math Section Directions</p>
    <p>The questions in this section address a number of important math skills.</p>
    <p>Use of a calculator is permitted for all questions. A reference sheet, calculator, and these directions can be accessed throughout the test.</p>
    <p className="font-semibold text-on-surface">Unless otherwise indicated:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>All variables and expressions represent real numbers.</li>
      <li>Figures provided are drawn to scale.</li>
      <li>All figures lie in a plane.</li>
      <li>The domain of a given function f is the set of all real numbers x for which f(x) is a real number.</li>
    </ul>
    <p className="font-semibold text-on-surface">For multiple-choice questions:</p>
    <p>Solve each problem and choose the correct answer from choices provided. Each multiple-choice question has a single correct answer.</p>
    <p className="font-semibold text-on-surface">For student-produced response questions:</p>
    <p>Solve each problem and enter your answer as described below:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>If you find more than one correct answer, enter only one answer.</li>
      <li>You can enter up to 5 characters for a positive answer and up to 6 characters (including the negative sign) for a negative answer.</li>
      <li>If your answer is a fraction that doesn't fit in the provided space, enter the decimal equivalent.</li>
      <li>If your answer is a decimal that doesn't fit in the provided space, enter it by truncating or rounding at the fourth digit.</li>
      <li>If your answer is a mixed number (such as 3½), enter it as an improper fraction (7/2) or its decimal equivalent (3.5).</li>
      <li>Don't enter symbols such as a percent sign, comma, or dollar sign.</li>
    </ul>
  </div>
);

function SATRunner() {
  const { attemptId } = Route.useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState<SATTest | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, LocalAnswer[]>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [phase, setPhase] = useState<"MODULE" | "BREAK" | "LOADING" | "FINISHED">("LOADING");
  const [breakTimeLeft, setBreakTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [showTime, setShowTime] = useState(true);
  const { user } = useAuth();
  const [showDirectionsModal, setShowDirectionsModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load attempt + test on mount
  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/api/sat/attempt/${attemptId}`);
      if (!res.success) return;

      const attempt = res.attempt;
      const testData = attempt.test as SATTest;
      setTest(testData);
      setCurrentModuleIndex(attempt.currentModuleIndex);

      // Restore answers from attempt
      const restored: Record<number, LocalAnswer[]> = {};
      for (const ma of attempt.moduleAttempts) {
        restored[ma.moduleIndex] = ma.answers.map((a: any) => ({
          question: typeof a.question === "object" ? a.question._id : a.question,
          selectedAnswer: a.selectedAnswer,
          markedForReview: a.markedForReview || false,
          timeSpent: a.timeSpent || 0,
        }));
      }
      setAnswers(restored);

      if (attempt.status === "ON_BREAK") {
        setPhase("BREAK");
        const breakElapsed = attempt.breakStartedAt
          ? Math.floor((Date.now() - new Date(attempt.breakStartedAt).getTime()) / 1000)
          : 0;
        setBreakTimeLeft(Math.max(0, testData.breakDurationMinutes * 60 - breakElapsed));
      } else if (attempt.status === "IN_PROGRESS") {
        setPhase("MODULE");
        const mod = testData.modules[attempt.currentModuleIndex];
        const modAttempt = attempt.moduleAttempts[attempt.currentModuleIndex];
        if (mod) {
          if (modAttempt?.startedAt) {
            const elapsed = Math.floor(
              (Date.now() - new Date(modAttempt.startedAt).getTime()) / 1000
            );
            if (elapsed < 0 || elapsed > mod.timeLimitMinutes * 60 || elapsed < 5) {
              setTimeLeft(mod.timeLimitMinutes * 60);
            } else {
              setTimeLeft(mod.timeLimitMinutes * 60 - elapsed);
            }
          } else {
            setTimeLeft(mod.timeLimitMinutes * 60);
          }
        }
      } else if (attempt.status === "COMPLETED") {
        setPhase("FINISHED");
      }
    };
    load();
  }, [attemptId]);

  // Module countdown timer
  useEffect(() => {
    if (phase !== "MODULE" || timeLeft <= 0) return;
    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleModuleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  // Break countdown timer
  useEffect(() => {
    if (phase !== "BREAK" || breakTimeLeft <= 0) return;
    const timer = setTimeout(() => {
      setBreakTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [phase, breakTimeLeft]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (phase !== "MODULE") return;
    autoSaveTimer.current = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [phase, currentModuleIndex, answers]);

  const saveProgress = useCallback(async () => {
    const modAnswers = answers[currentModuleIndex] || [];
    await api.post(`/api/sat/attempt/${attemptId}/save`, {
      moduleIndex: currentModuleIndex,
      answers: modAnswers,
    });
  }, [answers, currentModuleIndex, attemptId]);

  const handleModuleTimeUp = useCallback(async () => {
    await completeCurrentModule();
  }, [currentModuleIndex, answers, attemptId]);

  const completeCurrentModule = async () => {
    if (submitting) return;
    setSubmitting(true);

    const modAnswers = answers[currentModuleIndex] || [];
    const res = await api.post(`/api/sat/attempt/${attemptId}/complete-module`, {
      moduleIndex: currentModuleIndex,
      answers: modAnswers,
    });

    if (res.success) {
      const attempt = res.attempt;
      if (attempt.status === "ON_BREAK") {
        setPhase("BREAK");
        setBreakTimeLeft((test?.breakDurationMinutes || 10) * 60);
        setCurrentModuleIndex(attempt.currentModuleIndex);
        setCurrentQuestionIndex(0);
      } else if (attempt.status === "COMPLETED") {
        setPhase("FINISHED");
      } else {
        // Next module
        setCurrentModuleIndex(attempt.currentModuleIndex);
        setCurrentQuestionIndex(0);
        const nextMod = test?.modules[attempt.currentModuleIndex];
        if (nextMod) setTimeLeft(nextMod.timeLimitMinutes * 60);
        setPhase("MODULE");
      }
    }
    setSubmitting(false);
  };

  const handleEndBreak = async () => {
    const res = await api.post(`/api/sat/attempt/${attemptId}/end-break`, {});
    if (res.success) {
      setPhase("MODULE");
      const nextMod = test?.modules[currentModuleIndex];
      if (nextMod) setTimeLeft(nextMod.timeLimitMinutes * 60);
      setCurrentQuestionIndex(0);
    }
  };

  const handleSubmitAll = async () => {
    if (!confirm("Are you sure you want to submit the entire test? This cannot be undone.")) return;
    setSubmitting(true);
    const res = await api.post(`/api/sat/attempt/${attemptId}/submit`, {});
    if (res.success) {
      navigate({ to: `/dashboard/sat-result/${attemptId}` });
    }
    setSubmitting(false);
  };

  const selectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => {
      const modAnswers = [...(prev[currentModuleIndex] || [])];
      const idx = modAnswers.findIndex((a) => a.question === questionId);
      if (idx >= 0) {
        modAnswers[idx] = { ...modAnswers[idx], selectedAnswer: answer };
      } else {
        modAnswers.push({ question: questionId, selectedAnswer: answer, markedForReview: false, timeSpent: 0 });
      }
      return { ...prev, [currentModuleIndex]: modAnswers };
    });
  };

  const toggleReview = (questionId: string) => {
    setAnswers((prev) => {
      const modAnswers = [...(prev[currentModuleIndex] || [])];
      const idx = modAnswers.findIndex((a) => a.question === questionId);
      if (idx >= 0) {
        modAnswers[idx] = { ...modAnswers[idx], markedForReview: !modAnswers[idx].markedForReview };
      } else {
        modAnswers.push({ question: questionId, selectedAnswer: null, markedForReview: true, timeSpent: 0 });
      }
      return { ...prev, [currentModuleIndex]: modAnswers };
    });
  };

  const getAnswer = (questionId: string): LocalAnswer | undefined => {
    return (answers[currentModuleIndex] || []).find((a) => a.question === questionId);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (phase === "LOADING" || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Icon name="hourglass_top" className="text-5xl text-primary mb-4 animate-pulse" />
          <div className="text-on-surface-variant font-semibold">Loading your SAT test...</div>
        </div>
      </div>
    );
  }

  if (phase === "FINISHED") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <Icon name="check_circle" className="text-6xl text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Test Submitted</h1>
          <p className="text-on-surface-variant mb-6">Your SAT practice test has been submitted and scored.</p>
          <button
            onClick={() => navigate({ to: `/dashboard/sat-result/${attemptId}` })}
            className="btn-shimmer bg-primary text-on-primary px-8 py-3 rounded-xl font-semibold hover:bg-accent transition-colors cursor-pointer"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  // --- BREAK SCREEN ---
  if (phase === "BREAK") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-lg p-10 rounded-2xl bg-surface-container-lowest shark-shadow border border-outline-variant/40">
          <Icon name="coffee" className="text-6xl text-accent mb-4" />
          <h1 className="text-3xl font-bold mb-2">Break Time</h1>
          <p className="text-on-surface-variant mb-6">
            You've completed the Reading & Writing section. Take a 10-minute break before starting Math.
          </p>
          <div className="text-5xl font-mono font-bold text-primary mb-8">
            {formatTime(breakTimeLeft)}
          </div>
          <div className="space-y-3">
            <button
              onClick={handleEndBreak}
              className="w-full btn-shimmer bg-primary text-on-primary py-3.5 rounded-xl font-semibold hover:bg-accent transition-colors cursor-pointer"
            >
              Resume Test , Start Math Section
            </button>
            <p className="text-xs text-on-surface-variant">You can resume early or wait for the timer</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MODULE SCREEN ---
  const currentModule: SATModule = test.modules[currentModuleIndex];
  const questions: Question[] = currentModule?.questions || [];
  const q = questions[currentQuestionIndex];
  const currentAnswer = q ? getAnswer(q._id) : undefined;
  const answeredCount = (answers[currentModuleIndex] || []).filter((a) => a.selectedAnswer).length;
  const reviewCount = (answers[currentModuleIndex] || []).filter((a) => a.markedForReview).length;
  const isWarning = timeLeft < 120 && timeLeft > 0;
  const isLastModule = currentModuleIndex === test.modules.length - 1;

  const getRWTextSplit = (text: string) => {
    const newlineIdx = text.lastIndexOf("\n");
    if (newlineIdx !== -1) {
      return {
        passage: text.substring(0, newlineIdx).trim(),
        prompt: text.substring(newlineIdx + 1).trim(),
      };
    }
    return {
      passage: text,
      prompt: "",
    };
  };

  const isRW = currentModule.section === "READING_WRITING";
  const rwSplit = q ? getRWTextSplit(q.text) : { passage: "", prompt: "" };
  const showMathTools = currentModule.section === "MATH";

  return (
    <SecurityWrapper>
      <div className="h-screen bg-background text-on-background flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/40 px-3 sm:px-6 py-2.5">
        <div className="max-w-[1400px] mx-auto flex flex-wrap md:grid md:grid-cols-3 items-center justify-between gap-2 w-full relative">
          <div className="flex items-center gap-2 sm:gap-4 justify-self-start">
            <h1 className="font-bold text-xs sm:text-sm text-on-surface whitespace-nowrap">
              {currentModule.name.replace(/\s*-\s*(Easier|Harder)/i, "")}
            </h1>
            <button
              onClick={() => setShowDirectionsModal(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-lg border border-outline-variant hover:bg-surface-container-low transition-colors text-[10px] sm:text-xs font-semibold cursor-pointer"
            >
              <Icon name="info" className="text-[12px] sm:text-[14px]" />
              <span className="hidden xs:inline">Directions</span>
            </button>
          </div>

          {/* Center Timer */}
          <div className="flex flex-col items-center gap-1 justify-self-center">
            <div className={`flex items-center gap-2 font-mono text-base font-bold min-w-[70px] justify-center transition-opacity ${showTime ? "text-primary opacity-100" : "text-transparent opacity-0 pointer-events-none select-none"
              } ${isWarning && showTime ? "text-error animate-pulse" : ""}`}>
              <Icon name="timer" className="text-[18px]" />
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={() => setShowTime(!showTime)}
              className="px-3 py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-[10px] font-bold tracking-wider uppercase cursor-pointer transition-colors border-none"
            >
              {showTime ? "Hide" : "Show"}
            </button>
          </div>

          {/* Guidelines Tool Buttons */}
          <div className="flex items-center gap-2 justify-self-end">
            {showMathTools && (
              <>
                <button
                  onClick={() => {
                    if (showCalculator) {
                      setShowCalculator(false);
                    } else {
                      setShowCalculator(true);
                      setShowReferenceModal(false);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-semibold cursor-pointer ${
                    showCalculator
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <Icon name="calculate" className="text-[16px]" />
                  <span className="hidden sm:inline">Calculator</span>
                </button>
                <button
                  onClick={() => {
                    if (showReferenceModal) {
                      setShowReferenceModal(false);
                    } else {
                      setShowReferenceModal(true);
                      setShowCalculator(false);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-semibold cursor-pointer ${
                    showReferenceModal
                      ? "bg-primary text-on-primary border-primary shadow-sm"
                      : "border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  <Icon name="functions" className="text-[16px]" />
                  <span className="hidden sm:inline">Reference</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-surface-container-high">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex w-full min-h-0 bg-background overflow-hidden relative">
        {/* Math Tools Collapsible Side Panel */}
        {showMathTools && (showCalculator || showReferenceModal) && (
          <div className="w-[38%] min-w-[340px] max-w-[550px] border-r border-outline-variant/40 flex flex-col h-full bg-surface-container-lowest animate-slide-in-left">
            {/* Tabs Header */}
            <div className="bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex">
                <button
                  onClick={() => {
                    setShowCalculator(true);
                    setShowReferenceModal(false);
                  }}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
                    showCalculator
                      ? "border-primary text-primary bg-surface-container-lowest"
                      : "border-transparent text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Icon name="calculate" className="text-[16px]" />
                  <span>Calculator</span>
                </button>
                <button
                  onClick={() => {
                    setShowReferenceModal(true);
                    setShowCalculator(false);
                  }}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 flex items-center gap-1.5 cursor-pointer transition-all ${
                    showReferenceModal
                      ? "border-primary text-primary bg-surface-container-lowest"
                      : "border-transparent text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  <Icon name="functions" className="text-[16px]" />
                  <span>Reference Sheet</span>
                </button>
              </div>
              <button
                onClick={() => {
                  setShowCalculator(false);
                  setShowReferenceModal(false);
                }}
                className="p-1.5 mr-2 rounded hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors"
                title="Close Tools"
              >
                <Icon name="close" className="text-[18px]" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 min-h-0 relative">
              {showCalculator && (
                <div className="w-full h-full bg-white relative">
                  <iframe
                    src="https://www.desmos.com/testing/cb-digital-sat/graphing"
                    className="w-full h-full border-0 absolute inset-0"
                    title="Desmos Graphing Calculator"
                  />
                </div>
              )}
              {showReferenceModal && (
                <div className="w-full h-full overflow-y-auto p-5 scroll-smooth bg-surface-container-lowest space-y-6">
                  {/* Formula Cards Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Circle */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Circle</h4>
                        <div className="text-xs text-on-surface-variant space-y-1">
                          <p>Area: A = πr<sup>2</sup></p>
                          <p>Circumference: C = 2πr</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <circle cx="50" cy="50" r="40" />
                            <line x1="50" y1="50" x2="90" y2="50" strokeDasharray="3" />
                            <circle cx="50" cy="50" r="2" className="fill-primary stroke-none" />
                          </g>
                          <text x="68" y="40" className="fill-primary stroke-none text-xs font-sans font-normal">r</text>
                        </svg>
                      </div>
                    </div>

                    {/* Rectangle */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Rectangle</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Area: A = lw</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 70" className="w-28 h-20 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <rect x="10" y="10" width="80" height="50" />
                          </g>
                          <text x="50" y="69" className="fill-primary stroke-none text-xs font-sans font-normal">l</text>
                          <text x="95" y="38" className="fill-primary stroke-none text-xs font-sans font-normal">w</text>
                        </svg>
                      </div>
                    </div>

                    {/* Triangle */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Triangle</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Area: A = <MathFraction num="1" den="2" />bh</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 80" className="w-26 h-20 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <polygon points="50,10 10,70 90,70" />
                            <line x1="50" y1="10" x2="50" y2="70" strokeDasharray="3" />
                          </g>
                          <text x="50" y="79" className="fill-primary stroke-none text-xs font-sans font-normal">b</text>
                          <text x="55" y="45" className="fill-primary stroke-none text-xs font-sans font-normal">h</text>
                        </svg>
                      </div>
                    </div>

                    {/* Right Triangle */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Right Triangle</h4>
                        <div className="text-xs text-on-surface-variant space-y-1">
                          <p className="font-semibold">Pythagorean Theorem:</p>
                          <p>c<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup></p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 80" className="w-26 h-20 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <polygon points="20,10 20,70 80,70" />
                            <rect x="20" y="62" width="8" height="8" className="stroke-primary/50" />
                          </g>
                          <text x="10" y="45" className="fill-primary stroke-none text-xs font-sans font-normal">a</text>
                          <text x="50" y="79" className="fill-primary stroke-none text-xs font-sans font-normal">b</text>
                          <text x="54" y="40" className="fill-primary stroke-none text-xs font-sans font-normal">c</text>
                        </svg>
                      </div>
                    </div>

                    {/* Special Right Triangles */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between col-span-2">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Special Right Triangles</h4>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 240 120" className="w-full max-w-[420px] h-36 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            {/* 30-60-90 */}
                            <polygon points="30,15 30,105 100,105" />
                            <rect x="30" y="93" width="12" height="12" className="stroke-primary/50" />
                            
                            {/* 45-45-90 */}
                            <polygon points="150,30 150,105 225,105" />
                            <rect x="150" y="93" width="12" height="12" className="stroke-primary/50" />
                          </g>
                          
                          {/* Parameter Texts */}
                          <g className="fill-primary stroke-none text-[11px] font-sans font-normal">
                            <text x="15" y="65">x</text>
                            <text x="54" y="120">x√3</text>
                            <text x="72" y="58">2x</text>
                            <text x="135" y="72">s</text>
                            <text x="182" y="120">s</text>
                            <text x="195" y="64">s√2</text>
                          </g>
                          
                          {/* Angle Texts */}
                          <g className="fill-primary stroke-none text-[9.5px] font-sans font-normal">
                            <text x="79" y="99">60°</text>
                            <text x="32.5" y="38">30°</text>
                            <text x="198" y="99">45°</text>
                            <text x="154" y="52">45°</text>
                          </g>
                        </svg>
                      </div>
                    </div>

                    {/* Rectangular Solid */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Rectangular Solid</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Volume: V = lwh</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 80" className="w-28 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <rect x="10" y="30" width="55" height="35" />
                            <polygon points="10,30 25,15 80,15 65,30" />
                            <polygon points="65,30 80,15 80,50 65,65" />
                            <line x1="10" y1="65" x2="25" y2="50" strokeDasharray="3" />
                            <line x1="25" y1="50" x2="80" y2="50" strokeDasharray="3" />
                            <line x1="25" y1="50" x2="25" y2="15" strokeDasharray="3" />
                          </g>
                          <text x="35" y="76" className="fill-primary stroke-none text-xs font-sans font-normal">l</text>
                          <text x="78" y="60" className="fill-primary stroke-none text-xs font-sans font-normal">w</text>
                          <text x="85" y="35" className="fill-primary stroke-none text-xs font-sans font-normal">h</text>
                        </svg>
                      </div>
                    </div>

                    {/* Cylinder */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Cylinder</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Volume: V = πr<sup>2</sup>h</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 90" className="w-26 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <ellipse cx="50" cy="20" rx="30" ry="10" />
                            <path d="M 20 20 L 20 70 A 30 10 0 0 0 80 70 L 80 20" />
                            <path d="M 20 70 A 30 10 0 0 1 80 70" strokeDasharray="3" />
                            <line x1="50" y1="20" x2="80" y2="20" strokeDasharray="3" />
                          </g>
                          <text x="65" y="14" className="fill-primary stroke-none text-xs font-sans font-normal">r</text>
                          <text x="86" y="50" className="fill-primary stroke-none text-xs font-sans font-normal">h</text>
                        </svg>
                      </div>
                    </div>

                    {/* Sphere */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Sphere</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Volume: V = <MathFraction num="4" den="3" />πr<sup>3</sup></p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 100" className="w-24 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <circle cx="50" cy="50" r="40" />
                            <ellipse cx="50" cy="50" rx="40" ry="12" strokeDasharray="3" />
                            <line x1="50" y1="50" x2="90" y2="50" strokeDasharray="3" />
                          </g>
                          <text x="70" y="40" className="fill-primary stroke-none text-xs font-sans font-normal">r</text>
                        </svg>
                      </div>
                    </div>

                    {/* Cone */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Cone</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Volume: V = <MathFraction num="1" den="3" />πr<sup>2</sup>h</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 90" className="w-26 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <ellipse cx="50" cy="80" rx="30" ry="10" />
                            <line x1="50" y1="10" x2="20" y2="80" />
                            <line x1="50" y1="10" x2="80" y2="80" />
                            <line x1="50" y1="10" x2="50" y2="80" strokeDasharray="3" />
                            <line x1="50" y1="80" x2="80" y2="80" strokeDasharray="3" />
                          </g>
                          <text x="65" y="89" className="fill-primary stroke-none text-xs font-sans font-normal">r</text>
                          <text x="42" y="45" className="fill-primary stroke-none text-xs font-sans font-normal">h</text>
                        </svg>
                      </div>
                    </div>

                    {/* Pyramid */}
                    <div className="p-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-low flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-on-surface mb-2">Pyramid</h4>
                        <div className="text-xs text-on-surface-variant">
                          <p>Volume: V = <MathFraction num="1" den="3" />lwh</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-center py-2">
                        <svg viewBox="0 0 100 80" className="w-26 h-24 fill-none">
                          <g className="stroke-primary stroke-[1.25]">
                            <polygon points="50,10 15,65 65,65" />
                            <polygon points="50,10 65,65 85,50" />
                            <line x1="15" y1="65" x2="35" y2="50" strokeDasharray="3" />
                            <line x1="35" y1="50" x2="85" y2="50" strokeDasharray="3" />
                            <line x1="50" y1="10" x2="35" y2="50" strokeDasharray="3" />
                            <line x1="50" y1="10" x2="50" y2="58" strokeDasharray="3" />
                          </g>
                          <text x="38" y="74" className="fill-primary stroke-none text-xs font-sans font-normal">l</text>
                          <text x="81" y="61" className="fill-primary stroke-none text-xs font-sans font-normal">w</text>
                          <text x="60" y="42" className="fill-primary stroke-none text-xs font-sans font-normal">h</text>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Instructions Panel */}
                  <div className="border-t border-outline-variant/40 pt-4 text-xs text-on-surface-variant space-y-2 font-semibold">
                    <p>• The number of degrees of arc in a circle is 360.</p>
                    <p>• The number of radians of arc in a circle is 2π.</p>
                    <p>• The sum of the measures in degrees of the angles of a triangle is 180.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Question Area */}
        <div className="flex-1 flex justify-center min-h-0 overflow-hidden">
          {q && (
            isRW ? (
              /* Split Screen for Reading & Writing */
              <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-5 h-full min-h-0 overflow-hidden">
                {/* Left Column: Passage */}
                <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
                  <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Passage</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {q.imageUrl && (
                      <ZoomableImage src={resolveImageUrl(q.imageUrl)} className="mb-4" />
                    )}
                    <p className="text-[15px] leading-relaxed text-on-surface whitespace-pre-wrap">{renderFormattedText(rwSplit.passage)}</p>
                  </div>
                </div>

                {/* Right Column: Question Prompt & Options */}
                <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
                  <div className="bg-surface-container-low px-5 py-2.5 border-b border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 bg-primary text-on-primary rounded flex items-center justify-center text-xs font-bold">
                        {currentQuestionIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Question</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReview(q._id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${currentAnswer?.markedForReview
                            ? "bg-accent text-primary"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                      >
                        <Icon name={currentAnswer?.markedForReview ? "flag" : "outlined_flag"} className="text-[14px]" />
                        <span>{currentAnswer?.markedForReview ? "Flagged" : "Flag"}</span>
                      </button>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                        title="Report Issue"
                      >
                        <Icon name="report" className="text-[14px]" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    {rwSplit.prompt && (
                      <p className="text-[15px] font-semibold text-on-surface leading-relaxed mb-5 whitespace-pre-wrap">{renderFormattedText(rwSplit.prompt)}</p>
                    )}

                    {q.options && q.options.length > 0 && (
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const selected = currentAnswer?.selectedAnswer === opt.label;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => selectAnswer(q._id, opt.label)}
                              className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer ${selected
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low"
                                }`}
                            >
                              <span
                                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${selected
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container-high text-on-surface"
                                  }`}
                              >
                                {opt.label}
                              </span>
                              <span className="text-sm leading-relaxed">{renderFormattedText(opt.text)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Split Screen for Math */
              <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-5 h-full min-h-0 overflow-hidden">
                {/* Left Column: Math Question Text */}
                <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
                  <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Question Context</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                    {q.imageUrl && (
                      <ZoomableImage src={resolveImageUrl(q.imageUrl)} className="mb-4" />
                    )}
                    <p className="text-[15px] leading-relaxed text-on-surface whitespace-pre-wrap">{renderFormattedText(q.text)}</p>
                  </div>
                </div>

                {/* Right Column: MCQ Options or Student-Produced Response Input Field */}
                <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
                  <div className="bg-surface-container-low px-5 py-2.5 border-b border-outline-variant/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 bg-primary text-on-primary rounded flex items-center justify-center text-xs font-bold">
                        {currentQuestionIndex + 1}
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Answer Choices</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleReview(q._id)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${currentAnswer?.markedForReview
                            ? "bg-accent text-primary"
                            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                          }`}
                      >
                        <Icon name={currentAnswer?.markedForReview ? "flag" : "outlined_flag"} className="text-[14px]" />
                        <span>{currentAnswer?.markedForReview ? "Flagged" : "Flag"}</span>
                      </button>
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                        title="Report Issue"
                      >
                        <Icon name="report" className="text-[14px]" />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6">
                    {q.options && q.options.length > 0 ? (
                      <div className="space-y-2">
                        {q.options.map((opt) => {
                          const selected = currentAnswer?.selectedAnswer === opt.label;
                          return (
                            <button
                              key={opt.label}
                              onClick={() => selectAnswer(q._id, opt.label)}
                              className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer ${selected
                                  ? "border-primary bg-primary/5 shadow-sm"
                                  : "border-outline-variant/40 hover:border-primary/40 hover:bg-surface-container-low"
                                }`}
                            >
                              <span
                                className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${selected
                                    ? "bg-primary text-on-primary"
                                    : "bg-surface-container-high text-on-surface"
                                  }`}
                              >
                                {opt.label}
                              </span>
                              <span className="text-sm leading-relaxed">{renderFormattedText(opt.text)}</span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      /* Student-Produced Response Input Field */
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-on-surface uppercase tracking-wider">
                          Enter Your Answer
                        </label>
                        <input
                          type="text"
                          value={currentAnswer?.selectedAnswer || ""}
                          onChange={(e) => selectAnswer(q._id, e.target.value)}
                          placeholder="Type your answer here..."
                          className="w-full max-w-[300px] px-5 py-4 rounded-xl border-2 border-outline-variant/60 focus:border-primary focus:outline-none text-lg font-mono tracking-wide transition-all bg-surface text-on-surface focus:shadow-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="border-t border-outline-variant/40 bg-surface-container-lowest px-3 sm:px-6 py-3.5 z-40">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-y-2 relative">
          {/* Left: Student Name */}
          <div className="hidden md:block text-sm font-bold text-on-surface">
            {user?.name || "Student"}
          </div>

          {/* Center: Question Navigation Popover Button */}
          <div className="relative">
            <button
              onClick={() => setShowNavGrid(!showNavGrid)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs sm:text-sm font-bold cursor-pointer transition-all border border-outline-variant/40 shadow-sm whitespace-nowrap"
            >
              Q {currentQuestionIndex + 1} of {questions.length}
              <Icon name={showNavGrid ? "expand_more" : "expand_less"} className="text-[16px] sm:text-[18px]" />
            </button>

            {showNavGrid && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-surface-container-lowest border border-outline-variant/60 rounded-2xl p-4 shadow-xl z-50 min-w-[300px] max-w-[90vw] animate-scale-in">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-outline-variant/30">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Question Navigation</span>
                  <button
                    onClick={() => setShowNavGrid(false)}
                    className="p-1 rounded hover:bg-surface-container-low text-on-surface-variant"
                  >
                    <Icon name="close" className="text-[16px]" />
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2 max-h-[220px] overflow-y-auto p-1">
                  {questions.map((q, i) => {
                    const ans = getAnswer(q._id);
                    const isAnswered = !!ans?.selectedAnswer && ans.selectedAnswer !== "";
                    const isReview = !!ans?.markedForReview;
                    const isCurrent = i === currentQuestionIndex;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentQuestionIndex(i);
                          setShowNavGrid(false);
                        }}
                        className={`relative h-9 w-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${isCurrent
                            ? isAnswered
                              ? "bg-primary text-on-primary border-b-[3px] border-b-accent ring-2 ring-primary/40 ring-offset-1"
                              : "bg-surface-container-low text-on-surface border-b-[3px] border-b-primary border-x border-t border-outline-variant/40 ring-2 ring-primary/40 ring-offset-1"
                            : isAnswered
                              ? "bg-primary text-on-primary hover:bg-primary/90"
                              : "bg-surface-container-low text-on-surface-variant/70 border border-outline-variant/30 hover:bg-surface-container-high"
                          }`}
                      >
                        {i + 1}
                        {isReview && (
                          <span className="absolute -top-2 -right-2 text-accent">
                            <Icon name="flag" className="text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }} />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Popover Legend */}
                <div className="flex gap-4 items-center justify-between text-[10px] font-semibold text-on-surface-variant mt-4 pt-3 border-t border-outline-variant/30">
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-primary" />
                    <span>Attempted</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-surface-container-low border border-outline-variant/30" />
                    <span>Unattempted</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-3 w-3 rounded bg-surface-container-low border-b-2 border-b-primary border-x border-t border-outline-variant/30" />
                    <span>Current</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Previous / Next Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Back Button */}
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center justify-center px-3 sm:px-5 h-9 sm:h-10 rounded-xl border border-outline-variant text-xs sm:text-sm font-semibold disabled:opacity-30 disabled:pointer-events-none hover:bg-surface-container-low transition-all cursor-pointer"
            >
              Back
            </button>

            {/* Next Button */}
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                className="flex items-center justify-center px-4 sm:px-6 h-9 sm:h-10 rounded-xl bg-primary text-on-primary text-xs sm:text-sm font-bold hover:bg-accent hover:text-primary transition-all cursor-pointer"
              >
                Next
              </button>
            ) : (
              <button
                onClick={completeCurrentModule}
                disabled={submitting}
                className="flex items-center justify-center px-6 h-10 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-accent hover:text-primary transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? "Submitting..." : isLastModule ? "Submit Test" : "Next"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-outline-variant/40 rounded-2xl p-6 max-w-lg w-full shark-shadow flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-3 mb-4">
              <h3 className="text-lg font-bold text-on-surface">Directions</h3>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant cursor-pointer"
              >
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2">
              {showMathTools ? mathDirections : rwDirections}
            </div>
            <div className="flex justify-end pt-4 border-t border-outline-variant/40 mt-4">
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="px-5 py-2 rounded-xl bg-primary text-on-primary hover:bg-accent hover:text-primary transition-colors font-semibold text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {showReportModal && q && (
        <ReportIssueModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          questionId={q._id}
          testContext={attemptId}
        />
      )}
      </div>
    </SecurityWrapper>
  );
}
