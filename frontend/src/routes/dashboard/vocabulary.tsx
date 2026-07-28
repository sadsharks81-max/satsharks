import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { StudentLayout } from "../../components/layout/StudentLayout";
import { Icon } from "../../components/common/Icon";
import { api } from "../../services/api";
import { stripEmojis } from "../../utils/format";

export const Route = createFileRoute("/dashboard/vocabulary")({
  component: VocabularyMastery,
});

interface VocabularyWord {
  _id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonyms: string[];
  frequency: number;
}

interface Progress {
  masteredWordIds: string[];
  missedCounts: Record<string, number>;
  masteredCount: number;
  wordCount: number;
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  pointsAwardedToday: number;
  dailyPointsLimit: number;
}

type Mode = "home" | "flashcards" | "quiz" | "review";

const shuffled = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

function VocabularyMastery() {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [streak, setStreak] = useState(0);
  const [leaderboardPoints, setLeaderboardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<Mode>("home");
  const [deck, setDeck] = useState<VocabularyWord[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<VocabularyWord[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedDefinition, setSelectedDefinition] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadGame = async () => {
    setLoading(true);
    const res = await api.get("/api/vocabulary");
    if (res.success) {
      setWords((res.words || []).map((item: VocabularyWord) => ({
        ...item,
        definition: stripEmojis(item.definition),
        example: stripEmojis(item.example),
      })));
      setProgress(res.progress);
      setStreak(res.student?.streak || 0);
      setLeaderboardPoints(res.student?.leaderboardPoints || 0);
      setError("");
    } else {
      setError(res.error || "Could not load vocabulary practice.");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadGame();
  }, []);

  const missedWords = useMemo(
    () => words
      .filter((word) => (progress?.missedCounts[word._id] || 0) > 0)
      .sort((a, b) => (progress?.missedCounts[b._id] || 0) - (progress?.missedCounts[a._id] || 0)),
    [words, progress]
  );
  const currentCard = deck[cardIndex];
  const currentQuizWord = quiz[quizIndex];
  const quizOptions = useMemo(
    () => currentQuizWord
      ? shuffled([
          currentQuizWord.definition,
          ...shuffled(words.filter((word) => word._id !== currentQuizWord._id))
            .slice(0, 3)
            .map((word) => word.definition),
        ])
      : [],
    [currentQuizWord, words]
  );

  const updateFromResult = (res: any) => {
    if (!res.success) {
      setError(res.error || "Progress could not be saved.");
      return;
    }
    setProgress(res.progress);
    setStreak(res.student.streak);
    setLeaderboardPoints(res.student.leaderboardPoints);
  };

  const record = async (
    word: VocabularyWord,
    correct: boolean,
    mastered: boolean,
    answerMode: string,
    selectedDefinition?: string
  ) => {
    const res = await api.post("/api/vocabulary/answer", {
      wordId: word._id,
      correct,
      mastered,
      mode: answerMode,
      selectedDefinition,
    });
    updateFromResult(res);
  };

  const startFlashcards = () => {
    const unmastered = words.filter((word) => !progress?.masteredWordIds.includes(word._id));
    setDeck(shuffled(unmastered.length ? unmastered : words));
    setCardIndex(0);
    setFlipped(false);
    setMode("flashcards");
  };

  const startQuiz = () => {
    setQuiz(shuffled(words).slice(0, Math.min(10, words.length)));
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedDefinition(null);
    setMode("quiz");
  };

  const assessCard = async (correct: boolean) => {
    const word = deck[cardIndex];
    if (!word || submitting) return;
    setSubmitting(true);
    await record(word, correct, correct, "FLASHCARD");
    setCardIndex((index) => index + 1);
    setFlipped(false);
    setSubmitting(false);
  };

  const answerQuiz = async (definition: string) => {
    const word = quiz[quizIndex];
    if (!word || selectedDefinition || submitting) return;
    const correct = definition === word.definition;
    setSelectedDefinition(definition);
    if (correct) setQuizScore((score) => score + 1);
    setSubmitting(true);
    await record(word, correct, correct, "QUIZ", definition);
    setSubmitting(false);
  };

  const resetProgress = async () => {
    if (!confirm("Reset your vocabulary mastery and missed-word history? Leaderboard points will remain.")) return;
    const res = await api.delete("/api/vocabulary/progress");
    if (res.success) {
      await loadGame();
      setMode("home");
    }
  };

  if (loading) {
    return (
      <StudentLayout activeItem="/dashboard/vocabulary">
        <div className="flex justify-center py-24">
          <Icon name="hourglass_top" className="animate-spin text-4xl text-primary" />
        </div>
      </StudentLayout>
    );
  }

  const quizComplete = mode === "quiz" && quiz.length > 0 && quizIndex >= quiz.length;
  const masteryPercent = progress?.wordCount
    ? Math.round((progress.masteredCount / progress.wordCount) * 100)
    : 0;

  return (
    <StudentLayout activeItem="/dashboard/vocabulary">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
              <Icon name="auto_awesome" className="text-base" /> Daily SAT Training
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface md:text-4xl">Vocab Mastery</h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              Build a stronger SAT vocabulary through active recall, quick quizzes, and focused review.
            </p>
          </div>
          {mode !== "home" && (
            <button
              onClick={() => setMode("home")}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-outline-variant bg-surface px-4 py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-container-low"
            >
              <Icon name="arrow_back" className="text-lg" /> Back to modes
            </button>
          )}
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-error/30 bg-error/10 p-4 text-sm text-error">{error}</div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Words Mastered", value: `${progress?.masteredCount || 0}/${progress?.wordCount || words.length}`, icon: "verified", color: "text-primary" },
            { label: "Daily Streak", value: `${streak} days`, icon: "local_fire_department", color: "text-accent" },
            { label: "Quiz Accuracy", value: `${progress?.accuracy || 0}%`, icon: "target", color: "text-success" },
            { label: "Leaderboard", value: `${leaderboardPoints} pts`, icon: "emoji_events", color: "text-accent" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-outline-variant/40 bg-surface p-4 shark-shadow sm:p-5">
              <Icon name={stat.icon} className={`mb-2 text-2xl ${stat.color}`} />
              <div className="font-display text-xl font-extrabold text-on-surface sm:text-2xl">{stat.value}</div>
              <div className="mt-1 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">{stat.label}</div>
            </div>
          ))}
        </div>

        {mode === "home" && (
          <>
            <div className="mb-6 rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold text-on-surface">Overall mastery</span>
                <span className="font-mono font-bold text-primary">{masteryPercent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-surface-container-high">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container transition-all"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-on-surface-variant">
                <span>Correct quiz answers earn 5 points, up to {progress?.dailyPointsLimit || 100} daily.</span>
                <span className="font-semibold text-accent">{progress?.pointsAwardedToday || 0} points earned today</span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <ModeCard
                icon="style"
                title="Smart Flashcards"
                description="Flip through unmastered words and rate your recall."
                badge={`${Math.max(0, words.length - (progress?.masteredCount || 0))} left`}
                onClick={startFlashcards}
              />
              <ModeCard
                icon="quiz"
                title="10-Word Challenge"
                description="Choose the correct definition and earn leaderboard points."
                badge="+5 per correct"
                onClick={startQuiz}
                accent
              />
              <ModeCard
                icon="refresh"
                title="Weak Word Review"
                description="Focus on words you missed and turn them into strengths."
                badge={`${missedWords.length} to review`}
                onClick={() => setMode("review")}
              />
            </div>

            <div className="mt-8 text-center">
              <button onClick={resetProgress} className="text-xs font-semibold text-on-surface-variant hover:text-error">
                Reset vocabulary progress
              </button>
            </div>
          </>
        )}

        {mode === "flashcards" && (
          currentCard ? (
            <div className="mx-auto max-w-2xl">
              <div className="mb-3 text-center text-sm font-semibold text-on-surface-variant">
                Card {cardIndex + 1} of {deck.length}
              </div>
              <button
                onClick={() => setFlipped((value) => !value)}
                className="flex min-h-[360px] w-full flex-col items-center justify-center rounded-3xl border-2 border-outline-variant/50 bg-surface p-8 text-center shark-shadow transition-all hover:border-primary/30"
              >
                {!flipped ? (
                  <>
                    <span className="absolute self-end rounded-full bg-accent/10 px-3 py-1 text-[11px] font-bold text-accent">
                      Seen {currentCard.frequency} times
                    </span>
                    <h2 className="font-display text-4xl font-extrabold text-primary">{currentCard.word}</h2>
                    <p className="mt-2 text-sm italic text-primary/70">{currentCard.partOfSpeech}</p>
                    <p className="mt-16 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Tap to reveal</p>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-2xl font-bold text-on-surface">{currentCard.definition}</h2>
                    <p className="mt-5 text-sm text-primary">Synonyms: {currentCard.synonyms.join(", ") || "None provided"}</p>
                    {currentCard.example && <p className="mt-6 max-w-xl text-sm italic leading-relaxed text-on-surface-variant">“{currentCard.example}”</p>}
                  </>
                )}
              </button>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button disabled={submitting} onClick={() => assessCard(false)} className="rounded-xl border border-error/30 bg-error/10 py-4 font-bold text-error hover:bg-error/15 disabled:opacity-50">
                  Still Learning
                </button>
                <button disabled={submitting} onClick={() => assessCard(true)} className="rounded-xl border border-success/30 bg-success/10 py-4 font-bold text-success hover:bg-success/15 disabled:opacity-50">
                  I Know This
                </button>
              </div>
            </div>
          ) : (
            <Completion title="Flashcard Round Complete" message="Great work. Your mastery progress has been saved." onAgain={startFlashcards} />
          )
        )}

        {mode === "quiz" && !quizComplete && currentQuizWord && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="font-semibold text-on-surface-variant">Question {quizIndex + 1} of {quiz.length}</span>
              <span className="font-bold text-accent">{quizScore} correct</span>
            </div>
            <div className="mb-4 rounded-3xl border border-outline-variant/40 bg-primary p-8 text-center text-on-primary shark-shadow">
              <p className="text-[11px] font-bold uppercase tracking-widest text-on-primary/65">Choose the definition</p>
              <h2 className="mt-3 font-display text-4xl font-extrabold">{currentQuizWord.word}</h2>
              <p className="mt-1 text-sm italic text-on-primary/70">{currentQuizWord.partOfSpeech}</p>
            </div>
            <div className="space-y-3">
              {quizOptions.map((definition) => {
                const isCorrect = definition === currentQuizWord.definition;
                const isSelected = selectedDefinition === definition;
                const answered = selectedDefinition !== null;
                return (
                  <button
                    key={definition}
                    disabled={answered || submitting}
                    onClick={() => answerQuiz(definition)}
                    className={`w-full rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                      answered && isCorrect
                        ? "border-success bg-success/10 text-success"
                        : isSelected
                          ? "border-error bg-error/10 text-error"
                          : "border-outline-variant/50 bg-surface text-on-surface hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    {definition}
                  </button>
                );
              })}
            </div>
            {selectedDefinition && (
              <button
                disabled={submitting}
                onClick={() => {
                  setQuizIndex((index) => index + 1);
                  setSelectedDefinition(null);
                }}
                className="mt-4 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-on-primary hover:bg-accent disabled:opacity-50"
              >
                {quizIndex + 1 === quiz.length ? "See Results" : "Next Word"}
              </button>
            )}
          </div>
        )}

        {quizComplete && (
          <Completion
            title={`${quizScore}/${quiz.length} Correct`}
            message={`You earned up to ${quizScore * 5} leaderboard points. Return tomorrow to protect your streak.`}
            onAgain={startQuiz}
          />
        )}

        {mode === "review" && (
          missedWords.length ? (
            <div className="space-y-3">
              {missedWords.map((word) => (
                <details key={word._id} className="group rounded-2xl border border-outline-variant/40 bg-surface p-5 shark-shadow">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <div>
                      <span className="font-display text-lg font-bold text-on-surface">{word.word}</span>
                      <span className="ml-2 text-xs italic text-primary">{word.partOfSpeech}</span>
                    </div>
                    <span className="rounded-full bg-error/10 px-3 py-1 text-[11px] font-bold text-error">
                      Missed {progress?.missedCounts[word._id]} times
                    </span>
                  </summary>
                  <div className="mt-4 border-t border-outline-variant/30 pt-4">
                    <p className="font-semibold text-on-surface">{word.definition}</p>
                    <p className="mt-2 text-sm text-primary">Synonyms: {word.synonyms.join(", ")}</p>
                    {word.example && <p className="mt-3 text-sm italic text-on-surface-variant">“{word.example}”</p>}
                    <button
                      onClick={() => record(word, true, true, "REVIEW")}
                      className="mt-4 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-xs font-bold text-success"
                    >
                      Mark as Mastered
                    </button>
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <Completion title="No Weak Words" message="Complete a quiz and any missed words will appear here for focused review." onAgain={startQuiz} />
          )
        )}
      </div>
    </StudentLayout>
  );
}

function ModeCard({
  icon,
  title,
  description,
  badge,
  onClick,
  accent = false,
}: {
  icon: string;
  title: string;
  description: string;
  badge: string;
  onClick: () => void;
  accent?: boolean;
}) {
  return (
    <button onClick={onClick} className={`rounded-2xl border p-6 text-left shark-shadow transition-all hover:-translate-y-1 ${accent ? "border-accent/40 bg-accent/5" : "border-outline-variant/40 bg-surface"}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${accent ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>
          <Icon name={icon} className="text-2xl" />
        </span>
        <span className="rounded-full border border-outline-variant/40 bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{badge}</span>
      </div>
      <h2 className="font-display text-xl font-bold text-on-surface">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{description}</p>
    </button>
  );
}

function Completion({ title, message, onAgain }: { title: string; message: string; onAgain: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-outline-variant/40 bg-surface p-10 text-center shark-shadow">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent/15 text-accent">
        <Icon name="emoji_events" className="text-3xl" />
      </span>
      <h2 className="mt-5 font-display text-3xl font-extrabold text-on-surface">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-on-surface-variant">{message}</p>
      <button onClick={onAgain} className="mt-6 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary hover:bg-accent">
        Practice Again
      </button>
    </div>
  );
}
