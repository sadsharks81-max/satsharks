import { useEffect, useState } from "react";
import { Icon } from "./Icon";

interface SecurityWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function SecurityWrapper({ children, enabled = true }: SecurityWrapperProps) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // 1. Right Click Blocker
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // 2. Keyboard Blocker (Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P, Ctrl+S)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "C" || e.key === "v" || e.key === "V" || e.key === "x" || e.key === "X" || e.key === "p" || e.key === "P" || e.key === "s" || e.key === "S")) ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        alert("Action restricted: Copy, Paste, Print, and Screen Capture shortcuts are disabled on this page for platform security.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // 3. Tab Focus / Window Blur detection. Interacting with a cross-origin
    // iframe also blurs the parent window, so defer the check until the browser
    // has moved document.activeElement and allow explicitly approved test tools.
    let blurCheckTimer: number | undefined;
    const handleBlur = () => {
      window.clearTimeout(blurCheckTimer);
      blurCheckTimer = window.setTimeout(() => {
        const activeElement = document.activeElement;
        const isApprovedTestTool =
          activeElement instanceof HTMLIFrameElement &&
          activeElement.dataset.allowTestFocus === "true";

        if (!isApprovedTestTool) {
          setIsBlurred(true);
        }
      }, 0);
    };
    window.addEventListener("blur", handleBlur);

    // 4. Inject Print Media Blocker styles
    const styleElement = document.createElement("style");
    styleElement.id = "print-prevention-style";
    styleElement.innerHTML = `
      @media print {
        body {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleBlur);
      window.clearTimeout(blurCheckTimer);
      const style = document.getElementById("print-prevention-style");
      if (style) style.remove();
    };
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full h-full select-none" style={{ WebkitUserSelect: "none", MozUserSelect: "none", msUserSelect: "none", userSelect: "none" }}>
      {children}
      
      {isBlurred && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in select-none">
          <div className="bg-surface text-on-surface p-8 max-w-md w-full rounded-2xl border border-outline-variant/50 shark-shadow text-center space-y-5">
            <div className="w-16 h-16 bg-error/15 text-error rounded-full flex items-center justify-center mx-auto">
              <Icon name="warning" className="text-3xl" />
            </div>
            <h3 className="font-display text-2xl font-bold text-primary">Test Focus Lost</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              We detected that you switched tabs or clicked outside the test window. To ensure test integrity and prevent screen recording, the content has been hidden.
            </p>
            <button
              onClick={() => setIsBlurred(false)}
              className="w-full btn-shimmer bg-primary text-on-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-accent transition-colors cursor-pointer border-none"
            >
              Resume Focus & Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
