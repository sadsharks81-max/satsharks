"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfjsLegacy = __importStar(require("pdfjs-dist/legacy/build/pdf.mjs"));
async function extractLayoutText(pdfPath) {
    const data = new Uint8Array(fs_1.default.readFileSync(pdfPath));
    const loadingTask = pdfjsLegacy.getDocument({ data });
    const pdf = await loadingTask.promise;
    let fullText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const items = textContent.items.map((item) => ({
            str: item.str,
            x: item.transform[4],
            y: item.transform[5]
        }));
        items.sort((a, b) => b.y - a.y);
        const lines = [];
        for (const item of items) {
            let placed = false;
            for (const line of lines) {
                if (Math.abs(line[0].y - item.y) <= 3) {
                    line.push(item);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                lines.push([item]);
            }
        }
        const pageText = lines.map(line => {
            line.sort((a, b) => a.x - b.x);
            return line.map(item => item.str).join("").trim();
        }).filter(l => l.length > 0).join("\n");
        fullText += pageText + `\n-- page ${pageNum} --\n`;
    }
    return fullText;
}
async function main() {
    const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
    const p13 = path_1.default.join(dir, "SAT Practice Test 13 Answer Key.pdf");
    const p14 = path_1.default.join(dir, "SAT Practice Test 14 Answer Key.pdf");
    if (fs_1.default.existsSync(p13)) {
        const text = await extractLayoutText(p13);
        const lines = text.split("\n");
        console.log("=== TEST 13 ANSWER KEY ===");
        for (let i = 0; i < 40; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
    if (fs_1.default.existsSync(p14)) {
        const text = await extractLayoutText(p14);
        const lines = text.split("\n");
        console.log("=== TEST 14 ANSWER KEY ===");
        for (let i = 0; i < 40; i++) {
            console.log(`${i + 1}: ${lines[i]}`);
        }
    }
}
main().catch(console.error);
