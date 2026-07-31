import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
}

async function extractPageFirstLine(pdfPath: string, pageNum: number): Promise<string> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLegacy.getDocument({ data });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNum);
  const textContent = await page.getTextContent();
  
  const items: TextItem[] = textContent.items.map((item: any) => ({
    str: item.str,
    x: item.transform[4],
    y: item.transform[5]
  }));
  
  items.sort((a, b) => b.y - a.y);
  if (items.length === 0) return "";
  
  const topY = items[0].y;
  const topItems = items.filter(item => Math.abs(item.y - topY) <= 3);
  topItems.sort((a, b) => a.x - b.x);
  return topItems.map(item => item.str).join("").trim();
}

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const qPath = path.join(dir, `SAT Practice Test 11 - Standardized.pdf`);
  
  const data = new Uint8Array(fs.readFileSync(qPath));
  const pdf = await pdfjsLegacy.getDocument({ data }).promise;
  
  console.log(`=== TEST 11 QUESTIONS PAGE TITLE TRACE (Page 40 to ${pdf.numPages}) ===`);
  for (let p = 40; p <= pdf.numPages; p++) {
    const line = await extractPageFirstLine(qPath, p);
    console.log(`Page ${p}: "${line}"`);
  }
}

main().catch(console.error);
