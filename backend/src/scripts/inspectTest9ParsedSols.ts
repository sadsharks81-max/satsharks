import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
}

async function extractLayoutText(pdfPath: string): Promise<string> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLegacy.getDocument({ data });
  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const items: TextItem[] = textContent.items.map((item: any) => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5]
    }));
    
    items.sort((a, b) => b.y - a.y);
    
    const lines: TextItem[][] = [];
    for (const item of items) {
      let placed = false;
      for (const line of lines) {
        if (Math.abs(line[0].y - item.y) <= 3) {
          line.push(item);
          placed = true;
          break;
        }
      }
      if (!placed) {
        lines.push([item]);
      }
    }
    
    const pageText = lines.map(line => {
      line.sort((a, b) => a.x - b.x);
      return line.map(item => item.str).join("").trim();
    }).filter(l => l.length > 0).join("\n");
    
    fullText += pageText + `\n-- page ${pageNum} --\n`;
  }
  return fullText;
}

function parseSolutionsList(text: string): { num: number; answer: string; explanation: string }[] {
  const solutions: { num: number; answer: string; explanation: string }[] = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  let currentSol: { num: number; answer: string; explanation: string } | null = null;
  let explLines: string[] = [];
  
  const flushSol = () => {
    if (currentSol) {
      currentSol.explanation = explLines.join(" ").trim();
      solutions.push(currentSol);
    }
    currentSol = null;
    explLines = [];
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
    
    const qCount = (cleanLine.match(/\bQ\d+\b/gi) || []).length + (cleanLine.match(/\bQuestion\s+\d+/gi) || []).length;
    if (qCount > 1) {
      continue;
    }
    
    const isQuestionWord = cleanLine.match(/^Question\s*(\d+)(?!\d)/i);
    const isQShortWithSeparator = cleanLine.match(/^Q(\d+)\s*[:|—\-.]/i);
    
    if (isQuestionWord || isQShortWithSeparator) {
      flushSol();
      const qNumStr = isQuestionWord ? isQuestionWord[1] : isQShortWithSeparator![1];
      const matchedLength = isQuestionWord ? isQuestionWord[0].length : isQShortWithSeparator![0].length;
      
      currentSol = {
        num: parseInt(qNumStr, 10),
        answer: "",
        explanation: ""
      };
      
      const rest = cleanLine.substring(matchedLength).trim();
      const ansMatch = rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                       rest.match(/(?:Correct\s+)?Answer:\s*\)\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                       rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i) ||
                       rest.match(/^[:|\-\s]*([A-D])\b/i) ||
                       rest.match(/^([A-D])\b/i);
      if (ansMatch && currentSol) {
        currentSol.answer = ansMatch[1].toUpperCase();
      }
      
      const explRest = rest.replace(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i, "")
                          .replace(/^[:|\-\s]*/, "")
                          .replace(/^[A-D]\b/, "")
                          .trim();
      if (explRest.length > 0 && explRest !== currentSol.answer) {
        explLines.push(explRest);
      }
      continue;
    }
    
    if (!currentSol) continue;
    
    if (cleanLine.toLowerCase().startsWith("correct answer:")) {
      const rawAns = cleanLine.replace(/^correct answer:\s*/i, "").trim();
      const ansMatch = rawAns.match(/^([A-D])\b/i) || rawAns.match(/^\)\s*([A-D])\b/i) || rawAns.match(/^([0-9\.\/-]+)\b/i);
      if (ansMatch) {
        currentSol.answer = ansMatch[1].toUpperCase();
      } else {
        currentSol.answer = rawAns;
      }
      continue;
    }
    
    explLines.push(cleanLine);
  }
  flushSol();
  return solutions;
}

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const sPdfPath = path.join(dir, `SAT Practice Test 9 Answer Key.pdf`);
  const sText = await extractLayoutText(sPdfPath);
  const solutions = parseSolutionsList(sText);
  console.log(`Parsed solutions: ${solutions.length}`);
  for (let idx = 0; idx < solutions.length; idx++) {
    const sol = solutions[idx];
    if (!sol.answer) {
      console.log(`EMPTY ANSWER AT [${idx}]: Q${sol.num} explanation snippet: "${sol.explanation.substring(0, 150)}"`);
    }
  }
}

main().catch(console.error);
