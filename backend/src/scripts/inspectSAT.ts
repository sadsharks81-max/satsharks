import { readFileSync } from "node:fs";
import { PDFParse } from "pdf-parse";
import path from "path";

const pdfDir = path.resolve(__dirname, "../../../satpapers");
const files = ["SAT2.pdf", "SAT3.pdf", "SAT4.pdf", "SAT5.pdf", "SAT8.pdf"];

function normalizeLine(line: string) {
  return line.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}

async function run() {
  for (const file of files) {
    console.log(`\n=== ${file} ===`);
    const data = readFileSync(path.join(pdfDir, file));
    const parser = new PDFParse({ data });
    const result = await parser.getText();
    const lines = normalizeLine(result.text)
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);
    const sectionLines = lines.filter((line) => /SECTION/i.test(line));
    console.log("Section lines:", sectionLines.slice(0, 20));
    const questionLines = lines.filter((line) => /^Question\s+\d+/i.test(line));
    console.log("First 20 question lines:", questionLines.slice(0, 20));
    const sample = lines.slice(0, 80);
    sample.forEach((line, i) => {
      if (i < 40) console.log(`${i + 1}: ${line}`);
    });
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
