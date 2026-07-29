import React from "react";
import katex from "katex";

const QUESTION_TYPE_TAG_PATTERN =
  /\[\s*(multiple\s*choice|mcq|spr(?:\s*[-–—]\s*grid[-\s]?in)?|grid[-\s]?in|fill[-\s]in[-\s]the[-\s]blank)\s*\]/i;

export function stripQuestionTypeTags(value: string | undefined | null): string {
  if (!value) return "";
  const globalPattern = new RegExp(QUESTION_TYPE_TAG_PATTERN.source, "gi");
  return value
    .split("\n")
    .filter((line) => !new RegExp(`^\\s*${QUESTION_TYPE_TAG_PATTERN.source}\\s*$`, "i").test(line))
    .map((line) => line.replace(globalPattern, "").trim())
    .join("\n")
    .trim();
}

export function stripEmojis(value: string | undefined | null): string {
  if (!value) return "";
  return value
    .replace(/\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?/gu, "")
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, "")
    .replace(/[0-9#*]\uFE0F?\u20E3/gu, "")
    .replace(/\u200D/gu, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ *\n */g, "\n")
    .trim();
}

const FRACTION_PATTERN =
  /(?<![\wπ/])(-?[A-Za-z0-9π]+°?)\/([A-Za-z0-9π]+°?)(?![\wπ/])/g;

function normalizeRoots(formula: string): string {
  let result = "";

  for (let index = 0; index < formula.length; index += 1) {
    if (formula[index] !== "√") {
      result += formula[index];
      continue;
    }

    let radicandStart = index + 1;
    while (formula[radicandStart] === " ") radicandStart += 1;

    if (formula[radicandStart] === "(") {
      let depth = 0;
      let radicandEnd = radicandStart;

      for (; radicandEnd < formula.length; radicandEnd += 1) {
        if (formula[radicandEnd] === "(") depth += 1;
        if (formula[radicandEnd] === ")") depth -= 1;
        if (depth === 0) break;
      }

      if (depth === 0) {
        const radicand = formula.slice(radicandStart + 1, radicandEnd);
        result += String.raw`\sqrt{${radicand}}`;
        index = radicandEnd;
        continue;
      }
    }

    const simpleRadicand = formula.slice(radicandStart).match(/^[A-Za-z0-9π]+(?:\.[0-9]+)?/);
    if (simpleRadicand) {
      result += String.raw`\sqrt{${simpleRadicand[0]}}`;
      index = radicandStart + simpleRadicand[0].length - 1;
      continue;
    }

    result += formula[index];
  }

  return result;
}

function normalizeMath(formula: string): string {
  return normalizeRoots(formula)
    // Convert simple slash fractions while leaving existing LaTeX commands untouched.
    .replace(FRACTION_PATTERN, String.raw`\frac{$1}{$2}`);
}

function renderMath(formula: string, displayMode: boolean): string {
  return katex.renderToString(normalizeMath(formula), {
    displayMode,
    throwOnError: false,
  });
}

function renderPlainTextMath(text: string): React.ReactNode[] {
  const ranges: Array<{ start: number; end: number }> = [];

  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "√") continue;

    let end = index + 1;
    while (text[end] === " ") end += 1;

    if (text[end] === "(") {
      let depth = 0;
      for (; end < text.length; end += 1) {
        if (text[end] === "(") depth += 1;
        if (text[end] === ")") depth -= 1;
        if (depth === 0) {
          end += 1;
          break;
        }
      }
    } else {
      const radicand = text.slice(end).match(/^[A-Za-z0-9π]+(?:\.[0-9]+)?/);
      if (radicand) end += radicand[0].length;
    }

    if (end > index + 1) ranges.push({ start: index, end });
  }

  for (const match of text.matchAll(FRACTION_PATTERN)) {
    const start = match.index;
    const end = start + match[0].length;
    if (!ranges.some((range) => start >= range.start && end <= range.end)) {
      ranges.push({ start, end });
    }
  }

  ranges.sort((left, right) => left.start - right.start);
  if (ranges.length === 0) return [text];

  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  ranges.forEach((range, index) => {
    if (range.start > cursor) nodes.push(text.slice(cursor, range.start));
    nodes.push(
      <span
        key={`math-${index}`}
        dangerouslySetInnerHTML={{
          __html: renderMath(text.slice(range.start, range.end), false),
        }}
        className="math-typeset inline-block"
      />,
    );
    cursor = range.end;
  });
  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes;
}

export function renderFormattedText(text: string | undefined | null): React.ReactNode {
  if (!text) return "";
  text = stripQuestionTypeTags(text);
  text = stripEmojis(text);
  
  // Split by $$ (block math) and $ (inline math)
  const mathParts = text.split(/(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g);

  return (
    <>
      {mathParts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2).trim();
          try {
            const html = renderMath(formula, true);
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
                className="math-typeset block my-2 overflow-x-auto"
              />
            );
          } catch (err) {
            console.error("KaTeX error:", err);
            return <code key={index} className="text-error">{part}</code>;
          }
        } else if (part.startsWith("$") && part.endsWith("$")) {
          const formula = part.slice(1, -1).trim();
          
          // Prevent standard currency strings ($3 for the first hour and $) from being parsed as inline math.
          // Inline LaTeX math typically doesn't contain multiple regular English words without math symbols.
          const wordCount = formula.split(/\s+/).length;
          const hasMathSymbol = /[=+\-*\/\\^{}()<>_]/.test(formula) || /^[a-zA-Z]$/.test(formula);
          const isCurrency = wordCount > 2 && !hasMathSymbol;
          
          if (isCurrency) {
            return part;
          }
          
          try {
            const html = renderMath(formula, false);
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
                className="math-typeset inline-block"
              />
            );
          } catch (err) {
            console.error("KaTeX error:", err);
            return <code key={index} className="text-error">{part}</code>;
          }
        } else {
          // Exponent parsing for regular text parts
          let normalized = part
            .replace(/²/g, "^2")
            .replace(/³/g, "^3")
            .replace(/⁴/g, "^4")
            .replace(/<sup>(.*?)<\/sup>/gi, "^$1");
            
          const subParts = normalized.split(/(\^[a-zA-Z0-9\-+]+)/g);
          
          return (
            <React.Fragment key={index}>
              {subParts.map((subPart, subIdx) => {
                if (subPart.startsWith("^")) {
                  const exponent = subPart.slice(1);
                  return (
                    <sup 
                      key={subIdx} 
                      style={{ 
                        fontSize: "0.95em", 
                        fontWeight: "normal", 
                        position: "relative", 
                        top: "-0.3em", 
                        margin: "0 0.05em",
                        display: "inline-block"
                      }}
                    >
                      {exponent}
                    </sup>
                  );
                }
                return renderPlainTextMath(subPart);
              })}
            </React.Fragment>
          );
        }
      })}
    </>
  );
}
