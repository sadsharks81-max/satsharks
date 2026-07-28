"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function findHeaders(filePath) {
    if (!fs_1.default.existsSync(filePath)) {
        console.log("File not found:", filePath);
        return;
    }
    const lines = fs_1.default.readFileSync(filePath, "utf-8").split("\n");
    console.log(`=== HEADERS IN ${path_1.default.basename(filePath)} ===`);
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.toUpperCase().includes("SECTION") ||
            line.toUpperCase().includes("MODULE") ||
            line.toUpperCase().includes("HARD") ||
            line.toUpperCase().includes("EASY")) {
            if (line.length < 100 && !line.includes("Question") && !line.includes("Skill:") && !line.includes("Why other")) {
                console.log(`${i + 1}: ${line}`);
            }
        }
    }
}
async function main() {
    findHeaders("s:\\github\\my-daily-compass\\qText_10.txt");
    findHeaders("s:\\github\\my-daily-compass\\sText_10.txt");
}
main().catch(console.error);
