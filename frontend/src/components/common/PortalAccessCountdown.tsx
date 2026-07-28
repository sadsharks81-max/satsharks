import { useAuth } from "../../hooks/useAuth";
import { Icon } from "./Icon";

export function PortalAccessCountdown() {
  const { user } = useAuth();
  if (user?.role !== "STUDENT" || !user.portalAccessEnd) return null;
  const remaining = new Date(user.portalAccessEnd).getTime() - Date.now();
  const days = Math.max(0, Math.ceil(remaining / 86400000));
  return (
    <div className="fixed bottom-28 right-6 z-40 flex items-center gap-3 rounded-2xl border border-primary/20 bg-surface px-4 py-3 text-on-surface shadow-xl">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon name="timer" /></span>
      <div>
        <div className="text-sm font-bold">{days} day{days === 1 ? "" : "s"} left</div>
        <div className="text-[10px] text-on-surface-variant">{days > 0 ? "Portal access remaining" : "Portal access has ended"}</div>
      </div>
    </div>
  );
}
