import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

async function main() {
  const dir = path.resolve(__dirname, "../../../digitalsatpapers2");
  
  for (const tNum of [10, 11, 12]) {
    const qPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized.pdf`);
    const sPath = path.join(dir, `SAT Practice Test ${tNum} - Standardized Answer Key.pdf`);
    
    if (fs.existsSync(qPath) && fs.existsSync(sPath)) {
      const qData = new Uint8Array(fs.readFileSync(qPath));
      const qPdf = await pdfjsLegacy.getDocument({ data: qData }).promise;
      
      const sData = new Uint8Array(fs.readFileSync(sPath));
      const sPdf = await pdfjsLegacy.getDocument({ data: sData }).promise;
      
      console.log(`Test ${tNum}:`);
      console.log(`- Questions PDF: ${qPdf.numPages} pages`);
      console.log(`- Solutions PDF: ${sPdf.numPages} pages`);
    } else {
      console.log(`Test ${tNum} PDF files not found.`);
    }
  }
}

main().catch(console.error);
