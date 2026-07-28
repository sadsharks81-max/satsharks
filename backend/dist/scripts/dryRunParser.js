"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../config/env");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdf_parse_1 = require("pdf-parse");
async function extractText(filePath) {
    const dataBuffer = fs_1.default.readFileSync(filePath);
    const parser = new pdf_parse_1.PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
}
async function main() {
    const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
    const qPath = path_1.default.join(dir, "SAT Practice Test 10.pdf");
    const sPath = path_1.default.join(dir, "SAT Practice Test 10 Answer Key.pdf");
    if (!fs_1.default.existsSync(qPath) || !fs_1.default.existsSync(sPath)) {
        console.error("Test 10 files not found.");
        return;
    }
    const qText = await extractText(qPath);
    const sText = await extractText(sPath);
    console.log("QText length:", qText.length);
    console.log("SText length:", sText.length);
    // Let's write the raw texts to temp files so we can inspect their layout
    fs_1.default.writeFileSync("s:\\github\\my-daily-compass\\qText_10.txt", qText, "utf-8");
    fs_1.default.writeFileSync("s:\\github\\my-daily-compass\\sText_10.txt", sText, "utf-8");
    console.log("Raw text saved to qText_10.txt and sText_10.txt");
}
main().catch(console.error);
