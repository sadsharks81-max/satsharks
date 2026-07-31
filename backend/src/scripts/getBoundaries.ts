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
    console.log(`ANALYZING BOUNDARIES FOR TEST ${tNum}`);
    console.log(`=========================================`);
    
    const qPages = await extractPagesText(qPath);
    console.log(`Questions page count: ${qPages.length}`);
    
    let rwMod1Start = 0;
    let rwMod2EasyStart = 0;
    let rwMod2HardStart = 0;
    let mathMod1Start = 0;
    let mathMod2EasyStart = 0;
    let mathMod2HardStart = 0;
    
    for (const p of qPages) {
      const text = p.text;
      const lower = text.toLowerCase();
      
      const isRW = lower.includes("reading") || lower.includes("writing") || lower.includes("s1");
      const isMath = lower.includes("math") || lower.includes("s2");
      const isMod1 = lower.includes("module 1");
      const isMod2 = lower.includes("module 2");
      const isEasy = lower.includes("easier") || lower.includes("easy");
      const isHard = lower.includes("harder") || lower.includes("hard");
      
      if (isRW) {
        if (isMod1 || text.includes("MODULE 1")) {
          if (rwMod1Start === 0) rwMod1Start = p.pageNum;
        } else if (isMod2 || text.includes("MODULE 2")) {
          if (isEasy && rwMod2EasyStart === 0) {
            rwMod2EasyStart = p.pageNum;
          } else if (isHard && rwMod2HardStart === 0) {
            rwMod2HardStart = p.pageNum;
          }
        }
      }
      
      if (isMath) {
        if (isMod1 || text.includes("MODULE 1")) {
          if (mathMod1Start === 0) mathMod1Start = p.pageNum;
        } else if (isMod2 || text.includes("MODULE 2")) {
          if (isEasy && mathMod2EasyStart === 0) {
            mathMod2EasyStart = p.pageNum;
          } else if (isHard && mathMod2HardStart === 0) {
            mathMod2HardStart = p.pageNum;
          }
        }
      }
    }
    
    console.log("Questions Detected boundaries:");
    console.log(`  RW Module 1 start: Page ${rwMod1Start}`);
    console.log(`  RW Module 2 Easier start: Page ${rwMod2EasyStart}`);
    console.log(`  RW Module 2 Harder start: Page ${rwMod2HardStart}`);
    console.log(`  Math Module 1 start: Page ${mathMod1Start}`);
    console.log(`  Math Module 2 Easier start: Page ${mathMod2EasyStart}`);
    console.log(`  Math Module 2 Harder start: Page ${mathMod2HardStart}`);
    
    const sPages = await extractPagesText(sPath);
    console.log(`Solutions page count: ${sPages.length}`);
    
    let solRwMod1Start = 0;
    let solRwMod2EasyStart = 0;
    let solRwMod2HardStart = 0;
    let solMathMod1Start = 0;
    let solMathMod2EasyStart = 0;
    let solMathMod2HardStart = 0;
    
    for (const p of sPages) {
      const text = p.text;
      const lower = text.toLowerCase();
      
      const isRW = lower.includes("reading") || lower.includes("writing") || lower.includes("s1");
      const isMath = lower.includes("math") || lower.includes("s2");
      const isMod1 = lower.includes("module 1");
      const isMod2 = lower.includes("module 2");
      const isEasy = lower.includes("easier") || lower.includes("easy");
      const isHard = lower.includes("harder") || lower.includes("hard");
      
      if (isRW) {
        if (isMod1 || text.includes("MODULE 1") || text.includes("Module 1")) {
          if (solRwMod1Start === 0) solRwMod1Start = p.pageNum;
        } else if (isMod2 || text.includes("MODULE 2") || text.includes("Module 2")) {
          if (isEasy && solRwMod2EasyStart === 0) {
            solRwMod2EasyStart = p.pageNum;
          } else if (isHard && solRwMod2HardStart === 0) {
            solRwMod2HardStart = p.pageNum;
          }
        }
      }
      
      if (isMath) {
        if (isMod1 || text.includes("MODULE 1") || text.includes("Module 1")) {
          if (solMathMod1Start === 0) solMathMod1Start = p.pageNum;
        } else if (isMod2 || text.includes("MODULE 2") || text.includes("Module 2")) {
          if (isEasy && solMathMod2EasyStart === 0) {
            solMathMod2EasyStart = p.pageNum;
          } else if (isHard && solMathMod2HardStart === 0) {
            solMathMod2HardStart = p.pageNum;
          }
        }
      }
    }
    
    console.log("Solutions Detected boundaries:");
    console.log(`  RW Module 1 start: Page ${solRwMod1Start}`);
    console.log(`  RW Module 2 Easier start: Page ${solRwMod2EasyStart}`);
    console.log(`  RW Module 2 Harder start: Page ${solRwMod2HardStart}`);
    console.log(`  Math Module 1 start: Page ${solMathMod1Start}`);
    console.log(`  Math Module 2 Easier start: Page ${solMathMod2EasyStart}`);
    console.log(`  Math Module 2 Harder start: Page ${solMathMod2HardStart}`);
  }
}

main().catch(console.error);
