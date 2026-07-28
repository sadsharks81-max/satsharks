import { readFileSync, existsSync } from "node:fs";
import { PDFParse } from "pdf-parse";
import { parseSATText } from "./importAllSAT";
import path from "path";

async function main() {
  const pdfDir = path.resolve(__dirname, "../../../satpapers");
  for (let i = 1; i <= 8; i++) {
    const file = `SAT${i}.pdf`;
    const pdfPath = path.join(pdfDir, file);
    if (!existsSync(pdfPath)) {
      console.log(`${file} does not exist.`);
      continue;
    }
    const buf = readFileSync(pdfPath);
    const parser = new PDFParse({ data: buf });
    const result = await parser.getText();
    await parser.destroy();
    
    const modules = parseSATText(result.text);
    console.log(`\n=== Verification for ${file} ===`);
    console.log(`Number of modules: ${modules.length}`);
    let totalQuestions = 0;
    modules.forEach((mod) => {
      console.log(`  Module: "${mod.sectionName}" - Questions: ${mod.questions.length}`);
      totalQuestions += mod.questions.length;
    });
    console.log(`Total questions: ${totalQuestions}`);
    if (totalQuestions !== 98) {
      console.error(`ERROR: Expected 98 questions, got ${totalQuestions} for ${file}`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
