import "../config/env";
import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

async function extractText(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: dataBuffer });
  const result = await parser.getText();
  await parser.destroy();
  return result.text;
}

async function main() {
  const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
  const qPath = path.join(dir, "SAT Practice Test 10.pdf");
  const sPath = path.join(dir, "SAT Practice Test 10 Answer Key.pdf");

  if (!fs.existsSync(qPath) || !fs.existsSync(sPath)) {
    console.error("Test 10 files not found.");
    return;
  }

  const qText = await extractText(qPath);
  const sText = await extractText(sPath);

  console.log("QText length:", qText.length);
  console.log("SText length:", sText.length);

  // Let's write the raw texts to temp files so we can inspect their layout
  fs.writeFileSync("s:\\github\\my-daily-compass\\qText_10.txt", qText, "utf-8");
  fs.writeFileSync("s:\\github\\my-daily-compass\\sText_10.txt", sText, "utf-8");
  console.log("Raw text saved to qText_10.txt and sText_10.txt");
}

main().catch(console.error);
