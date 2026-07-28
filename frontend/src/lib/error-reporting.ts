type AppErrorOptions = {
  boundary?: string;
  [key: string]: unknown;
};

type AppEvents = {
  captureException?: (
    error: unknown,
    options?: AppErrorOptions,
    context?: Record<string, unknown>
  ) => void;
};

declare global {
  interface Window {
    __lovableEvents?: AppEvents;
  }
}

export function reportAppError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    { boundary: "tanstack_root_error_component" },
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
  );
}
