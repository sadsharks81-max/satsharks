"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const pdf_parse_1 = require("pdf-parse");
const path_1 = __importDefault(require("path"));
const pdfDir = path_1.default.resolve(__dirname, "../../../reference_data/satpapers");
const files = ["SAT2.pdf", "SAT3.pdf", "SAT4.pdf", "SAT5.pdf", "SAT8.pdf"];
function normalizeLine(line) {
    return line.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
}
async function run() {
    for (const file of files) {
        console.log(`\n=== ${file} ===`);
        const data = (0, node_fs_1.readFileSync)(path_1.default.join(pdfDir, file));
        const parser = new pdf_parse_1.PDFParse({ data });
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
            if (i < 40)
                console.log(`${i + 1}: ${line}`);
        });
    }
}
run().catch((e) => {
    console.error(e);
    process.exit(1);
});
