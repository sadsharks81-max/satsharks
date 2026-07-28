const CALENDLY_SCRIPT_ID = "calendly-popup-widget";
const CALENDLY_SCRIPT_SRC = "https://assets.calendly.com/assets/external/widget.js";
const CALENDLY_STYLESHEET_ID = "calendly-popup-widget-styles";
const CALENDLY_STYLESHEET_HREF = "https://assets.calendly.com/assets/external/widget.css";

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
    };
  }
}

const loadCalendlyScript = () =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Calendly can only be opened in the browser."));
      return;
    }

    if (window.Calendly?.initPopupWidget) {
      resolve();
      return;
    }

    if (!document.getElementById(CALENDLY_STYLESHEET_ID)) {
      const link = document.createElement("link");
      link.id = CALENDLY_STYLESHEET_ID;
      link.rel = "stylesheet";
      link.href = CALENDLY_STYLESHEET_HREF;
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById(CALENDLY_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Calendly failed to load.")),
        {
          once: true,
        },
      );
      return;
    }

    const script = document.createElement("script");
    script.id = CALENDLY_SCRIPT_ID;
    script.src = CALENDLY_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly failed to load."));
    document.body.appendChild(script);
  });

export const openCalendly = async () => {
  const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || import.meta.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/satsharks92/30min";

  if (!calendlyUrl) {
    throw new Error("Calendly URL is not configured.");
  }

  await loadCalendlyScript();

  if (!window.Calendly?.initPopupWidget) {
    throw new Error("Calendly is not available yet.");
  }

  window.Calendly.initPopupWidget({ url: calendlyUrl });
};
