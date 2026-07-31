import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

async function main() {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const qPath = path.join(dir, `SAT Practice Test 12 - Standardized.pdf`);
  const data = new Uint8Array(fs.readFileSync(qPath));
  const pdf = await pdfjsLegacy.getDocument({ data }).promise;
  
  console.log("=== SEARCHING FOR Q27 IN TEST 12 ===");
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((x: any) => x.str).join(" ");
    if (text.includes("Question 27") || text.includes("Q27")) {
      console.log(`Page ${pageNum} contains Q27/Question 27: "${text.slice(0, 200)}"`);
    }
  }
}

main().catch(console.error);
