"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const pdf_parse_1 = require("pdf-parse");
const path_1 = __importDefault(require("path"));
async function main() {
    const pdfDir = path_1.default.resolve(__dirname, "../../../digitalsatpapers");
    // Parse DSAT1.pdf
    const dsatPath = path_1.default.join(pdfDir, "DSAT1.pdf");
    console.log(`Reading ${dsatPath}...`);
    const dsatBuf = (0, node_fs_1.readFileSync)(dsatPath);
    const dsatParser = new pdf_parse_1.PDFParse({ data: dsatBuf });
    const dsatResult = await dsatParser.getText();
    await dsatParser.destroy();
    const dsatTxtPath = path_1.default.join(pdfDir, "DSAT1_text.txt");
    (0, node_fs_1.writeFileSync)(dsatTxtPath, dsatResult.text);
    console.log(`DSAT1.pdf text written to ${dsatTxtPath}`);
    // Parse DSAT1sol.pdf
    const solPath = path_1.default.join(pdfDir, "DSAT1sol.pdf");
    console.log(`Reading ${solPath}...`);
    const solBuf = (0, node_fs_1.readFileSync)(solPath);
    const solParser = new pdf_parse_1.PDFParse({ data: solBuf });
    const solResult = await solParser.getText();
    await solParser.destroy();
    const solTxtPath = path_1.default.join(pdfDir, "DSAT1sol_text.txt");
    (0, node_fs_1.writeFileSync)(solTxtPath, solResult.text);
    console.log(`DSAT1sol.pdf text written to ${solTxtPath}`);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
