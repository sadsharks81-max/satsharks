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
async function main() {
    const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
    const p = path_1.default.join(dir, "SAT Practice Test 10 Answer Key.pdf");
    if (!fs_1.default.existsSync(p)) {
        console.log("File not found:", p);
        return;
    }
    console.log("Loading PDF...");
    const data = new Uint8Array(fs_1.default.readFileSync(p));
    try {
        const loadingTask = pdfjsLegacy.getDocument({ data });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(2); // page 2
        const textContent = await page.getTextContent();
        const items = textContent.items.map((item) => ({
            str: item.str,
            x: item.transform[4],
            y: item.transform[5]
        }));
        // Sort items by y descending first
        items.sort((a, b) => b.y - a.y);
        // Group into lines with y-tolerance of 3
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
        // Sort each line by x ascending and construct line strings
        const sortedLinesText = lines.map(line => {
            line.sort((a, b) => a.x - b.x);
            return line.map(item => item.str).join("").trim();
        }).filter(l => l.length > 0);
        const pageText = sortedLinesText.join("\n");
        console.log("=== RECONSTRUCTED TEXT ===");
        console.log(pageText.substring(0, 2000));
    }
    catch (e) {
        console.error("Error:", e);
    }
}
main().catch(console.error);
