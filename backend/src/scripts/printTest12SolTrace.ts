import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
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
    
    pages.push({ text: pageText, pageNum });
  }
  return pages;
}

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const sPath = path.join(dir, `SAT Practice Test 12 - Standardized Answer Key.pdf`);
  const pages = await extractPagesText(sPath);
  
  console.log("=== TEST 12 SOLUTIONS TRACE ===");
  for (const p of pages) {
    const lines = p.text.split("\n");
    for (const line of lines) {
      const cleanLine = line.trim();
      const qMatch = cleanLine.match(/^Question\s*(\d+)\b/i) || cleanLine.match(/^Q(\d+)\b/i);
      if (qMatch) {
        console.log(`Page ${p.pageNum} | Q${qMatch[1]} | "${cleanLine.slice(0, 80)}"`);
      }
    }
  }
}

main().catch(console.error);
