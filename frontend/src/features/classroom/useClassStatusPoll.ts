import { useEffect, useState, useCallback } from "react";
import { api } from "../../services/api";

export interface LiveClassDetails {
  _id: string;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  status: "SCHEDULED" | "LIVE" | "COMPLETED" | "CANCELLED";
  roomName: string;
  maxStudents: number;
  startedAt?: string | null;
  teacher: { _id: string; name: string; email: string };
}

const WAITING_POLL_INTERVAL_MS = 4000;
const LIVE_POLL_INTERVAL_MS = 30_000;
const BACKGROUND_POLL_INTERVAL_MS = 60_000;

/**
 * Polls a class's status - this is how the waiting room knows the teacher has
 * started the class without needing a websocket server of our own.
 */
export function useClassStatusPoll(classId: string) {
  const [liveClass, setLiveClass] = useState<LiveClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnce = useCallback(async () => {
    const res = await api.get(`/api/live-classes/${classId}`);
    if (res.success) {
      setLiveClass(res.liveClass);
      setError(null);
    } else {
      setError(res.error || "This class could not be found.");
    }
    setLoading(false);
  }, [classId]);

  const pollInterval =
    liveClass?.status === "LIVE" ? LIVE_POLL_INTERVAL_MS : WAITING_POLL_INTERVAL_MS;

  useEffect(() => {
    let cancelled = false;
    let timeout: number | undefined;
    const tick = async () => {
      if (cancelled) return;
      await fetchOnce();
      if (!cancelled) {
        timeout = window.setTimeout(
          tick,
          document.hidden ? BACKGROUND_POLL_INTERVAL_MS : pollInterval,
        );
      }
    };
    void tick();
    return () => {
      cancelled = true;
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, [fetchOnce, pollInterval]);

  return { liveClass, loading, error, refetch: fetchOnce };
}
