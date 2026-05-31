type ResumeCraftErrorOptions = {
  mechanism?: "manual" | "onerror" | "unhandledrejection" | "react_error_boundary";
  handled?: boolean;
  severity?: "error" | "warning" | "info";
};

type ResumeCraftEvents = {
  captureException?: (
    error: unknown,
    context?: Record<string, unknown>,
    options?: ResumeCraftErrorOptions,
  ) => void;
};

declare global {
  interface Window {
    __resumeCraftEvents?: ResumeCraftEvents;
  }
}

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.__resumeCraftEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
