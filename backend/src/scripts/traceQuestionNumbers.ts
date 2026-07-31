import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
  width: number;
}

async function extractPagesText(pdfPath: string): Promise<{ text: string; pageNum: number }[]> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLegacy.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pages: { text: string; pageNum: number }[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const items: TextItem[] = textContent.items.map((item: any) => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width
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
    
    pages.push({ text: pageText, pageNum });
  }
  return pages;
}

function shouldSkipLine(line: string): boolean {
  const clean = line.trim();
  if (!clean) return true;
  if (/^--\s*page\s*\d+\s*--$/i.test(clean)) return true;
  if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(clean)) return true;
  if (/^[\d\s−\-–/]+$/i.test(clean)) return true;
  const lower = clean.toLowerCase();
  if (/^section\s+\d/i.test(clean)) return true;
  if (lower.includes("module") && (lower.includes("math") || lower.includes("reading") || lower.includes("writing") || lower.includes("adaptive"))) return true;
  if (lower.includes("questions") && (lower.includes("minutes") || lower.includes("limit"))) return true;
  if (lower.includes("minutes") && lower.includes("|")) return true;
  if (lower.includes("time:") || lower.includes("time limit") || /^time\s+limit/i.test(clean)) return true;
  if (/^\(?q\d+[-–—−]\d+\)?$/i.test(clean)) return true;
  if (lower.startsWith("directions")) return true;
  if (lower.startsWith("for questions") && lower.includes("solve")) return true;
  if (lower.includes("student-produced response") || lower.includes("enter your answer") || lower.includes("disregard the unit symbol")) return true;
  if (/^[=\-−–—\s]+$/.test(clean)) return true;
  return false;
}

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  
  for (const tNum of [10, 11, 12]) {
    const qPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized.pdf`);
    const sPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized Answer Key.pdf`);
    
    console.log(`\n=========================================`);
    console.log(`TRACING QUESTIONS FOR TEST ${tNum}`);
    console.log(`=========================================`);
    
    const qPages = await extractPagesText(qPath);
    for (const page of qPages) {
      const lines = page.text.split("\n").map(l => l.trim());
      for (const line of lines) {
        if (shouldSkipLine(line)) continue;
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
        if (qMatch) {
          console.log(`Page ${page.pageNum} | Question ${qMatch[2]}`);
        }
      }
    }
    
    console.log(`\n=========================================`);
    console.log(`TRACING SOLUTIONS FOR TEST ${tNum}`);
    console.log(`=========================================`);
    
    const sPages = await extractPagesText(sPath);
    for (const page of sPages) {
      const lines = page.text.split("\n").map(l => l.trim());
      for (const line of lines) {
        if (shouldSkipLine(line)) continue;
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        
        const qCount = (cleanLine.match(/\bQ\d+\b/gi) || []).length + (cleanLine.match(/\bQuestion\s+\d+/gi) || []).length;
        if (qCount > 1) continue;
        
        const isQuestionWord = cleanLine.match(/^Question\s*(\d+)(?!\d)/i);
        const isQShortWithSeparator = cleanLine.match(/^Q(\d+)(?:\s*[:|—\-.]|\s+([A-D])(?=[A-Z\s]|$))/i);
        
        if (isQuestionWord || isQShortWithSeparator) {
          const qNum = isQuestionWord ? isQuestionWord[1] : isQShortWithSeparator![1];
          console.log(`Page ${page.pageNum} | Sol Q${qNum} | "${cleanLine.slice(0, 50)}..."`);
        }
      }
    }
  }
}

main().catch(console.error);
