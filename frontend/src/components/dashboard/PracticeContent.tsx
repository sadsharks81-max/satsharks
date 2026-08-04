import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef, ReactNode } from "react";
import { Badge } from "../ui/Badge";
import { Icon } from "../common/Icon";
import { Select } from "../ui/Select";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ZoomableImage } from "../ui/ZoomableImage";
import { api, resolveImageUrl } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { SecurityWrapper } from "../common/SecurityWrapper";
import { ReportIssueModal } from "../common/ReportIssueModal";
import type { Question, QuestionCategory } from "../../types";
import { renderFormattedText, stripQuestionTypeTags } from "../../utils/format";

const MathFraction = ({ num, den }: { num: ReactNode; den: ReactNode }) => (
  <span className="inline-flex flex-col items-center justify-center align-middle mx-1 text-[10px] leading-none">
    <span className="border-b border-current pb-0.5 px-0.5">{num}</span>
    <span className="pt-0.5 px-0.5">{den}</span>
  </span>
);

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

const CUSTOM_TEST_CATEGORY_NAMES = {
  MATH: ["sat advanced math", "sat algebra", "sat data & statistics", "sat geometry"],
  READING_WRITING: ["sat grammar & writing", "sat reading & writing", "sat vocabulary", "sat reading comprehension"],
};

const normalizedCategoryName = (name: string) => name.trim().toLowerCase();

const BLOCKED_CATEGORY_NAMES = ["math", "sat math"];

