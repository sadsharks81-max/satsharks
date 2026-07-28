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
  const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".pdf") && !f.includes("Answer Key")).sort();
  
  for (const f of files) {
    const testNum = f.match(/\d+/)![0];
    const qPath = path.join(dir, f);
    try {
      const qText = await extractLayoutText(qPath);
      const lines = qText.split("\n");
      let skillCount = 0;
      for (const line of lines) {
        if (line.toLowerCase().includes("skill:")) {
          skillCount++;
        }
      }
      console.log(`Test ${testNum}: Skill lines count = ${skillCount}`);
    } catch (e: any) {
      console.error(`Error on test ${testNum}:`, e.message);
    }
  }
}

main().catch(console.error);
