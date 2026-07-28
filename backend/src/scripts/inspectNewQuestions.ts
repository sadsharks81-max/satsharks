import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

async function extractText(filePath: string, type: "pdf" | "docx" | "md"): Promise<string> {
  if (type === "md") {
    return fs.readFileSync(filePath, "utf-8");
  } else if (type === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }
}

async function run() {
  const dir = "s:\\github\\my-daily-compass\\practicequestions2";
  const files = fs.readdirSync(dir);
  console.log(`Found ${files.length} files.`);
  
  // Let's inspect a DOCX file
  const docxFile = files.find(f => f.endsWith("_Questions.docx") || f.endsWith("_QUESTIONS.docx") || f.endsWith("Questions.docx"));
  if (docxFile) {
    const p = path.join(dir, docxFile);
    console.log(`\n--- Inspecting DOCX Questions: ${docxFile} ---`);
    const text = await extractText(p, "docx");
    console.log(text.substring(0, 1500));
  }
  
  const docxSolFile = files.find(f => f.endsWith("_Solutions.docx") || f.endsWith("_SOLUTIONS.docx") || f.endsWith("Solutions.docx"));
  if (docxSolFile) {
    const p = path.join(dir, docxSolFile);
    console.log(`\n--- Inspecting DOCX Solutions: ${docxSolFile} ---`);
    const text = await extractText(p, "docx");
    console.log(text.substring(0, 1500));
  }

  // Let's inspect a PDF file
  const pdfFile = files.find(f => f.endsWith("_Questions.pdf") || f.endsWith("_QUESTIONS.pdf") || f.endsWith("Questions.pdf") || (f.includes("Questions") && f.endsWith(".pdf")));
  if (pdfFile) {
    const p = path.join(dir, pdfFile);
    console.log(`\n--- Inspecting PDF Questions: ${pdfFile} ---`);
    const text = await extractText(p, "pdf");
    console.log(text.substring(0, 1500));
  }
  
  const pdfSolFile = files.find(f => f.endsWith("_Solutions.pdf") || f.endsWith("_SOLUTIONS.pdf") || f.endsWith("Solutions.pdf") || (f.includes("Solutions") && f.endsWith(".pdf")));
  if (pdfSolFile) {
    const p = path.join(dir, pdfSolFile);
    console.log(`\n--- Inspecting PDF Solutions: ${pdfSolFile} ---`);
    const text = await extractText(p, "pdf");
    console.log(text.substring(0, 1500));
  }
}

run().catch(console.error);
