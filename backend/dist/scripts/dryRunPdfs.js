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
function parseQuestionsList(text) {
    const questions = [];
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let currentQ = null;
    let textLines = [];
    const flushQ = () => {
        if (currentQ) {
            currentQ.text = textLines.join(" ").trim();
            questions.push(currentQ);
        }
        currentQ = null;
        textLines = [];
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
        if (qMatch) {
            flushQ();
            currentQ = {
                num: parseInt(qMatch[2], 10),
                text: "",
                options: []
            };
            // If there is skill/difficulty metadata on the same line, or in rest of text, we can skip processing it as question text
            const rest = cleanLine.substring(qMatch[0].length).trim();
            if (rest.length > 0 && !rest.toLowerCase().startsWith("skill:") && !rest.toLowerCase().startsWith("—skill:")) {
                textLines.push(rest);
            }
            continue;
        }
        if (!currentQ)
            continue;
        // Check options
        const optMatch = cleanLine.match(/^([A-D])\)\s*(.*)/) || cleanLine.match(/^([A-D])\.\s*(.*)/);
        if (optMatch) {
            currentQ.options.push(cleanLine);
            continue;
        }
        // Append to text if not options/skills metadata
        if (!cleanLine.toLowerCase().startsWith("skill:") && !cleanLine.toLowerCase().startsWith("difficulty:")) {
            textLines.push(cleanLine);
        }
    }
    flushQ();
    return questions;
}
function parseSolutionsList(text) {
    const solutions = [];
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
    let currentSol = null;
    let explLines = [];
    const flushSol = () => {
        if (currentSol) {
            currentSol.explanation = explLines.join(" ").trim();
            solutions.push(currentSol);
        }
        currentSol = null;
        explLines = [];
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        // Skip quick reference grid lines by checking if there are multiple Qs on the line
        const qCount = (cleanLine.match(/\bQ\d+\b/gi) || []).length + (cleanLine.match(/\bQuestion\s+\d+/gi) || []).length;
        if (qCount > 1) {
            continue;
        }
        const isQuestionWord = cleanLine.match(/^Question\s*(\d+)(?!\d)/i);
        const isQShortWithSeparator = cleanLine.match(/^Q(\d+)\s*[:|—\-.]/i);
        if (isQuestionWord || isQShortWithSeparator) {
            flushSol();
            const qNumStr = isQuestionWord ? isQuestionWord[1] : isQShortWithSeparator[1];
            const matchedLength = isQuestionWord ? isQuestionWord[0].length : isQShortWithSeparator[0].length;
            currentSol = {
                num: parseInt(qNumStr, 10),
                answer: "",
                explanation: ""
            };
            const rest = cleanLine.substring(matchedLength).trim();
            // Try to find inline answer
            // e.g. "— Answer:D" or "— Correct Answer: D" or "| Correct Answer: D" or ":D" or ": D" or "D" (for Q1:D)
            const ansMatch = rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                rest.match(/(?:Correct\s+)?Answer:\s*\)\s*([A-D]|[0-9\.\/-]+)\b/i) ||
                rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i) ||
                rest.match(/^[:|\-\s]*([A-D])\b/i) ||
                rest.match(/^([A-D])\b/i); // Matches D in Q1:D
            if (ansMatch && currentSol) {
                currentSol.answer = ansMatch[1].toUpperCase();
            }
            const explRest = rest.replace(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/-]+)/i, "")
                .replace(/^[:|\-\s]*/, "")
                .replace(/^[A-D]\b/, "") // Remove inline letter answer if any
                .trim();
            if (explRest.length > 0 && explRest !== currentSol.answer) {
                explLines.push(explRest);
            }
            continue;
        }
        if (!currentSol)
            continue;
        if (cleanLine.toLowerCase().startsWith("correct answer:")) {
            const rawAns = cleanLine.replace(/^correct answer:\s*/i, "").trim();
            const ansMatch = rawAns.match(/^([A-D])\b/i) || rawAns.match(/^\)\s*([A-D])\b/i) || rawAns.match(/^([0-9\.\/-]+)\b/i);
            if (ansMatch) {
                currentSol.answer = ansMatch[1].toUpperCase();
            }
            else {
                currentSol.answer = rawAns;
            }
            continue;
        }
        explLines.push(cleanLine);
    }
    flushSol();
    return solutions;
}
async function main() {
    const dir = "s:\\github\\my-daily-compass\\digitalsatpapers2";
    const files = fs_1.default.readdirSync(dir).filter(f => f.endsWith(".pdf") && !f.includes("Answer Key")).sort();
    for (const f of files) {
        const testNum = f.match(/\d+/)[0];
        const qPath = path_1.default.join(dir, f);
        const sPath = path_1.default.join(dir, `SAT Practice Test ${testNum} Answer Key.pdf`);
        if (!fs_1.default.existsSync(sPath)) {
            console.log(`Test ${testNum}: Solution key missing`);
            continue;
        }
        try {
            const qText = await extractLayoutText(qPath);
            const sText = await extractLayoutText(sPath);
            const questions = parseQuestionsList(qText);
            const solutions = parseSolutionsList(sText);
            console.log(`Test ${testNum}: Questions Parsed = ${questions.length}, Solutions Parsed = ${solutions.length}`);
            if (questions.length !== 147 || solutions.length !== 147) {
                console.warn(`  WARNING: Count is not 147! Questions: ${questions.length}, Solutions: ${solutions.length}`);
            }
        }
        catch (e) {
            console.error(`Error on test ${testNum}:`, e.message);
        }
    }
}
main().catch(console.error);
