import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
}

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const p = path.join(dir, "SAT Practice Test 10 Answer Key.pdf");
  
  if (!fs.existsSync(p)) {
    console.log("File not found:", p);
    return;
  }
  
  console.log("Loading PDF...");
  const data = new Uint8Array(fs.readFileSync(p));
  
  try {
    const loadingTask = pdfjsLegacy.getDocument({ data });
    const pdf = await loadingTask.promise;
    
    const page = await pdf.getPage(2); // page 2
    const textContent = await page.getTextContent();
    
    const items: TextItem[] = textContent.items.map((item: any) => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5]
    }));
    
    // Sort items by y descending first
    items.sort((a, b) => b.y - a.y);
    
    // Group into lines with y-tolerance of 3
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
    
    // Sort each line by x ascending and construct line strings
    const sortedLinesText = lines.map(line => {
      line.sort((a, b) => a.x - b.x);
      return line.map(item => item.str).join("").trim();
    }).filter(l => l.length > 0);
    
    const pageText = sortedLinesText.join("\n");
    console.log("=== RECONSTRUCTED TEXT ===");
    console.log(pageText.substring(0, 2000));
  } catch (e) {
    console.error("Error:", e);
  }
}

main().catch(console.error);
