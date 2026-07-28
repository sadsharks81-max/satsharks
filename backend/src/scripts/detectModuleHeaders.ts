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
  const dir = path.resolve(__dirname, "../../../digitalsatpapers2");
  
  for (const tNum of [10, 11, 12]) {
    const qPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized.pdf`);
    const sPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized Answer Key.pdf`);
    
    console.log(`\n=========================================`);
    console.log(`INSPECTING HEADERS FOR TEST ${tNum}`);
    console.log(`=========================================`);
    
    const qPages = await extractPagesText(qPath);
    console.log(`--- QUESTIONS PDF (${qPages.length} pages) ---`);
    for (const page of qPages) {
      const lines = page.text.split("\n").map(l => l.trim());
      const matches = lines.filter(line => {
        const lower = line.toLowerCase();
        return (lower.includes("module") || lower.includes("section")) && (lower.includes("reading") || lower.includes("writing") || lower.includes("math") || lower.includes("easy") || lower.includes("hard"));
      });
      if (matches.length > 0) {
        console.log(`Page ${page.pageNum}:`, matches.slice(0, 3).map(m => `"${m}"`).join(", "));
      } else {
        console.log(`Page ${page.pageNum}: [NO MATCH]`);
      }
    }
    
    const sPages = await extractPagesText(sPath);
    console.log(`\n--- SOLUTIONS PDF (${sPages.length} pages) ---`);
    for (const page of sPages) {
      const lines = page.text.split("\n").map(l => l.trim());
      const matches = lines.filter(line => {
        const lower = line.toLowerCase();
        return (lower.includes("module") || lower.includes("section")) && (lower.includes("reading") || lower.includes("writing") || lower.includes("math") || lower.includes("easy") || lower.includes("hard"));
      });
      if (matches.length > 0) {
        console.log(`Page ${page.pageNum}:`, matches.slice(0, 3).map(m => `"${m}"`).join(", "));
      } else {
        console.log(`Page ${page.pageNum}: [NO MATCH]`);
      }
    }
  }
}

main().catch(console.error);
