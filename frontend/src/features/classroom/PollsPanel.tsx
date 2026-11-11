import { useCallback, useEffect, useState } from "react";
import { useDataChannel } from "@livekit/components-react";
import { Icon } from "../../components/common/Icon";
import { liveClassApi, type ClassroomPoll } from "../../services/liveClassApi";
import { POLL_TOPIC_UPDATE } from "./chatTopics";

interface PollsPanelProps {
  classId: string;
  canModerate: boolean;
}

const encode = (data: unknown) => new TextEncoder().encode(JSON.stringify(data));
const DEFAULT_OPTIONS = ["", "", "", ""];

export function PollsPanel({ classId, canModerate }: PollsPanelProps) {
  const [polls, setPolls] = useState<ClassroomPoll[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(DEFAULT_OPTIONS);

  const refresh = useCallback(async () => {
    const result = await liveClassApi.getPolls(classId);
    if (result.success) setPolls(result.polls);
    else setError(result.error || "Unable to load class polls.");
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const { send: broadcastUpdate } = useDataChannel(POLL_TOPIC_UPDATE, () => {
    void refresh();
  });

  const publishRefresh = () => broadcastUpdate(encode({ refresh: true }), { reliable: true });

  const createPoll = async () => {
    const cleanOptions = options.map((option) => option.trim()).filter(Boolean);
    if (!question.trim() || cleanOptions.length < 2 || busy) return;
    setBusy(true);
    setError("");
    const result = await liveClassApi.createPoll(classId, question.trim(), cleanOptions);
    if (result.success) {
      setQuestion("");
      setOptions(DEFAULT_OPTIONS);
      setCreating(false);
      await refresh();
      await publishRefresh();
    } else {
      setError(result.error || "Unable to launch the poll.");
    }
    setBusy(false);
  };

  const vote = async (poll: ClassroomPoll, optionId: string) => {
    if (busy || poll.status !== "ACTIVE") return;
    setBusy(true);
    const result = await liveClassApi.voteOnPoll(classId, poll._id, optionId);
    if (result.success) {
      setPolls((current) => current.map((item) => (item._id === poll._id ? result.poll : item)));
      await publishRefresh();
    } else {
      setError(result.error || "Your answer could not be submitted.");
    }
    setBusy(false);
  };

  const closePoll = async (poll: ClassroomPoll) => {
    if (busy) return;
    setBusy(true);
    const result = await liveClassApi.closePoll(classId, poll._id);
    if (result.success) {
      await refresh();
      await publishRefresh();
    } else {
      setError(result.error || "Unable to close the poll.");
    }
    setBusy(false);
  };

  const revealResults = async (poll: ClassroomPoll) => {
    if (busy || poll.resultsVisible) return;
    setBusy(true);
    setError("");
    const result = await liveClassApi.revealPollResults(classId, poll._id);
    if (result.success) {
      await refresh();
      await publishRefresh();
    } else {
      setError(result.error || "Unable to show the results to students.");
    }
    setBusy(false);
  };

  const activePoll = polls.find((poll) => poll.status === "ACTIVE");
  const previousPolls = polls.filter((poll) => poll.status === "CLOSED");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {error && (
          <div
            role="alert"
            className="mb-3 flex items-start justify-between gap-2 rounded-lg bg-error/15 p-2.5 text-xs text-red-200"
          >
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              &times;
            </button>
          </div>
        )}

        {canModerate && !creating && (
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-white hover:bg-primary/90"
          >
            <Icon name="add_chart" className="text-[17px]" /> Launch a poll
          </button>
        )}

        {canModerate && creating && (
          <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-white/50">
              Question
            </label>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              maxLength={500}
              rows={2}
              placeholder="What is the correct answer?"
              className="w-full resize-none rounded-lg border border-white/10 bg-black/20 p-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary"
            />
            <div className="mt-2 space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <input
                    value={option}
                    onChange={(event) =>
                      setOptions((current) =>
                        current.map((value, optionIndex) =>
                          optionIndex === index ? event.target.value : value,
                        ),
                      )
                    }
                    maxLength={250}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-2.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-primary"
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="flex-1 rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-white/60 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void createPoll()}
                disabled={
                  busy || !question.trim() || options.filter((option) => option.trim()).length < 2
                }
                className="flex-1 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
              >
                {busy ? "Launching..." : "Ask class"}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="py-8 text-center text-xs text-white/40">Loading polls...</div>
        ) : activePoll ? (
          <PollCard
            poll={activePoll}
            busy={busy}
            canModerate={canModerate}
            onVote={vote}
            onClose={closePoll}
            onReveal={revealResults}
          />
        ) : (
          <div className="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs text-white/40">
            <Icon name="poll" className="mb-2 block text-3xl" />
            No active poll right now.
          </div>
        )}

        {previousPolls.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-white/40">
              Previous polls
            </h3>
            <div className="space-y-2">
              {previousPolls.map((poll) => (
                <PollCard
                  key={poll._id}
                  poll={poll}
                  busy={busy}
                  canModerate={canModerate}
                  onVote={vote}
                  onClose={closePoll}
                  onReveal={revealResults}
                  compact
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PollCard({
  poll,
  busy,
  canModerate,
  onVote,
  onClose,
  onReveal,
  compact = false,
}: {
  poll: ClassroomPoll;
  busy: boolean;
  canModerate: boolean;
  onVote: (poll: ClassroomPoll, optionId: string) => void;
  onClose: (poll: ClassroomPoll) => void;
  onReveal: (poll: ClassroomPoll) => void;
  compact?: boolean;
}) {
  const showResults = canModerate || poll.resultsVisible;
  const total = Math.max(1, poll.responseCount || 0);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-bold leading-snug text-white">{poll.question}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${poll.status === "ACTIVE" ? "bg-success/20 text-success" : "bg-white/10 text-white/40"}`}
        >
          {poll.status}
        </span>
      </div>
      <div className="space-y-2">
        {poll.options.map((option) => {
          const count = poll.counts?.[option.id] || 0;
          const percent = Math.round((count / total) * 100);
          const selected = poll.selectedOptionId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onVote(poll, option.id)}
              disabled={busy || poll.status !== "ACTIVE"}
              className={`relative w-full overflow-hidden rounded-lg border p-2.5 text-left transition-colors ${selected ? "border-primary bg-primary/15" : "border-white/10 bg-black/10 hover:border-white/25"} disabled:cursor-default`}
            >
              {showResults && (
                <span
                  className="absolute inset-y-0 left-0 bg-primary/15 transition-all"
                  style={{ width: `${percent}%` }}
                />
              )}
              <span className="relative flex items-center gap-2 text-xs text-white">
                <strong className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  {option.id}
                </strong>
                <span className="min-w-0 flex-1">{option.text}</span>
                {showResults && (
                  <span className="font-mono text-[10px] text-white/50">
                    {count} &middot; {percent}%
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
      {!compact && showResults && (
        <p className="mt-2 text-[10px] text-white/40">
          {poll.responseCount || 0} response{poll.responseCount === 1 ? "" : "s"}
        </p>
      )}
      {!showResults && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/5 px-2.5 py-2 text-[10px] text-white/50">
          <Icon name="visibility_off" className="text-[14px]" />
          Results are hidden until the teacher shares them.
        </div>
      )}
      {canModerate && !poll.resultsVisible && (
        <button
          type="button"
          onClick={() => void onReveal(poll)}
          disabled={busy}
          className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <Icon name="visibility" className="mr-1 align-middle text-[15px]" />
          Show results to students
        </button>
      )}
      {canModerate && poll.resultsVisible && (
        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-success">
          <Icon name="visibility" className="text-[14px]" /> Results are visible to students
        </p>
      )}
      {canModerate && poll.status === "ACTIVE" && (
        <button
          type="button"
          onClick={() => void onClose(poll)}
          disabled={busy}
          className="mt-3 w-full rounded-lg border border-white/10 py-2 text-xs font-bold text-white/60 hover:bg-white/5"
        >
          Close poll
        </button>
      )}
    </div>
  );
}
