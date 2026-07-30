import { ConnectionQuality } from "livekit-client";

export const QUALITY_DOT_COLOR: Record<ConnectionQuality, string> = {
  [ConnectionQuality.Excellent]: "bg-success",
  [ConnectionQuality.Good]: "bg-accent",
  [ConnectionQuality.Poor]: "bg-error",
  [ConnectionQuality.Lost]: "bg-error",
  [ConnectionQuality.Unknown]: "bg-on-surface-variant/40",
};

export const QUALITY_LABEL: Record<ConnectionQuality, string> = {
  [ConnectionQuality.Excellent]: "Excellent",
  [ConnectionQuality.Good]: "Good",
  [ConnectionQuality.Poor]: "Poor",
  [ConnectionQuality.Lost]: "Poor",
  [ConnectionQuality.Unknown]: "...",
};
