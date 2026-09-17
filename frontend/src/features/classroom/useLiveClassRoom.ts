import { useCallback, useEffect, useState } from "react";
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

  const fetchToken = useCallback(async (): Promise<JoinTokenResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await liveClassApi.getToken(classId);
      if (res.success && res.token && res.url) {
        setToken(res.token);
        setServerUrl(res.url);
        setUpgradeRequired(false);
        return res;
      } else {
        setError(res.error || "Unable to join this class right now.");
        setUpgradeRequired(Boolean(res.upgradeRequired));
        setToken(null);
        return res;
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to connect to class server.";
      setError(msg);
      setToken(null);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
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
