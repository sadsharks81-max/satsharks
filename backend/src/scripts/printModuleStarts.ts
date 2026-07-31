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

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  
  for (const tNum of [10, 11, 12]) {
    const qPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized.pdf`);
    const sPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized Answer Key.pdf`);
    
    console.log(`\n=========================================`);
    console.log(`SCANNING TEST ${tNum} FOR BOUNDARIES`);
    console.log(`=========================================`);
    
    const qPages = await extractPagesText(qPath);
    console.log("--- QUESTIONS ---");
    for (const p of qPages) {
      const lower = p.text.toLowerCase();
      // Match question start on page
      const q1Match = p.text.split("\n").some(l => /^(Question|Q)\s*1\b/i.test(l.trim()));
      
      const tags: string[] = [];
      if (lower.includes("reading") || lower.includes("writing")) tags.push("RW");
      if (lower.includes("math")) tags.push("MATH");
      if (lower.includes("easier") || lower.includes("easy")) tags.push("EASY");
      if (lower.includes("harder") || lower.includes("hard")) tags.push("HARD");
      if (lower.includes("module 1")) tags.push("MOD1");
      if (lower.includes("module 2")) tags.push("MOD2");
      if (q1Match) tags.push("Q1_FOUND");
      
      console.log(`Page ${p.pageNum} | tags: [${tags.join(", ")}] | text snippet: "${p.text.slice(0, 100).replace(/\n/g, " ")}..."`);
    }
    
    const sPages = await extractPagesText(sPath);
    console.log("--- SOLUTIONS ---");
    for (const p of sPages) {
      const lower = p.text.toLowerCase();
      // Match solution Q1 start on page
      const sol1Match = p.text.split("\n").some(l => /^Q1\b|Question\s+1\b/i.test(l.trim()));
      
      const tags: string[] = [];
      if (lower.includes("reading") || lower.includes("writing")) tags.push("RW");
      if (lower.includes("math")) tags.push("MATH");
      if (lower.includes("easier") || lower.includes("easy")) tags.push("EASY");
      if (lower.includes("harder") || lower.includes("hard")) tags.push("HARD");
      if (lower.includes("module 1")) tags.push("MOD1");
      if (lower.includes("module 2")) tags.push("MOD2");
      if (sol1Match) tags.push("SOL1_FOUND");
      
      console.log(`Page ${p.pageNum} | tags: [${tags.join(", ")}] | text snippet: "${p.text.slice(0, 100).replace(/\n/g, " ")}..."`);
    }
  }
}

main().catch(console.error);
