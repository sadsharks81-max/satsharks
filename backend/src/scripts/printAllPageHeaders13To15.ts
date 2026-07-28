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

async function extractPageFirstLines(pdfPath: string, pageNum: number): Promise<string[]> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLegacy.getDocument({ data });
  const pdf = await loadingTask.promise;
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
  
  return lines.map(line => {
    line.sort((a, b) => a.x - b.x);
    return line.map(item => item.str).join("").trim();
  }).filter(l => l.length > 0);
}

async function main() {
  const dir = path.resolve(__dirname, "../../../digitalsatpapers2");
  
  for (const tNum of [13, 14, 15]) {
    const qPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized.pdf`);
    const sPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized Answer Key.pdf`);
    
    if (!fs.existsSync(qPath) || !fs.existsSync(sPath)) {
      console.log(`Test ${tNum} PDFs not found.`);
      continue;
    }
    
    console.log(`\n======================================================`);
    console.log(`PAGE DETAILS FOR TEST ${tNum}`);
    console.log(`======================================================`);
    
    const qData = new Uint8Array(fs.readFileSync(qPath));
    const qPdf = await pdfjsLegacy.getDocument({ data: qData }).promise;
    
    console.log(`--- QUESTIONS PDF (${qPdf.numPages} pages) ---`);
    for (let p = 1; p <= qPdf.numPages; p++) {
      const lines = await extractPageFirstLines(qPath, p);
      console.log(`Page ${p}: [${lines.slice(0, 3).map(l => `"${l}"`).join(", ")}]`);
    }
    
    const sData = new Uint8Array(fs.readFileSync(sPath));
    const sPdf = await pdfjsLegacy.getDocument({ data: sData }).promise;
    
    console.log(`\n--- SOLUTIONS PDF (${sPdf.numPages} pages) ---`);
    for (let p = 1; p <= sPdf.numPages; p++) {
      const lines = await extractPageFirstLines(sPath, p);
      console.log(`Page ${p}: [${lines.slice(0, 3).map(l => `"${l}"`).join(", ")}]`);
    }
  }
}

main().catch(console.error);
