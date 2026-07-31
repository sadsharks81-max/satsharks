"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const pdf_parse_1 = require("pdf-parse");
const importAllSAT_1 = require("./importAllSAT");
const path_1 = __importDefault(require("path"));
async function main() {
    const pdfDir = path_1.default.resolve(__dirname, "../../../reference_data/satpapers");
    for (let i = 1; i <= 8; i++) {
        const file = `SAT${i}.pdf`;
        const pdfPath = path_1.default.join(pdfDir, file);
        if (!(0, node_fs_1.existsSync)(pdfPath)) {
            console.log(`${file} does not exist.`);
            continue;
        }
        const buf = (0, node_fs_1.readFileSync)(pdfPath);
        const parser = new pdf_parse_1.PDFParse({ data: buf });
        const result = await parser.getText();
        await parser.destroy();
        const modules = (0, importAllSAT_1.parseSATText)(result.text);
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
