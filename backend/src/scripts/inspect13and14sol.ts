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

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const p13 = path.join(dir, "SAT Practice Test 13 Answer Key.pdf");
  const p14 = path.join(dir, "SAT Practice Test 14 Answer Key.pdf");
  
  if (fs.existsSync(p13)) {
    const text = await extractLayoutText(p13);
    const lines = text.split("\n");
    console.log("=== TEST 13 ANSWER KEY ===");
    for (let i = 0; i < 40; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
  if (fs.existsSync(p14)) {
    const text = await extractLayoutText(p14);
    const lines = text.split("\n");
    console.log("=== TEST 14 ANSWER KEY ===");
    for (let i = 0; i < 40; i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
}

main().catch(console.error);
