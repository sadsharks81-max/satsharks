import { useCallback, useEffect, useRef, useState } from "react";
import { liveClassApi, type JoinTokenResponse } from "../../services/liveClassApi";

/**
 * Fetches a scoped LiveKit join token for this class. `enabled` gates the initial
 * fetch (e.g. students must wait for the waiting room to confirm the class is LIVE).
 * `refetch` is exposed so a failed reconnect can request a fresh token and force a
 * full remount of <LiveKitRoom> (see ClassroomPage, which keys it by token).
 */
export function useLiveClassRoom(classId: string, enabled: boolean) {
  const [token, setToken] = useState<string | null>(null);
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef<{
    classId: string;
    promise: Promise<JoinTokenResponse>;
  } | null>(null);

  const fetchToken = useCallback((): Promise<JoinTokenResponse> => {
    if (inFlightRef.current?.classId === classId) return inFlightRef.current.promise;

    const request = (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await liveClassApi.getToken(classId);
        if (res.success && res.token && res.url) {
          if (!/^wss?:\/\//i.test(res.url)) {
            const message = "The classroom server URL is invalid. Please contact support.";
            setError(message);
            setToken(null);
            setServerUrl(null);
            return { success: false, error: message };
          }
          setToken(res.token);
          setServerUrl(res.url);
          setUpgradeRequired(false);
          return res;
        }

        setError(res.error || "Unable to join this class right now.");
        setUpgradeRequired(Boolean(res.upgradeRequired));
        setToken(null);
        setServerUrl(null);
        return res;
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to connect to class server.";
        setError(message);
        setToken(null);
        setServerUrl(null);
        return { success: false, error: message };
      } finally {
        setLoading(false);
      }
    })();

    inFlightRef.current = { classId, promise: request };
    void request.finally(() => {
      if (inFlightRef.current?.promise === request) inFlightRef.current = null;
    });
    return request;
  }, [classId]);

  const clearToken = useCallback(() => {
    setToken(null);
    setServerUrl(null);
  }, []);

  useEffect(() => {
    if (enabled && !token && !loading && !error) {
      void fetchToken();
    }
  }, [enabled, token, loading, error, fetchToken]);

  return { token, serverUrl, error, upgradeRequired, loading, refetch: fetchToken, clearToken };
}
