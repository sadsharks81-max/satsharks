import { useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { Icon } from "../common/Icon";

// Declare custom web-component for React TypeScript to prevent lint/compile errors in any TypeScript setup
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': any;
    }
  }
}

interface MathEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (latex: string) => void;
  initialValue?: string;
}

export const MathEditorModal = ({ isOpen, onClose, onInsert, initialValue = "" }: MathEditorModalProps) => {
  const [loaded, setLoaded] = useState(false);
  const [mathType, setMathType] = useState<"inline" | "block">("inline");
  const [mathValue, setMathValue] = useState("");
  const mathfieldRef = useRef<any>(null);

  // Load MathLive from CDN
  useEffect(() => {
    if (!isOpen) return;

    if (window.customElements.get("math-field")) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/mathlive@0.98.6/dist/mathlive.min.js";
    script.async = true;
    script.onload = () => {
      setLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load MathLive from CDN");
    };
    document.body.appendChild(script);

    return () => {
      // Optional: keep script loaded so it doesn't reload next time
    };
  }, [isOpen]);

  // Set up event listeners on math-field once loaded
  useEffect(() => {
    if (!loaded || !isOpen) return;

    const mf = mathfieldRef.current;
    if (mf) {
      // Set initial value (strip enclosing $ or $$ if present)
      let cleanVal = initialValue.trim();
      if (cleanVal.startsWith("$$") && cleanVal.endsWith("$$")) {
        cleanVal = cleanVal.slice(2, -2);
        setMathType("block");
      } else if (cleanVal.startsWith("$") && cleanVal.endsWith("$")) {
        cleanVal = cleanVal.slice(1, -1);
        setMathType("inline");
      }
      
      mf.value = cleanVal;
      setMathValue(cleanVal);

      // Listen to input changes
      const handleInput = (e: any) => {
        setMathValue(mf.value);
      };
      
      mf.addEventListener("input", handleInput);

      // Set focus after a small delay
      setTimeout(() => {
        mf.focus();
      }, 100);

      return () => {
        mf.removeEventListener("input", handleInput);
      };
    }
  }, [loaded, isOpen, initialValue]);

  const handleInsert = () => {
    if (!mathValue.trim()) {
      onClose();
      return;
    }
    const wrappedLatex = mathType === "block" ? `$$${mathValue}$$` : `$${mathValue}$`;
    onInsert(wrappedLatex);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Visual Math Equation Editor"
      icon="functions"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6 py-2">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Use the visual editor below to build your math equation. You can use your keyboard to type, 
          or click on the input box to open the **virtual on-screen math keyboard** for advanced symbols (roots, fractions, absolute values, limits, matrices).
        </p>

        {!loaded ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-on-surface-variant font-semibold">Loading math keyboard engine...</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Math Field WYSIWYG Container */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider">Visual Formula Input</label>
              <div className="rounded-2xl border-2 border-outline-variant focus-within:border-primary overflow-hidden bg-surface-container-low transition-colors shadow-inner">
                <math-field
                  ref={mathfieldRef}
                  style={{
                    display: "block",
                    width: "100%",
                    minHeight: "120px",
                    padding: "16px",
                    fontSize: "1.35rem",
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontFamily: "KaTeX_Main, Times New Roman, serif",
                  }}
                />
              </div>
            </div>

            {/* Config & Type Selection */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/35 shadow-sm">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Formula Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMathType("inline")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      mathType === "inline"
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface hover:bg-surface-container-low border-outline-variant/40 text-on-surface-variant"
                    }`}
                  >
                    Inline Math ($...$)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMathType("block")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      mathType === "block"
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface hover:bg-surface-container-low border-outline-variant/40 text-on-surface-variant"
                    }`}
                  >
                    Block Math ($$...$$)
                  </button>
                </div>
              </div>

              <div className="space-y-1 max-w-sm">
                <span className="block text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">LaTeX Output (Generated Code)</span>
                <code className="block px-3 py-1.5 rounded bg-surface-container-high font-mono text-xs text-primary font-semibold select-all break-all border border-outline-variant/30">
                  {mathType === "block" ? `$$${mathValue}$$` : `$${mathValue}$`}
                </code>
              </div>
            </div>

            {/* Quick Template Tips */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex gap-3 items-start">
              <Icon name="tips_and_updates" className="text-primary text-[20px] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-primary block">Visual Editor Tips:</span>
                <ul className="text-[11px] text-on-surface-variant space-y-1 leading-relaxed list-disc list-inside">
                  <li>Type <kbd className="px-1 py-0.5 rounded bg-surface-container-high text-on-surface font-mono">/</kbd> to easily insert a visual fraction.</li>
                  <li>Type <kbd className="px-1 py-0.5 rounded bg-surface-container-high text-on-surface font-mono">^</kbd> for exponents or <kbd className="px-1 py-0.5 rounded bg-surface-container-high text-on-surface font-mono">_</kbd> for subscript.</li>
                  <li>Use <kbd className="px-1 py-0.5 rounded bg-surface-container-high text-on-surface font-mono">|</kbd> keys or the math keyboard to insert absolute value brackets.</li>
                  <li>Use left/right arrow keys to navigate in and out of fractions or roots.</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-outline-variant hover:bg-surface-container-low text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsert}
                disabled={!mathValue.trim()}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary hover:bg-accent font-semibold transition-all disabled:opacity-50 cursor-pointer shadow-sm"
              >
                Insert Equation
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
