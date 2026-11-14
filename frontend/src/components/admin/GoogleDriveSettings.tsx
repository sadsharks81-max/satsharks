import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "../../services/api";
import { Icon } from "../common/Icon";

type DriveStatus = {
  configured: boolean;
  connected: boolean;
  folderId: string | null;
  connectedAt: string | null;
  connectedBy?: { name?: string; email?: string } | null;
};

export function GoogleDriveSettings() {
  const [status, setStatus] = useState<DriveStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async () => {
    setLoading(true);
    const result = await api.get("/api/integrations/google-drive/status");
    if (result.success) {
      setStatus({
        configured: Boolean(result.configured),
        connected: Boolean(result.connected),
        folderId: result.folderId || null,
        connectedAt: result.connectedAt || null,
        connectedBy: result.connectedBy || null,
      });
    } else {
      toast.error(result.error || "Unable to load Google Drive status.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void loadStatus();
    const params = new URLSearchParams(window.location.search);
    if (params.get("drive") === "connected") toast.success("Google Drive connected successfully.");
    if (params.get("drive") === "error") {
      toast.error(params.get("reason") || "Google Drive could not be connected.");
    }
  }, [loadStatus]);

  const connect = async () => {
    setBusy(true);
    const result = await api.post("/api/integrations/google-drive/connect", {});
    if (result.success && result.authorizationUrl) {
      window.location.assign(result.authorizationUrl);
      return;
    }
    toast.error(result.error || "Unable to start Google authorization.");
    setBusy(false);
  };

  const disconnect = async () => {
    if (!window.confirm("Disconnect Google Drive? New class recordings will stop working.")) return;
    setBusy(true);
    const result = await api.delete("/api/integrations/google-drive");
    if (result.success) {
      toast.success("Google Drive disconnected.");
      await loadStatus();
    } else {
      toast.error(result.error || "Unable to disconnect Google Drive.");
    }
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="py-10 text-sm font-semibold text-on-surface-variant">
        Checking Google Drive...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-on-surface">
          <Icon name="add_to_drive" className="text-xl text-primary" />
          Recorded Lectures Storage
        </h2>
        <p className="mt-2 text-sm leading-6 text-on-surface-variant">
          Connect the client&apos;s Google account once. Teacher screen recordings will then upload
          directly into the configured Drive folder while the class is running.
        </p>
      </div>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface-container-high/40 p-5">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span
              className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-full ${
                status?.connected ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}
            >
              <Icon name={status?.connected ? "cloud_done" : "cloud_off"} className="text-xl" />
            </span>
            <div>
              <p className="font-bold text-on-surface">
                {status?.connected ? "Google Drive connected" : "Google Drive not connected"}
              </p>
              <p className="mt-1 text-xs leading-5 text-on-surface-variant">
                {!status?.configured
                  ? "One or more GOOGLE_DRIVE_* Railway variables are missing."
                  : status.connectedAt
                    ? `Connected ${new Date(status.connectedAt).toLocaleString()}${status.connectedBy?.email ? ` by ${status.connectedBy.email}` : ""}`
                    : "Authorization is required once before recording a class."}
              </p>
            </div>
          </div>

          {status?.connected ? (
            <button
              type="button"
              onClick={() => void disconnect()}
              disabled={busy}
              className="rounded-xl border border-error/30 px-4 py-2.5 text-xs font-bold text-error transition-colors hover:bg-error/10 disabled:opacity-50"
            >
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void connect()}
              disabled={busy || !status?.configured}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-on-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon name="link" className="text-base" />
              {busy ? "Opening Google..." : "Connect Google Drive"}
            </button>
          )}
        </div>

        {status?.folderId && (
          <div className="mt-5 border-t border-outline-variant/20 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Recordings folder
            </p>
            <a
              href={`https://drive.google.com/drive/folders/${status.folderId}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1 break-all font-mono text-xs text-primary hover:underline"
            >
              {status.folderId}
              <Icon name="open_in_new" className="text-sm" />
            </a>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 text-xs leading-5 text-on-surface-variant">
        <strong className="text-on-surface">How recording works:</strong> the teacher must click
        Record and approve a screen, window, or tab in the browser. Keep the classroom and laptop
        open until the status says the recording is saved to Drive.
      </div>
    </div>
  );
}