export function PracticeContent() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; correctAnswer: string; explanation: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, correct: 0 });
  const [totalSolved, setTotalSolved] = useState(0);
  const [availableQuestionCount, setAvailableQuestionCount] = useState(0);
  const [attemptedAnswers, setAttemptedAnswers] = useState<Array<{
    questionId: string;
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }>>([]);
  const [sessionSummary, setSessionSummary] = useState<{
    total: number;
    correct: number;
    timeSpent: number;
    answers: typeof attemptedAnswers;
  } | null>(null);

  const fetchPracticeHistory = async () => {
    try {
      const res = await api.get("/api/practice/history?limit=1");
      if (res.success) {
        setTotalSolved(res.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Failed to load practice history", err);
    }
  };

  useEffect(() => {
    fetchPracticeHistory();
  }, []);

  // Filters
  const [section, setSection] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [category, setCategory] = useState("");

  // Custom Test Mode State
  const [activeTab, setActiveTab] = useState<"PRACTICE" | "CUSTOM_TEST">("PRACTICE");
  const [customSubject, setCustomSubject] = useState<"READING_WRITING" | "MATH">("READING_WRITING");
  const [customDifficulties, setCustomDifficulties] = useState<string[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isGeneratingTest, setIsGeneratingTest] = useState(false);
  const navigate = useNavigate();

  // Practice Mode
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    api.get("/api/categories").then((res) => {
      if (res.success) setCategories(res.categories || []);
    });
  }, []);

  const [timeSpent, setTimeSpent] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState("");

  // Refs mirror the latest state so the timer's setTimeout/setInterval callbacks
  // (created inside an effect closure) never finish the session with stale counts.
  const statsRef = useRef(stats);
  const attemptedAnswersRef = useRef(attemptedAnswers);
  const timeSpentRef = useRef(timeSpent);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    attemptedAnswersRef.current = attemptedAnswers;
  }, [attemptedAnswers]);

  useEffect(() => {
    timeSpentRef.current = timeSpent;
  }, [timeSpent]);

  const finishPracticeSession = () => {
    setSessionSummary({
      total: statsRef.current.total,
      correct: statsRef.current.correct,
      timeSpent: timeSpentRef.current,
      answers: [...attemptedAnswersRef.current],
    });
    setIsPracticeMode(false);
    setShowCalculator(false);
    setShowReferenceModal(false);
    setIsTimerRunning(false);
    setTimeRemaining(null);
    setTimeSpent(0);
    setTimerMinutes("");
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
    setStats({ total: 0, correct: 0 });
    setAttemptedAnswers([]);
  };

  const startPracticeSession = () => {
    const minutes = Number(timerMinutes);
    if (!Number.isFinite(minutes) || minutes <= 0) return;
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setResult(null);
    setStats({ total: 0, correct: 0 });
    setAttemptedAnswers([]);
    setTimeSpent(0);
    setTimeRemaining(Math.round(minutes * 60));
    setIsTimerRunning(true);
    setIsPracticeMode(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPracticeMode && isTimerRunning) {
      interval = setInterval(() => {
        setTimeSpent((t) => t + 1);
        setTimeRemaining((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimeout(() => {
              finishPracticeSession();
            }, 50);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPracticeMode, isTimerRunning]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const fetchQuestions = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (section) params.set("section", section);
    if (difficulty) params.set("difficulty", difficulty);
    if (category) params.set("category", category);
    if (!category) {
      const excludedCategoryIds = categories
        .filter((item) => {
          const name = normalizedCategoryName(item.name);
          return Object.values(CUSTOM_TEST_CATEGORY_NAMES).flat().includes(name)
            || name === "simple algebra"
            || name === "algebra"
            || BLOCKED_CATEGORY_NAMES.includes(name);
        })
        .map((item) => item._id);
      if (excludedCategoryIds.length) params.set("excludeCategories", excludedCategoryIds.join(","));
    }
    params.set("limit", "100");

    const res = await api.get(`/api/questions?${params}`);
    if (res.success) {
      setQuestions(res.questions || []);
      setAvailableQuestionCount(res.pagination?.total || 0);
      setCurrentIdx(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [section, difficulty, category, categories]);

  const handleGenerateCustomTest = async () => {
    setIsGeneratingTest(true);
    try {
      const res = await api.post("/api/practice/custom-test", {
        subject: customSubject,
        difficulties: customDifficulties,
        categories: customCategories,
      });
      if (res.success && res.attemptId) {
        navigate({ to: `/dashboard/sat-runner/${res.attemptId}` });
      } else {
        alert(res.error || "Failed to generate custom test.");
      }
    } catch (err: any) {
      alert("Failed to generate custom test. Please try again.");
    } finally {
      setIsGeneratingTest(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !questions[currentIdx]) return;
    const res = await api.post("/api/practice/answer", {
      questionId: questions[currentIdx]._id,
      selectedAnswer,
      timeSpent,
    });
    if (res.success) {
      setResult(res.result);
      setShowResult(true);
      setStats((prev) => ({
        total: prev.total + 1,
        correct: prev.correct + (res.result.isCorrect ? 1 : 0),
      }));
      setAttemptedAnswers((prev) => [
        ...prev,
        {
          questionId: questions[currentIdx]._id,
          question: questions[currentIdx].text,
          selectedAnswer,
          correctAnswer: res.result.correctAnswer,
          isCorrect: res.result.isCorrect,
        },
      ]);
      setTotalSolved((prev) => prev + 1);
    } else {
      alert(res.error || "Failed to submit answer");
      if (res.limitReached) {
        fetchPracticeHistory();
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setResult(null);
    }
  };

  const q = questions[currentIdx];
  const rwSplit = q ? getRWTextSplit(q.text) : { passage: "", prompt: "" };
  const allCustomCategoryNames = Object.values(CUSTOM_TEST_CATEGORY_NAMES).flat();
  const regularPracticeCategories = categories.filter((item) => {
    const name = normalizedCategoryName(item.name);
    return !allCustomCategoryNames.includes(name)
      && name !== "simple algebra"
      && name !== "algebra"
      && !BLOCKED_CATEGORY_NAMES.includes(name)
      && (!section || item.section === section);
  });
  const availableCustomCategories = categories.filter((item) =>
    item.section === customSubject
    && CUSTOM_TEST_CATEGORY_NAMES[customSubject].includes(normalizedCategoryName(item.name))
  );

  useEffect(() => {
    if (category && !regularPracticeCategories.some((item) => item._id === category)) {
      setCategory("");
    }
  }, [section, category, regularPracticeCategories]);

  if (isPracticeMode && q) {
    const isMath = q.section === "MATH" || section === "MATH";
    return (
      <SecurityWrapper>
        <div className="h-screen w-screen bg-background text-on-background flex flex-col overflow-hidden fixed inset-0 z-50">
        {/* Practice Mode Top Bar */}
        <div className="bg-surface/95 backdrop-blur-md border-b border-outline-variant/40 px-6 py-2.5 flex items-center justify-between shrink-0 gap-4 flex-wrap md:flex-nowrap">
          {/* Left: Title + Exit button */}
          <div className="flex items-center gap-3 shrink-0">
            <h2 className="font-bold text-sm text-on-surface whitespace-nowrap">
              SAT Practice
            </h2>
            <button
              onClick={finishPracticeSession}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-error/30 text-error hover:bg-error/5 transition-colors text-xs font-bold cursor-pointer"
            >
              <Icon name="logout" className="text-[13px]" />
              <span>Exit</span>
            </button>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-primary bg-primary/10 text-primary text-xs font-bold">
              <Icon name="timer" className="text-[13px]" />
              <span className="font-mono">
                {formatTime(timeRemaining || 0)}
              </span>
            </div>
          </div>

          {/* Center/Middle: Filters Row - hidden in practice mode screen */}
          <div className="hidden">
            <Select
              label=""
              value={section}
              onChange={(e) => setSection(e.target.value)}
              options={[
                { value: "", label: "All Sections" },
                { value: "READING_WRITING", label: "Reading & Writing" },
                { value: "MATH", label: "Math" },
              ]}
              className="!w-auto !py-1 !text-xs"
            />
            <Select
              label=""
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={[
                { value: "", label: "All Difficulties" },
                { value: "EASY", label: "Easy" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HARD", label: "Hard" },
              ]}
              className="!w-auto !py-1 !text-xs"
            />
            <Select
              label=""
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "", label: "All Categories" },
                ...regularPracticeCategories.map((c) => ({ value: c._id, label: c.name })),
              ]}
              className="!w-auto !py-1 !text-xs !max-w-[180px] md:!max-w-[240px]"
            />
          </div>

          {/* Right: Math Tools */}
          <div className="flex items-center gap-2 shrink-0">
            {isMath && (
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
                  <span>Calculator</span>
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
                  <span>Reference</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Split Screen Container */}
        <div className="flex-1 flex w-full min-h-0 bg-background overflow-hidden relative">
          {/* Math Tools Side Panel */}
          {isMath && (showCalculator || showReferenceModal) && (
            <div className="w-[38%] min-w-[340px] max-w-[550px] border-r border-outline-variant/40 flex flex-col h-full bg-surface-container-lowest shrink-0 animate-fade-in">
              <div className="bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between px-2 shrink-0">
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
                    <span>Reference</span>
                  </button>
                </div>
                <button
                  onClick={() => {
                    setShowCalculator(false);
                    setShowReferenceModal(false);
                  }}
                  className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant cursor-pointer transition-colors"
                >
                  <Icon name="close" className="text-[18px]" />
                </button>
              </div>

              <div className="flex-1 min-h-0 relative">
                {showCalculator && (
                  <iframe
                    src="https://www.desmos.com/testing/cb-digital-sat/graphing"
                    data-allow-test-focus="true"
                    className="w-full h-full border-0 absolute inset-0"
                    title="Desmos Graphing Calculator"
                  />
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
                    <div className="border-t border-outline-variant/40 pt-4 text-[11px] text-on-surface-variant space-y-2 font-semibold">
                      <p>• The number of degrees of arc in a circle is 360.</p>
                      <p>• The number of radians of arc in a circle is 2π.</p>
                      <p>• The sum of the measures in degrees of the angles of a triangle is 180.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Core Question Layout (Split) */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 h-full min-h-0 overflow-hidden">
            {/* Left Column: Passage */}
            <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Passage / Reference</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 scroll-smooth space-y-6">
                {q.imageUrl && (
                  <ZoomableImage src={resolveImageUrl(q.imageUrl)} />
                )}
                {rwSplit.passage && (
                  <p className="text-[15px] leading-relaxed text-on-surface whitespace-pre-wrap">{renderFormattedText(rwSplit.passage)}</p>
                )}
                {rwSplit.prompt && (
                  <p className="text-[15px] font-semibold text-on-surface leading-relaxed whitespace-pre-wrap">{renderFormattedText(rwSplit.prompt)}</p>
                )}
              </div>
            </div>

            {/* Right Column: Question, Options, Actions (Header + Scrollable Body + Fixed Footer) */}
            <div className="flex flex-col h-full min-h-0 overflow-hidden bg-surface-container-lowest border border-outline-variant/40 rounded-2xl shark-shadow">
              {/* Static Header */}
              <div className="bg-surface-container-low px-5 py-3 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="h-6 w-6 bg-primary text-on-primary rounded flex items-center justify-center text-xs font-bold">
                    {currentIdx + 1}
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Question {currentIdx + 1} of {questions.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={q.difficulty === "EASY" ? "success" : q.difficulty === "MEDIUM" ? "warning" : "error"}>
                    {q.difficulty}
                  </Badge>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-outline-variant hover:bg-surface-container-high text-on-surface-variant transition-colors text-xs font-bold cursor-pointer"
                    title="Report Issue"
                  >
                    <Icon name="flag" className="text-[14px]" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {q.options && q.options.length > 0 ? (
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedAnswer === opt.label;
                      let optStyle = "";
                      if (showResult && result) {
                        if (opt.label === result.correctAnswer) {
                          optStyle = "border-primary bg-primary/10";
                        } else if (isSelected && !result.isCorrect) {
                          optStyle = "border-error bg-error/10";
                        }
                      } else if (isSelected) {
                        optStyle = "border-primary bg-primary/5";
                      }

                      return (
                        <button
                          key={opt.label}
                          onClick={() => !showResult && setSelectedAnswer(opt.label)}
                          disabled={showResult}
                          className={`w-full flex items-center gap-4 py-3 px-4 rounded-xl border-2 text-left transition-all cursor-pointer disabled:cursor-default ${
                            optStyle || "border-outline-variant/40 hover:border-primary/40"
                          }`}
                        >
                          <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isSelected ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface"
                          }`}>
                            {opt.label}
                          </span>
                          <span className="text-sm">{renderFormattedText(opt.text)}</span>
                          {showResult && opt.label === result?.correctAnswer && (
                            <Icon name="check_circle" className="ml-auto text-primary text-[20px]" />
                          )}
                          {showResult && isSelected && !result?.isCorrect && opt.label !== result?.correctAnswer && (
                            <Icon name="cancel" className="ml-auto text-error text-[20px]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                      Enter Your Answer
                    </label>
                    <input
                      type="text"
                      value={selectedAnswer || ""}
                      onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
                      disabled={showResult}
                      placeholder="Type your answer here..."
                      className={`w-full max-w-[300px] px-4 py-3 rounded-xl border-2 text-base font-mono transition-all bg-surface text-on-surface focus:outline-none focus:shadow-md ${
                        showResult
                          ? result?.isCorrect
                            ? "border-primary bg-primary/5"
                            : "border-error bg-error/5"
                          : "border-outline-variant/60 focus:border-primary"
                      }`}
                    />
                    {showResult && result && (
                      <div className="text-xs font-semibold mt-1">
                        Correct Answer: <span className="font-mono text-primary font-bold">{result.correctAnswer}</span>
                      </div>
                    )}
                  </div>
                )}

                {showResult && result && (
                  <div className={`rounded-xl p-5 ${result.isCorrect ? "bg-primary/10 border border-primary/20" : "bg-error/10 border border-error/20"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon name={result.isCorrect ? "check_circle" : "cancel"} className={`text-[22px] ${result.isCorrect ? "text-primary" : "text-error"}`} />
                      <span className="font-semibold text-sm">{result.isCorrect ? "Correct!" : "Incorrect"}</span>
                    </div>
                    {result.explanation && (
                      <p className="text-sm text-on-surface-variant whitespace-pre-wrap">{renderFormattedText(result.explanation)}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Static Fixed Footer (Never scrolls!) */}
              <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant/30 flex justify-between items-center gap-4 shrink-0">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-xs font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5"
                >
                  <Icon name="arrow_back" className="text-[14px]" /> Previous
                </button>

                {!showResult ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={!selectedAnswer}
                    className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs disabled:opacity-40 hover:bg-accent transition-all cursor-pointer"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div className="flex-1 text-center py-2.5 text-xs font-bold text-primary uppercase tracking-wider">
                    Answer Submitted
                  </div>
                )}

                {showResult && currentIdx >= questions.length - 1 ? (
                  <button
                    onClick={finishPracticeSession}
                    className="px-4 py-2.5 rounded-xl bg-primary text-on-primary text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    View Results <Icon name="analytics" className="text-[14px]" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={currentIdx >= questions.length - 1}
                    className="px-4 py-2.5 rounded-xl border border-outline-variant/40 hover:bg-surface-container-high text-xs font-semibold transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-transparent flex items-center gap-1.5"
                  >
                    Next <Icon name="arrow_forward" className="text-[14px]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Report Issue Modal */}
        {showReportModal && q && (
          <ReportIssueModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            questionId={q._id}
            testContext="PRACTICE"
          />
        )}
      </div>
    </SecurityWrapper>
  );
}

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Practice Questions</h1>
          <p className="text-on-surface-variant text-sm">Answer one question at a time with instant feedback</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="success">{stats.correct} correct</Badge>
          <Badge variant="default">{stats.total} answered</Badge>
        </div>
      </div>

      {user?.subscription === "FREE" && (
        <div className="mb-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Icon name="help_center" className="text-primary text-[18px]" />
            <span className="text-xs font-semibold text-on-surface">
              Practice Limit: {totalSolved} / 20 questions solved
            </span>
          </div>
          {totalSolved >= 20 && (
            <Link to="/sat" className="text-xs font-bold text-accent hover:underline">
              Upgrade to Premium for Unlimited Questions
            </Link>
          )}
        </div>
      )}

      <div className="flex items-center justify-center mb-8">
        <div className="flex bg-surface-container-low p-1.5 rounded-2xl shark-shadow shrink-0">
          <button
            onClick={() => setActiveTab("PRACTICE")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "PRACTICE" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Just Practice Questions
          </button>
          <button
            onClick={() => setActiveTab("CUSTOM_TEST")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
              activeTab === "CUSTOM_TEST" ? "bg-primary text-on-primary shadow-sm" : "text-on-surface hover:bg-surface-container-high"
            }`}
          >
            Create Your Own Practice Test
          </button>
        </div>
      </div>

      {activeTab === "PRACTICE" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-4 w-full items-end">
            <Select
              label=""
              value={section}
              onChange={(e) => setSection(e.target.value)}
              options={[
                { value: "", label: "All Sections" },
                { value: "READING_WRITING", label: "Reading & Writing" },
                { value: "MATH", label: "Math" },
              ]}
              className="w-full !py-2"
            />
            <Select
              label=""
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={[
                { value: "", label: "All Difficulties" },
                { value: "EASY", label: "Easy" },
                { value: "MEDIUM", label: "Medium" },
                { value: "HARD", label: "Hard" },
              ]}
              className="w-full !py-2"
            />
            <Select
              label=""
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: "", label: "All Categories" },
                ...regularPracticeCategories.map((c) => ({ value: c._id, label: c.name })),
              ]}
              className="w-full !py-2"
            />
            <label className="flex flex-col gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Required Timer</span>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="240"
                  step="1"
                  value={timerMinutes}
                  onChange={(event) => setTimerMinutes(event.target.value)}
                  placeholder="Minutes"
                  className="h-[40px] w-full rounded-xl border border-outline-variant bg-surface px-4 pr-14 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-on-surface-variant">min</span>
              </div>
            </label>
            <button
              onClick={startPracticeSession}
              disabled={!q || Number(timerMinutes) <= 0 || (user?.subscription === "FREE" && totalSolved >= 20)}
              className="w-full h-[40px] px-6 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-accent transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Icon name="open_in_full" className="text-[18px]" />
              <span>Start Timed Practice</span>
            </button>
          </div>
          <div className="mb-8 flex flex-col justify-between gap-2 rounded-xl border border-primary/15 bg-primary/5 px-4 py-3 text-sm sm:flex-row sm:items-center">
            <span className="font-semibold text-on-surface">
              <Icon name="help_center" className="mr-2 align-middle text-lg text-primary" />
              {availableQuestionCount} practice questions match these filters.
            </span>
            <span className="text-xs text-on-surface-variant">Enter how many minutes you need, then start your session.</span>
          </div>

          {user?.subscription === "FREE" && totalSolved >= 20 ? (
            <div className="rounded-2xl bg-surface-container-lowest text-on-surface p-10 text-center border border-outline-variant/40 shark-shadow max-w-xl mx-auto my-8">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15 text-accent mb-6">
                <Icon name="lock" className="text-[32px]" />
              </div>
              <h2 className="font-display text-2xl font-bold mb-4">Practice Limit Reached</h2>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                You have solved the free limit of 20 practice questions. To continue solving the remaining 3,666+ prep questions and boost your score, upgrade to our Premium plan!
              </p>
              <Link
                to="/sat"
                className="btn-shimmer inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-on-primary shark-shadow hover:bg-accent transition-all duration-300 cursor-pointer"
              >
                Upgrade to Premium
              </Link>
            </div>
          ) : loading ? (
            <div className="text-center py-12 text-on-surface-variant">Loading questions...</div>
          ) : !q ? (
            <EmptyState icon="help_center" title="No questions found" description="Try adjusting your filters" />
          ) : (
            <div className="rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-8 text-center shark-shadow">
              <Icon name="timer" className="mb-3 text-4xl text-primary" />
              <h2 className="text-xl font-bold">Your practice set is ready</h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                {availableQuestionCount} questions are available. Enter a timer above to begin.
              </p>
            </div>
          )}
        </>
      )}

      {activeTab === "CUSTOM_TEST" && (
        <div className="max-w-3xl mx-auto mt-8 bg-surface-container-lowest border border-outline-variant/40 rounded-3xl p-8 shark-shadow">
          <h2 className="text-2xl font-bold mb-2">Create Custom Practice Test</h2>
          <p className="text-on-surface-variant text-sm mb-8">Generate a full-length modular practice test focusing on specific topics and difficulties.</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Select Subject</label>
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setCustomSubject("READING_WRITING");
                    setCustomCategories([]);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                    customSubject === "READING_WRITING" ? "border-primary bg-primary/10 text-primary" : "border-outline-variant hover:border-primary/40 text-on-surface-variant"
                  }`}
                >
                  English (Reading & Writing)
                </button>
                <button
                  onClick={() => {
                    setCustomSubject("MATH");
                    setCustomCategories([]);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-bold transition-all ${
                    customSubject === "MATH" ? "border-primary bg-primary/10 text-primary" : "border-outline-variant hover:border-primary/40 text-on-surface-variant"
                  }`}
                >
                  Math
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Select Difficulties (Optional)</label>
              <div className="flex gap-3 flex-wrap">
                {["EASY", "MEDIUM", "HARD"].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setCustomDifficulties(prev => prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff])}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                      customDifficulties.includes(diff) ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {diff.charAt(0) + diff.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-on-surface mb-2">Select SAT Domains (Optional)</label>
              <div className="flex gap-2 flex-wrap max-h-48 overflow-y-auto custom-scrollbar p-1">
                {availableCustomCategories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setCustomCategories(prev => prev.includes(cat._id) ? prev.filter(c => c !== cat._id) : [...prev, cat._id])}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      customCategories.includes(cat._id) ? "border-primary bg-primary text-on-primary" : "border-outline-variant text-on-surface hover:bg-surface-container-high"
                    }`}
                  >
                    {cat.name.replace("SAT Practice: ", "")}
                  </button>
                ))}
                {availableCustomCategories.length === 0 && (
                  <p className="text-xs text-on-surface-variant">No approved domains are currently available for this subject.</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-outline-variant/30">
              <button
                onClick={handleGenerateCustomTest}
                disabled={isGeneratingTest}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-bold text-base hover:bg-accent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shark-shadow"
              >
                {isGeneratingTest ? "Generating Test..." : "Generate & Start Test"}
                {!isGeneratingTest && <Icon name="arrow_forward" />}
              </button>
              <p className="text-xs text-center text-on-surface-variant mt-4">
                {customSubject === "READING_WRITING" ? "This will generate 2 modules, 27 questions each (32 mins per module)." : "This will generate 2 modules, 22 questions each (35 mins per module)."}
                <br />
                The test will run without breaks.
              </p>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={Boolean(sessionSummary)}
        onClose={() => setSessionSummary(null)}
        title="Practice Session Results"
        icon="analytics"
        maxWidth="max-w-3xl"
      >
        {sessionSummary && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Attempted", sessionSummary.total],
                ["Correct", sessionSummary.correct],
                ["Incorrect", sessionSummary.total - sessionSummary.correct],
                ["Score", `${sessionSummary.total ? Math.round((sessionSummary.correct / sessionSummary.total) * 100) : 0}%`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-surface-container-low p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="mt-1 text-xs font-semibold text-on-surface-variant">{label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-xl border border-outline-variant/40 px-4 py-3">
              <span className="text-sm font-semibold">Session time</span>
              <span className="font-mono font-bold">{formatTime(sessionSummary.timeSpent)}</span>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold">Attempted Questions</h3>
              {sessionSummary.answers.length === 0 ? (
                <p className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  No answers were submitted in this session.
                </p>
              ) : sessionSummary.answers.map((answer, index) => (
                <div key={`${answer.questionId}-${index}`} className="rounded-xl border border-outline-variant/40 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{index + 1}. {stripQuestionTypeTags(answer.question)}</p>
                    <Badge variant={answer.isCorrect ? "success" : "error"}>
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <span>Your answer: <strong>{answer.selectedAnswer}</strong></span>
                    <span>Correct answer: <strong>{answer.correctAnswer}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
