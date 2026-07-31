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

function parseQuestionsList(text: string): { num: number; text: string; options: string[] }[] {
  const questions: { num: number; text: string; options: string[] }[] = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  
  let currentQ: { num: number; text: string; options: string[] } | null = null;
  let textLines: string[] = [];
  
  const flushQ = () => {
    if (currentQ) {
      currentQ.text = textLines.join(" ").trim();
      questions.push(currentQ);
    }
    currentQ = null;
    textLines = [];
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
    
    const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
    if (qMatch) {
      flushQ();
      currentQ = {
        num: parseInt(qMatch[2], 10),
        text: "",
        options: []
      };
      
      // If there is skill/difficulty metadata on the same line, or in rest of text, we can skip processing it as question text
      const rest = cleanLine.substring(qMatch[0].length).trim();
      if (rest.length > 0 && !rest.toLowerCase().startsWith("skill:") && !rest.toLowerCase().startsWith("—skill:")) {
        textLines.push(rest);
      }
      continue;
    }
    
    if (!currentQ) continue;
    
    // Check options
    const optMatch = cleanLine.match(/^([A-D])\)\s*(.*)/) || cleanLine.match(/^([A-D])\.\s*(.*)/);
    if (optMatch) {
      currentQ.options.push(cleanLine);
      continue;
    }
    
    // Append to text if not options/skills metadata
    if (!cleanLine.toLowerCase().startsWith("skill:") && !cleanLine.toLowerCase().startsWith("difficulty:")) {
      textLines.push(cleanLine);
    }
  }
  flushQ();
  return questions;
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
    
    // Skip quick reference grid lines by checking if there are multiple Qs on the line
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
      // Try to find inline answer
      // e.g. "— Answer:D" or "— Correct Answer: D" or "| Correct Answer: D" or ":D" or ": D" or "D" (for Q1:D)
      const ansMatch = rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                       rest.match(/(?:Correct\s+)?Answer:\s*\)\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                       rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i) ||
                       rest.match(/^[:|\-\s]*([A-D])\b/i) ||
                       rest.match(/^([A-D])\b/i); // Matches D in Q1:D
      if (ansMatch && currentSol) {
        currentSol.answer = ansMatch[1].toUpperCase();
      }
      
      const explRest = rest.replace(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i, "")
                          .replace(/^[:|\-\s]*/, "")
                          .replace(/^[A-D]\b/, "") // Remove inline letter answer if any
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
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf") && !f.includes("Answer Key")).sort();
  
  for (const f of files) {
    const testNum = f.match(/\d+/)![0];
    const qPath = path.join(dir, f);
    const sPath = path.join(dir, `SAT Practice Test ${testNum} Answer Key.pdf`);
    
    if (!fs.existsSync(sPath)) {
      console.log(`Test ${testNum}: Solution key missing`);
      continue;
    }
    
    try {
      const qText = await extractLayoutText(qPath);
      const sText = await extractLayoutText(sPath);
      
      const questions = parseQuestionsList(qText);
      const solutions = parseSolutionsList(sText);
      
      console.log(`Test ${testNum}: Questions Parsed = ${questions.length}, Solutions Parsed = ${solutions.length}`);
      if (questions.length !== 147 || solutions.length !== 147) {
        console.warn(`  WARNING: Count is not 147! Questions: ${questions.length}, Solutions: ${solutions.length}`);
      }
    } catch (e: any) {
      console.error(`Error on test ${testNum}:`, e.message);
    }
  }
}

main().catch(console.error);
