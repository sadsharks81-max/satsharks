import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDataChannel } from "@livekit/components-react";
import { Modal } from "../../components/ui/Modal";
import { Icon } from "../../components/common/Icon";
import { liveClassApi, type WhiteboardStroke } from "../../services/liveClassApi";
import { WHITEBOARD_TOPIC_CLEAR, WHITEBOARD_TOPIC_STROKE } from "./chatTopics";

interface WhiteboardProps {
  open: boolean;
  onClose: () => void;
  classId: string;
  canModerate: boolean;
}

const COLORS = ["#172554", "#2563eb", "#dc2626", "#16a34a", "#9333ea", "#f59e0b"];
const encode = (data: unknown) => new TextEncoder().encode(JSON.stringify(data));
const decode = (payload: Uint8Array) => {
  try {
    return JSON.parse(new TextDecoder().decode(payload));
  } catch {
    return null;
  }
};

const strokeKey = () =>
  globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function WhiteboardPlaceholder({ open, onClose, classId, canModerate }: WhiteboardProps) {
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [draft, setDraft] = useState<WhiteboardStroke | null>(null);
  const [tool, setTool] = useState<"PEN" | "ERASER">("PEN");
  const [color, setColor] = useState(COLORS[0]);
  const [width, setWidth] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const drawingRef = useRef(false);
  const draftRef = useRef<WhiteboardStroke | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    const result = await liveClassApi.getWhiteboard(classId);
    if (result.success) setStrokes(result.strokes);
    else setError(result.error || "Unable to load the whiteboard.");
    setLoading(false);
  }, [classId]);

  useEffect(() => {
    if (open) void loadBoard();
  }, [open, loadBoard]);

  const { send: broadcastStroke } = useDataChannel(WHITEBOARD_TOPIC_STROKE, (message) => {
    const incoming = decode(message.payload) as WhiteboardStroke | null;
    if (!incoming?.strokeId) return;
    setStrokes((current) =>
      current.some((stroke) => stroke.strokeId === incoming.strokeId)
        ? current
        : [...current, incoming],
    );
  });

  const { send: broadcastClear } = useDataChannel(WHITEBOARD_TOPIC_CLEAR, () => {
    setStrokes([]);
    setDraft(null);
    draftRef.current = null;
  });

  const pointFromEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
    };
  };

  const beginStroke = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingRef.current = true;
    const point = pointFromEvent(event);
    const nextDraft: WhiteboardStroke = {
      strokeId: strokeKey(),
      points: [point, point],
      color: tool === "ERASER" ? "#ffffff" : color,
      width: tool === "ERASER" ? Math.max(16, width * 4) : width,
      tool,
    };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  };

  const continueStroke = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drawingRef.current) return;
    const point = pointFromEvent(event);
    setDraft((current) => {
      if (!current) return current;
      const previous = current.points[current.points.length - 1];
      if (previous && Math.hypot(point.x - previous.x, point.y - previous.y) < 0.002)
        return current;
      const nextDraft = { ...current, points: [...current.points.slice(0, 499), point] };
      draftRef.current = nextDraft;
      return nextDraft;
    });
  };

  const finishStroke = async () => {
    drawingRef.current = false;
    const completed = draftRef.current;
    draftRef.current = null;
    setDraft(null);
    if (!completed || completed.points.length < 2) return;
    setStrokes((current) => [...current, completed]);
    const result = await liveClassApi.addWhiteboardStroke(classId, completed);
    if (!result.success) {
      setStrokes((current) => current.filter((stroke) => stroke.strokeId !== completed.strokeId));
      setError(result.error || "That stroke could not be shared.");
      return;
    }
    await broadcastStroke(encode(result.stroke), { reliable: true });
  };

  const clearBoard = async () => {
    if (!window.confirm("Clear the whiteboard for everyone in this class?")) return;
    const result = await liveClassApi.clearWhiteboard(classId);
    if (!result.success) {
      setError(result.error || "Unable to clear the whiteboard.");
      return;
    }
    setStrokes([]);
    await broadcastClear(encode({ cleared: true }), { reliable: true });
  };

  const visibleStrokes = useMemo(() => (draft ? [...strokes, draft] : strokes), [draft, strokes]);

  return (
    <Modal open={open} onClose={onClose} title="Shared Whiteboard" icon="draw" maxWidth="max-w-6xl">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-outline-variant/60 bg-surface-container-low p-2">
          <button
            type="button"
            onClick={() => setTool("PEN")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${tool === "PEN" ? "bg-primary text-white" : "text-on-surface hover:bg-surface-container"}`}
          >
            <Icon name="edit" className="text-[16px]" /> Pen
          </button>
          <button
            type="button"
            onClick={() => setTool("ERASER")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold ${tool === "ERASER" ? "bg-primary text-white" : "text-on-surface hover:bg-surface-container"}`}
          >
            <Icon name="ink_eraser" className="text-[16px]" /> Eraser
          </button>
          <div className="mx-1 h-7 w-px bg-outline-variant" />
          {COLORS.map((swatch) => (
            <button
              type="button"
              key={swatch}
              aria-label={`Use ${swatch}`}
              onClick={() => {
                setColor(swatch);
                setTool("PEN");
              }}
              className={`h-7 w-7 rounded-full border-2 ${color === swatch && tool === "PEN" ? "border-primary ring-2 ring-primary/25" : "border-white"}`}
              style={{ backgroundColor: swatch }}
            />
          ))}
          <label className="ml-1 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
            Size
            <input
              type="range"
              min="2"
              max="12"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
              className="w-24 accent-primary"
            />
          </label>
          {canModerate && (
            <button
              type="button"
              onClick={() => void clearBoard()}
              className="ml-auto flex items-center gap-1.5 rounded-lg border border-error/30 px-3 py-2 text-xs font-bold text-error hover:bg-error/10"
            >
              <Icon name="delete_sweep" className="text-[16px]" /> Clear for everyone
            </button>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-center justify-between rounded-lg bg-error/10 px-3 py-2 text-xs font-semibold text-error"
          >
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss">
              &times;
            </button>
          </div>
        )}

        <div className="relative overflow-hidden rounded-xl border border-outline-variant bg-white shadow-inner">
          {loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/75 text-sm font-semibold text-primary">
              Loading shared board...
            </div>
          )}
          <svg
            ref={svgRef}
            viewBox="0 0 1000 600"
            className="block aspect-[5/3] w-full touch-none cursor-crosshair select-none"
            onPointerDown={beginStroke}
            onPointerMove={continueStroke}
            onPointerUp={() => void finishStroke()}
            onPointerCancel={() => void finishStroke()}
            aria-label="Shared classroom drawing canvas"
          >
            <defs>
              <pattern id="whiteboard-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#e2e8f0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="600" fill="white" />
            <rect width="1000" height="600" fill="url(#whiteboard-grid)" />
            {visibleStrokes.map((stroke) => (
              <polyline
                key={stroke.strokeId}
                points={stroke.points
                  .map((point) => `${point.x * 1000},${point.y * 600}`)
                  .join(" ")}
                fill="none"
                stroke={stroke.color}
                strokeWidth={stroke.width}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        </div>
        <p className="text-center text-[11px] text-on-surface-variant">
          Drawings are shared live and saved for students who join later.
        </p>
      </div>
    </Modal>
  );
}
