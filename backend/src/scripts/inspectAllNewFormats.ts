import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

async function extractText(filePath: string, type: "pdf" | "docx" | "md"): Promise<string> {
  if (type === "md") {
    return fs.readFileSync(filePath, "utf-8");
  } else if (type === "docx") {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (e) {
      return "ERROR DOCX: " + e;
    }
  } else {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const parser = new PDFParse({ data: dataBuffer });
      const result = await parser.getText();
      await parser.destroy();
      return result.text;
    } catch (e) {
      return "ERROR PDF: " + e;
    }
  }
}

async function run() {
  const dir = "s:\\github\\my-daily-compass\\practicequestions2";
  const files = fs.readdirSync(dir).filter(f => !f.includes("(1)"));
  
  // Group files by prefix to inspect different files
  const prefixes = [
    "AP",
    "CompAngleTrig",
    "Conditional Probability",
    "Coordinate Geometry",
    "DI",
    "DSAT_01",
    "DSAT_Circle",
    "DSAT_Coefficients",
    "DSAT_Exponential",
    "DSAT_LinearGraphs",
    "DSAT_Linear_Equations",
    "DSAT_Linear_Inequalities",
    "DSAT_Linear_Models",
    "DSAT_Percentages",
    "DSAT_Probability",
    "DSAT_Quadratic",
    "DSAT_Questions",
    "DSAT_Ratios",
    "DSAT_Right",
    "DSAT_Statistics",
    "DSAT_Systems_V2",
    "DSAT_Systems_of_Linear",
    "DSAT_Topic1",
    "Discriminant",
    "Equivalent Expressions",
    "ExponentRules",
    "Exponential Equations",
    "Exponential vs Linear",
    "Function Transformations",
    "Function_Notation",
    "LA",
    "LM",
    "Literal Equations",
    "NonlinearSystems",
    "Parallel and Perpendicular",
    "Quadratic Word Problems",
    "Radian Degree",
    "Radical and Rational",
    "Rational Expressions",
    "Similar Triangles",
    "SpecialRightTriangles",
    "Standard Deviation",
    "Statistical Inference",
    "TP",
    "UnitConversion",
    "VSA"
  ];
  
  for (const prefix of prefixes) {
    const qFile = files.find(f => f.startsWith(prefix) && (f.toLowerCase().includes("questions") || f.toLowerCase().includes("question")));
    const sFile = files.find(f => f.startsWith(prefix) && (f.toLowerCase().includes("solutions") || f.toLowerCase().includes("solution")));
    
    if (qFile && sFile) {
      console.log(`\n======================================================`);
      console.log(`PREFIX: ${prefix}`);
      console.log(`Q file: ${qFile} | S file: ${sFile}`);
      console.log(`======================================================`);
      
      const qExt = path.extname(qFile).substring(1) as any;
      const sExt = path.extname(sFile).substring(1) as any;
      
      const qText = await extractText(path.join(dir, qFile), qExt);
      const sText = await extractText(path.join(dir, sFile), sExt);
      
      console.log(`[Q TEXT FIRST 200 CHARS]:`);
      console.log(qText.substring(0, 400).replace(/\n+/g, "\n"));
      
      console.log(`[S TEXT FIRST 200 CHARS]:`);
      console.log(sText.substring(0, 400).replace(/\n+/g, "\n"));
    }
  }
}

run().catch(console.error);
