import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";
import { parsePracticeQuestionDocument } from "../utils/practice-question-parser";

async function main() {
  const requestedPath = process.argv[2];
  if (!requestedPath) {
    throw new Error("Usage: npm run validate:practice-pdf -- <path-to-pdf>");
  }

  const pdfPath = path.resolve(process.cwd(), requestedPath);
  if (path.extname(pdfPath).toLowerCase() !== ".pdf") {
    throw new Error("The input file must be a PDF.");
  }

  const parser = new PDFParse({ data: await fs.readFile(pdfPath) });
  try {
    const result = parsePracticeQuestionDocument((await parser.getText()).text);
    if (result.errors.length > 0) {
      console.error(`PDF validation failed with ${result.errors.length} error(s):`);
      result.errors.forEach((error) => console.error(`- ${error}`));
      process.exitCode = 1;
      return;
    }

    console.log(`PDF format is valid. Recognized ${result.questions.length} question(s).`);
  } finally {
    await parser.destroy();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
