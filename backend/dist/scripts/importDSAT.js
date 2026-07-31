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
require("../config/env");
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const db_1 = require("../config/db");
const QuestionCategory_1 = __importDefault(require("../models/QuestionCategory"));
const Question_1 = __importDefault(require("../models/Question"));
const SATTest_1 = __importDefault(require("../models/SATTest"));
const DiagnosticTest_1 = __importDefault(require("../models/DiagnosticTest"));
const pdfjsLegacy = __importStar(require("pdfjs-dist/legacy/build/pdf.mjs"));
// ----------------------------------------------------
// EXPONENT FIXING UTILITY
// ----------------------------------------------------
function fixExponents(text) {
    if (!text)
        return text;
    // Convert variable + power (e.g. x2 -> x^2, x3 -> x^3, y2 -> y^2, (x-7)2 -> (x-7)^2)
    let fixed = text.replace(/([a-zA-Z])([2-9])\b/g, "$1^$2");
    // Parentheses followed by a power: (x-7)2 -> (x-7)^2
    fixed = fixed.replace(/\)\s*([2-9])\b/g, ")^$1");
    return fixed;
}
// ----------------------------------------------------
// QUESTION STATEMENT CLEANING UTILITY
// ----------------------------------------------------
function cleanUnnecessaryQuestionText(text) {
    if (!text)
        return text;
    let cleaned = text;
    // Remove inline Answer metadata like "Answer: 845"
    cleaned = cleaned.replace(/\.?\s*Answer:\s*[0-9\.\/+\-−A-D]+\b/gi, "");
    const patternsToRemove = [
        /\(?Student-produced response\)?/gi,
        /\(?Student-produced response,\s*grid-in\)?/gi,
        /Student-produced response/gi,
        /grid-in/gi,
        /Enter your answer in the response field\.?/gi,
        /Disregard the unit symbol when entering your answer\.?/gi,
        /MODULE \d+:? (EASIER|HARDER)? ADAPTIVE PATH/gi,
        /READING & WRITING:? (EASIER|HARDER)? MODULE/gi,
        /MATH:? (EASIER|HARDER)? MODULE/gi,
        /Questions \d+-\d+ \| \d+ Minutes/gi
    ];
    for (const pattern of patternsToRemove) {
        cleaned = cleaned.replace(pattern, "");
    }
    cleaned = cleaned.replace(/\(\s*\)/g, "");
    cleaned = cleaned.replace(/\s+/g, " ");
    return cleaned.trim();
}
// ----------------------------------------------------
// PDF LAYOUT RECONSTRUCTION & PARSING
// ----------------------------------------------------
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
function shouldSkipLine(line) {
    const clean = line.trim();
    if (!clean)
        return true;
    // 1. Page markers: -- page 1 -- or standard page markers
    if (/^--\s*page\s*\d+\s*--$/i.test(clean))
        return true;
    if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(clean))
        return true;
    // 2. Pure page numbers: e.g. "37", "36", "9"
    if (/^\d+$/i.test(clean))
        return true;
    // 3. Section/Module Headers and instruction banners
    const lower = clean.toLowerCase();
    if (lower.startsWith("module 1") || lower.startsWith("module 2") || lower.startsWith("mod 1") || lower.startsWith("mod 2"))
        return true;
    if (lower.startsWith("section 1") || lower.startsWith("section 2"))
        return true;
    if (lower.startsWith("reading & writing") && lower.includes("module"))
        return true;
    if (lower.startsWith("math") && lower.includes("module"))
        return true;
    if (lower.includes("adaptive path") && lower.includes("questions"))
        return true;
    if (lower.includes("minutes") && lower.includes("questions") && lower.includes("|"))
        return true;
    if (lower.startsWith("directions"))
        return true;
    if (lower.startsWith("for questions") && lower.includes("solve"))
        return true;
    if (lower.includes("student-produced response") || lower.includes("enter your answer") || lower.includes("disregard the unit symbol"))
        return true;
    return false;
}
function parseQuestionsList(text) {
    const questions = [];
    const lines = text.split("\n").map(l => l.trim());
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
        if (shouldSkipLine(line)) {
            continue;
        }
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        if (!cleanLine)
            continue;
        const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
        if (qMatch) {
            flushQ();
            currentQ = {
                num: parseInt(qMatch[2], 10),
                text: "",
                options: []
            };
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
    const lines = text.split("\n").map(l => l.trim());
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
        if (shouldSkipLine(line)) {
            continue;
        }
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        if (!cleanLine)
            continue;
        const qCount = (cleanLine.match(/\bQ\d+\b/gi) || []).length + (cleanLine.match(/\bQuestion\s+\d+/gi) || []).length;
        if (qCount > 1) {
            continue;
        }
        const isQuestionWord = cleanLine.match(/^Question\s*(\d+)(?!\d)/i);
        const isQShortWithSeparator = cleanLine.match(/^Q(\d+)(?:\s*[:|—\-.]|\s+([A-D])(?=[A-Z\s]|$))/i);
        if (isQuestionWord || isQShortWithSeparator) {
            flushSol();
            const qNumStr = isQuestionWord ? isQuestionWord[1] : isQShortWithSeparator[1];
            let matchedLength = 0;
            let preExtractAnswer = "";
            if (isQuestionWord) {
                matchedLength = isQuestionWord[0].length;
            }
            else {
                if (isQShortWithSeparator[2]) {
                    preExtractAnswer = isQShortWithSeparator[2].toUpperCase();
                    matchedLength = isQShortWithSeparator[0].length;
                }
                else {
                    matchedLength = isQShortWithSeparator[0].length;
                }
            }
            currentSol = {
                num: parseInt(qNumStr, 10),
                answer: preExtractAnswer,
                explanation: ""
            };
            const rest = cleanLine.substring(matchedLength).trim();
            if (!currentSol.answer) {
                const ansMatch = rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/+\-−]+)\b/i) ||
                    rest.match(/(?:Correct\s+)?Answer:\s*\)\s*([A-D]|[0-9\.\/+\-−]+)\b/i) ||
                    rest.match(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/+\-−]+)/i) ||
                    rest.match(/^[:|\-\s]*([A-D])\b/i) ||
                    rest.match(/^([A-D])\b/i) ||
                    rest.match(/^([A-D])(?=[A-Z])/i) ||
                    rest.match(/^[:|\-\s]*([-−]?[0-9\.\/]+)(?!\d)/i);
                if (ansMatch) {
                    currentSol.answer = ansMatch[1].toUpperCase();
                }
                else if (rest.length > 0 && rest.length < 20) {
                    currentSol.answer = rest;
                }
            }
            const explRest = rest.replace(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/+\-−]+)/i, "")
                .replace(/^[:|\-\s]*/, "")
                .replace(/^[A-D]\b/, "")
                .replace(/^[A-D](?=[A-Z])/, "")
                .replace(/^[-−]?[0-9\.\/]+(?!\d)/, "")
                .replace(/^[:|\-\s]*/, "")
                .trim();
            if (explRest.length > 0 && explRest !== currentSol.answer) {
                explLines.push(explRest);
            }
            continue;
        }
        if (!currentSol)
            continue;
        if (cleanLine.toLowerCase().startsWith("correct answer:") || cleanLine.toLowerCase().startsWith("answer:") || cleanLine.toLowerCase().startsWith("grid-in:")) {
            const rawAns = cleanLine.replace(/^(correct\s+)?answer:\s*/i, "").replace(/^grid-in:\s*/i, "").trim();
            const ansMatch = rawAns.match(/^([A-D])\b/i) || rawAns.match(/^\)\s*([A-D])\b/i) || rawAns.match(/^([0-9\.\/+\-−]+)\b/i);
            if (ansMatch) {
                currentSol.answer = ansMatch[1].toUpperCase();
            }
            else {
                currentSol.answer = rawAns;
            }
            const explRest = rawAns.replace(/^([A-D])\b/i, "")
                .replace(/^\)\s*([A-D])\b/i, "")
                .replace(/^([0-9\.\/+\-−]+)\b/i, "")
                .replace(/^[:|\-\s]*/, "")
                .trim();
            if (explRest.length > 0 && explRest !== currentSol.answer) {
                explLines.push(explRest);
            }
            continue;
        }
        explLines.push(cleanLine);
    }
    flushSol();
    return solutions;
}
function parseSkillsList(text) {
    const list = [];
    const lines = text.split("\n");
    for (const line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.toLowerCase().includes("skill:")) {
            const match = cleanLine.match(/Skill:\s*([^|\-\—]+)(?:[|\-\—]\s*Difficulty:\s*(Easy|Medium|Hard))?/i);
            if (match) {
                let skill = match[1].trim();
                let difficultyStr = match[2] ? match[2].toUpperCase() : "MEDIUM";
                if (skill.toLowerCase().includes("skill:")) {
                    skill = skill.replace(/.*skill:\s*/i, "").trim();
                }
                list.push({
                    skill,
                    difficulty: difficultyStr
                });
            }
            else {
                list.push({
                    skill: "Words in Context",
                    difficulty: "MEDIUM"
                });
            }
        }
    }
    return list;
}
async function parsePdfTest(pdfPath, solutionPdfPath) {
    const qText = await extractLayoutText(pdfPath);
    const sText = await extractLayoutText(solutionPdfPath);
    const parsedQs = parseQuestionsList(qText);
    const parsedSols = parseSolutionsList(sText);
    const parsedSkills = parseSkillsList(qText);
    if (parsedQs.length !== 147 || parsedSols.length !== 147 || parsedSkills.length !== 147) {
        throw new Error(`PDF parse length mismatch for ${path_1.default.basename(pdfPath)}. Qs: ${parsedQs.length}, Sols: ${parsedSols.length}, Skills: ${parsedSkills.length}`);
    }
    const modules = [
        { name: "Reading & Writing Module 1", section: "READING_WRITING", moduleType: "MOD1", questions: [] },
        { name: "Reading & Writing Module 2 - Easier", section: "READING_WRITING", moduleType: "MOD2_EASY", questions: [] },
        { name: "Reading & Writing Module 2 - Harder", section: "READING_WRITING", moduleType: "MOD2_HARD", questions: [] },
        { name: "Math Module 1", section: "MATH", moduleType: "MOD1", questions: [] },
        { name: "Math Module 2 - Easier", section: "MATH", moduleType: "MOD2_EASY", questions: [] },
        { name: "Math Module 2 - Harder", section: "MATH", moduleType: "MOD2_HARD", questions: [] },
    ];
    for (let i = 0; i < 147; i++) {
        const pq = parsedQs[i];
        const ps = parsedSols[i];
        const psk = parsedSkills[i];
        let modIdx = 0;
        let localQNum = 0;
        if (i < 27) {
            modIdx = 0;
            localQNum = i + 1;
        }
        else if (i < 54) {
            modIdx = 1;
            localQNum = i - 27 + 1;
        }
        else if (i < 81) {
            modIdx = 2;
            localQNum = i - 54 + 1;
        }
        else if (i < 103) {
            modIdx = 3;
            localQNum = i - 81 + 1;
        }
        else if (i < 125) {
            modIdx = 4;
            localQNum = i - 103 + 1;
        }
        else {
            modIdx = 5;
            localQNum = i - 125 + 1;
        }
        const targetMod = modules[modIdx];
        const options = [];
        for (const optStr of pq.options) {
            const match = optStr.match(/^([A-D])\)\s*(.*)/) || optStr.match(/^([A-D])\.\s*(.*)/);
            if (match) {
                options.push({
                    label: match[1].toUpperCase(),
                    text: cleanUnnecessaryQuestionText(fixExponents(match[2].trim()))
                });
            }
        }
        targetMod.questions.push({
            questionNumber: localQNum,
            skill: psk.skill,
            difficulty: psk.difficulty,
            text: cleanUnnecessaryQuestionText(fixExponents(pq.text)),
            options,
            correctAnswer: ps.answer,
            explanation: cleanUnnecessaryQuestionText(fixExponents(ps.explanation)),
            isFreeResponse: options.length === 0
        });
    }
    return modules;
}
// ----------------------------------------------------
// LEGACY TEXT PARSERS (For DSAT 1-8)
// ----------------------------------------------------
function cleanQuestionText(lines, isMath) {
    const newLinePattern = /^(the\s+following\s+(text|passage)|adapted\s+from|text\s+\d+|passage\s+\d+|which\s+(choice|option|finding|of|phrase|word|sentence|quote|passage|student|statement|result|diagram|graph|table|inequality|equation|value|formula|system|relationship|method|data|list|figure|representation)|based\s+on|how\s+(does|do|is|should)\b|what\s+(is|does|are|value|price|height)\b|in\s+the\s+(figure|xy\-plane)\b|according\s+to\s+the|to\s+the\s+nearest|solve\b|\(student\-produced\s+response)/i;
    const cleanLines = lines.map(l => l.trim()).filter(l => l.length > 0);
    if (cleanLines.length === 0)
        return "";
    let result = cleanLines[0];
    let inIntro = /^the\s+following\s+(text|passage)/i.test(cleanLines[0]) || /^adapted\s+from/i.test(cleanLines[0]);
    let prevEndsWithPunct = /[.\?\!]$/.test(cleanLines[0]);
    const isMathLine = (l) => {
        if (l.includes("="))
            return true;
        if (l.length < 50 && /^[a-z0-9\s\+\-\*\/\(\)\{\}\[\]\^\.\,\;\:\/\\]+$/i.test(l) && /[\+\-\*\/\^]/.test(l))
            return true;
        return false;
    };
    for (let i = 1; i < cleanLines.length; i++) {
        const currentLine = cleanLines[i];
        const prevLine = cleanLines[i - 1];
        const isCurrentMath = isMathLine(currentLine);
        const isPrevMath = isMathLine(prevLine);
        let shouldStartNewLine = false;
        if (newLinePattern.test(currentLine)) {
            shouldStartNewLine = true;
        }
        else if (isMath && (isCurrentMath || isPrevMath)) {
            shouldStartNewLine = true;
        }
        else if (inIntro && prevEndsWithPunct) {
            shouldStartNewLine = true;
            inIntro = false;
        }
        if (shouldStartNewLine) {
            result += "\n" + currentLine;
        }
        else {
            result += " " + currentLine;
        }
        if (/^the\s+following\s+(text|passage)/i.test(currentLine) || /^adapted\s+from/i.test(currentLine)) {
            inIntro = true;
        }
        prevEndsWithPunct = /[.\?\!]$/.test(currentLine);
        if (inIntro && prevEndsWithPunct) {
            inIntro = false;
        }
    }
    return result.trim();
}
function parseQuestionsFile(filePath) {
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").map(l => l.replace(/\r/g, "").trim());
    const modules = [];
    let currentSection = null;
    let currentModuleType = null;
    let currentModuleName = "";
    let currentModuleQuestions = [];
    let currentQuestion = null;
    let questionTextLines = [];
    let collectingOptions = false;
    let lastOption = null;
    const flushQuestion = () => {
        if (currentQuestion) {
            if (questionTextLines.length > 0) {
                currentQuestion.text = cleanQuestionText(questionTextLines, currentSection === "MATH");
            }
            if (currentQuestion.options.length === 0) {
                currentQuestion.isFreeResponse = true;
            }
            currentModuleQuestions.push(currentQuestion);
        }
        currentQuestion = null;
        questionTextLines = [];
        collectingOptions = false;
        lastOption = null;
    };
    const flushModule = () => {
        flushQuestion();
        if (currentSection && currentModuleType && currentModuleQuestions.length > 0) {
            if (currentModuleType === "MOD2") {
                modules.push({
                    name: currentModuleName + " - Easier",
                    section: currentSection,
                    moduleType: "MOD2_EASY",
                    questions: JSON.parse(JSON.stringify(currentModuleQuestions)),
                });
                modules.push({
                    name: currentModuleName + " - Harder",
                    section: currentSection,
                    moduleType: "MOD2_HARD",
                    questions: JSON.parse(JSON.stringify(currentModuleQuestions)),
                });
            }
            else {
                modules.push({
                    name: currentModuleName,
                    section: currentSection,
                    moduleType: currentModuleType,
                    questions: currentModuleQuestions,
                });
            }
        }
        currentModuleQuestions = [];
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line)
            continue;
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        if (!cleanLine)
            continue;
        if (cleanLine.toLowerCase().startsWith("answer:")) {
            continue;
        }
        const isSec1 = /^Section\s*1\b/i.test(cleanLine);
        const isSec2 = /^Section\s*2\b/i.test(cleanLine);
        if (isSec1 || isSec2) {
            flushModule();
            currentSection = isSec1 ? "READING_WRITING" : "MATH";
            if (/Module 1|Mod 1/i.test(cleanLine)) {
                currentModuleType = "MOD1";
                currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 1" : "Math Module 1";
            }
            else if (/Module 2|Mod 2/i.test(cleanLine)) {
                if (/Easier|Easy/i.test(cleanLine)) {
                    currentModuleType = "MOD2_EASY";
                    currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2 - Easier" : "Math Module 2 - Easier";
                }
                else if (/Harder|Hard/i.test(cleanLine)) {
                    currentModuleType = "MOD2_HARD";
                    currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2 - Harder" : "Math Module 2 - Harder";
                }
                else {
                    currentModuleType = "MOD2";
                    currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2" : "Math Module 2";
                }
            }
            continue;
        }
        if (currentSection) {
            const isMod1 = /^Module\s*1\b/i.test(cleanLine) && !/Module\s*2/i.test(cleanLine);
            const isMod2Easy = /^Module\s*2\b/i.test(cleanLine) && /Easier|Easy/i.test(cleanLine);
            const isMod2Hard = /^Module\s*2\b/i.test(cleanLine) && /Harder|Hard/i.test(cleanLine);
            const isMod2 = /^Module\s*2\b/i.test(cleanLine) && !/Easier|Easy|Harder|Hard/i.test(cleanLine);
            if (isMod1) {
                flushModule();
                currentModuleType = "MOD1";
                currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 1" : "Math Module 1";
                continue;
            }
            if (isMod2Easy) {
                flushModule();
                currentModuleType = "MOD2_EASY";
                currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2 - Easier" : "Math Module 2 - Easier";
                continue;
            }
            if (isMod2Hard) {
                flushModule();
                currentModuleType = "MOD2_HARD";
                currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2 - Harder" : "Math Module 2 - Harder";
                continue;
            }
            if (isMod2) {
                flushModule();
                currentModuleType = "MOD2";
                currentModuleName = currentSection === "READING_WRITING" ? "Reading & Writing Module 2" : "Math Module 2";
                continue;
            }
        }
        if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(cleanLine))
            continue;
        if (/^Total:\s*\d+\s*Questions/i.test(cleanLine))
            continue;
        if (/^Approximately\s*\d+%/i.test(cleanLine))
            continue;
        if (/^\(Student-produced response\s*,\s*grid-in\)/i.test(cleanLine))
            continue;
        if (cleanLine.startsWith("These questions are 100% original"))
            continue;
        if (cleanLine.startsWith("ADAPTIVE DIGITAL SAT"))
            continue;
        if (cleanLine.startsWith("DSAT_Dec_2024"))
            continue;
        const qMatch = cleanLine.match(/^Question\s+(\d+)\s*$/i);
        if (qMatch) {
            flushQuestion();
            let skillStr = "";
            let difficultyStr = "";
            for (let offset = 1; offset <= 3 && i + offset < lines.length; offset++) {
                const nextRawLine = lines[i + offset] ? lines[i + offset].trim() : "";
                const cleanNextLine = nextRawLine.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
                if (cleanNextLine.toLowerCase().startsWith("skill:")) {
                    const skillMatch = cleanNextLine.match(/^Skill:\s*(.*?)(?:\s*\|\s*Difficulty:\s*(EASY|MEDIUM|HARD))?$/i);
                    if (skillMatch) {
                        skillStr = skillMatch[1].trim();
                        if (skillMatch[2]) {
                            difficultyStr = skillMatch[2].toUpperCase();
                        }
                    }
                    i += offset;
                    break;
                }
            }
            currentQuestion = {
                questionNumber: parseInt(qMatch[1], 10),
                skill: skillStr,
                difficulty: (difficultyStr || "MEDIUM"),
                text: "",
                options: [],
                correctAnswer: "",
                explanation: "",
                isFreeResponse: false,
            };
            continue;
        }
        if (!currentQuestion)
            continue;
        const optMatch = cleanLine.match(/^([A-D])\)\s*(.*)/);
        if (optMatch) {
            if (questionTextLines.length > 0) {
                currentQuestion.text = cleanQuestionText(questionTextLines, currentSection === "MATH");
                questionTextLines = [];
            }
            collectingOptions = true;
            const opt = {
                label: optMatch[1],
                text: optMatch[2].trim(),
            };
            currentQuestion.options.push(opt);
            lastOption = opt;
            continue;
        }
        if (collectingOptions && lastOption) {
            lastOption.text = `${lastOption.text} ${cleanLine}`.trim();
            continue;
        }
        questionTextLines.push(line);
    }
    flushModule();
    return modules;
}
function parseSolutionsFile(filePath) {
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    const lines = content.split("\n").map(l => l.replace(/\r/g, "").trim());
    const solModules = [];
    let currentSection = null;
    let currentModuleType = null;
    let currentSolList = [];
    let currentSol = null;
    let explLines = [];
    let waitingForAnswer = false;
    const flushSol = () => {
        if (currentSol) {
            currentSol.explanation = explLines.join("\n").trim();
            currentSolList.push(currentSol);
        }
        currentSol = null;
        explLines = [];
    };
    const flushSolModule = () => {
        flushSol();
        waitingForAnswer = false;
        if (currentSection && currentModuleType && currentSolList.length > 0) {
            if (currentModuleType === "MOD2") {
                solModules.push({
                    section: currentSection,
                    moduleType: "MOD2_EASY",
                    solutions: JSON.parse(JSON.stringify(currentSolList)),
                });
                solModules.push({
                    section: currentSection,
                    moduleType: "MOD2_HARD",
                    solutions: JSON.parse(JSON.stringify(currentSolList)),
                });
            }
            else {
                solModules.push({
                    section: currentSection,
                    moduleType: currentModuleType,
                    solutions: currentSolList,
                });
            }
        }
        currentSolList = [];
    };
    const cleanAnswer = (rawAns, section, moduleType, qNum) => {
        let ans = rawAns.trim();
        ans = ans.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        ans = ans.replace(/^(Answer|Grid-in|Ans|Corrected\s*answer|Best\s*available\s*answer|Corrected):\s*/i, "").trim();
        const optMatch = ans.match(/^([A-D])(?:\s+|\)|\]|\b)/i) || ans.match(/^([A-D])$/i);
        if (optMatch) {
            return optMatch[1].toUpperCase();
        }
        if (ans.toLowerCase().includes(" or ")) {
            ans = ans.split(/\s+or\s+/i)[0].trim();
        }
        if (ans.toLowerCase().startsWith("see note")) {
            if (section === "MATH" && moduleType === "MOD1" && qNum === 18) {
                return "3111";
            }
            if (section === "MATH" && moduleType === "MOD2_EASY" && qNum === 19) {
                return "44";
            }
            return "See note";
        }
        return ans.replace(/[≈\s]/g, "");
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (!line)
            continue;
        const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
        if (!cleanLine)
            continue;
        if (/^Quick-Reference\s*Answer/i.test(cleanLine)) {
            flushSolModule();
            currentSection = null;
            currentModuleType = null;
            continue;
        }
        const isSec1 = /^Section\s*1\b/i.test(cleanLine);
        const isSec2 = /^Section\s*2\b/i.test(cleanLine);
        if (isSec1 || isSec2) {
            flushSolModule();
            currentSection = isSec1 ? "READING_WRITING" : "MATH";
            if (/Module\s*1|Mod\s*1/i.test(cleanLine)) {
                currentModuleType = "MOD1";
            }
            else if (/Module\s*2|Mod\s*2/i.test(cleanLine)) {
                if (/Easier|Easy/i.test(cleanLine))
                    currentModuleType = "MOD2_EASY";
                else if (/Harder|Hard/i.test(cleanLine))
                    currentModuleType = "MOD2_HARD";
                else
                    currentModuleType = "MOD2";
            }
            continue;
        }
        if (currentSection) {
            const isMod1 = /^Module\s*1\b/i.test(cleanLine) && !/Module\s*2/i.test(cleanLine);
            const isMod2Easy = /^Module\s*2\b/i.test(cleanLine) && /Easier|Easy/i.test(cleanLine);
            const isMod2Hard = /^Module\s*2\b/i.test(cleanLine) && /Harder|Hard/i.test(cleanLine);
            const isMod2 = /^Module\s*2\b/i.test(cleanLine) && !/Easier|Easy|Harder|Hard/i.test(cleanLine);
            if (isMod1 || isMod2Easy || isMod2Hard || isMod2) {
                flushSolModule();
                if (isMod1)
                    currentModuleType = "MOD1";
                else if (isMod2Easy)
                    currentModuleType = "MOD2_EASY";
                else if (isMod2Hard)
                    currentModuleType = "MOD2_HARD";
                else
                    currentModuleType = "MOD2";
                continue;
            }
        }
        let qMatch = cleanLine.match(/^Question\s+(\d+)\b(.*)/i) || cleanLine.match(/^Q(\d+)\b(.*)/i);
        if (qMatch) {
            flushSol();
            const questionNumber = parseInt(qMatch[1], 10);
            const rest = qMatch[2].replace(/^[:\s,\.-]+/, "").trim();
            const hasAnswerInline = /^[A-D](?:\s+|\)|\]|$)/i.test(rest) ||
                /^(Answer|Grid-in|Ans|Corrected\s*answer|Best\s*available\s*answer|Corrected):/i.test(rest) ||
                /^[A-D]$/i.test(rest) ||
                /^see\s+note/i.test(rest) ||
                /^[-−]?\d+/i.test(rest) ||
                (currentSection === "MATH" && rest.length > 0);
            let answer = "";
            if (hasAnswerInline) {
                answer = cleanAnswer(rest, currentSection || "", currentModuleType || "", questionNumber);
            }
            else {
                waitingForAnswer = true;
            }
            currentSol = {
                questionNumber,
                answer,
                explanation: "",
            };
            if (hasAnswerInline) {
                const cleanRest = rest.replace(/^(Answer|Grid-in|Ans|Corrected\s*answer|Best\s*available\s*answer|Corrected):\s*/i, "").trim();
                const optMatch = cleanRest.match(/^([A-D])(?:\s+|\)|\]|\b)/i) || cleanRest.match(/^([A-D])$/i);
                let firstExpl = cleanRest;
                if (optMatch) {
                    firstExpl = cleanRest.substring(optMatch[0].length).trim();
                }
                else if (/^[-−]?\d+/.test(cleanRest)) {
                    const mathAnsPrefix = cleanRest.match(/^[-−]?\d+(?:\/\d+)?(?:\.\d+)?/);
                    if (mathAnsPrefix) {
                        firstExpl = cleanRest.substring(mathAnsPrefix[0].length).trim();
                    }
                }
                if (firstExpl) {
                    explLines.push(firstExpl);
                }
            }
            continue;
        }
        if (waitingForAnswer && currentSol) {
            const isAnswerLine = /^(Answer|Grid-in|Ans|Corrected\s*answer|Best\s*available\s*answer|Corrected):/i.test(cleanLine) ||
                /^[A-D](?:\s+|\)|\]|$)/i.test(cleanLine) ||
                /^[-−]?\d+/.test(cleanLine) ||
                /^see\s+note/i.test(cleanLine) ||
                (currentSection === "MATH" && cleanLine.length > 0);
            if (isAnswerLine) {
                currentSol.answer = cleanAnswer(cleanLine, currentSection || "", currentModuleType || "", currentSol.questionNumber);
                waitingForAnswer = false;
                const cleanRest = cleanLine.replace(/^(Answer|Grid-in|Ans|Corrected\s*answer|Best\s*available\s*answer|Corrected):\s*/i, "").trim();
                const optMatch = cleanRest.match(/^([A-D])(?:\s+|\)|\]|\b)/i) || cleanRest.match(/^([A-D])$/i);
                let firstExpl = cleanRest;
                if (optMatch) {
                    firstExpl = cleanRest.substring(optMatch[0].length).trim();
                }
                else if (/^\d+/.test(cleanRest)) {
                    const mathAnsPrefix = cleanRest.match(/^\d+(?:\/\d+)?(?:\.\d+)?/);
                    if (mathAnsPrefix) {
                        firstExpl = cleanRest.substring(mathAnsPrefix[0].length).trim();
                    }
                }
                if (firstExpl) {
                    explLines.push(firstExpl);
                }
                continue;
            }
        }
        if (currentSol) {
            explLines.push(line);
        }
    }
    flushSolModule();
    return solModules;
}
// ----------------------------------------------------
// MAIN SEEDER PIPELINE
// ----------------------------------------------------
function classifyCategory(skill, section) {
    const s = skill.toLowerCase();
    if (section === "READING_WRITING") {
        if (s.includes("vocabulary") || s.includes("fill-in"))
            return "SAT Vocabulary";
        if (s.includes("grammar") || s.includes("convention") || s.includes("sentence") || s.includes("punctuation") || s.includes("transition"))
            return "SAT Grammar & Writing";
        return "SAT Reading Comprehension";
    }
    if (s.includes("geometry") || s.includes("triangle") || s.includes("circle") || s.includes("angle") || s.includes("area") || s.includes("volume") || s.includes("perimeter"))
        return "SAT Geometry";
    if (s.includes("data") || s.includes("statistic") || s.includes("probability") || s.includes("scatter") || s.includes("table") || s.includes("graph") || s.includes("percent"))
        return "SAT Data & Statistics";
    if (s.includes("quadratic") || s.includes("polynomial") || s.includes("exponential") || s.includes("function") || s.includes("nonlinear") || s.includes("radical") || s.includes("exponent"))
        return "SAT Advanced Math";
    return "SAT Algebra";
}
async function ensureCategories() {
    const categories = [
        { name: "SAT Reading Comprehension", section: "READING_WRITING", description: "Reading passages and comprehension" },
        { name: "SAT Grammar & Writing", section: "READING_WRITING", description: "Grammar, usage, and rhetoric" },
        { name: "SAT Vocabulary", section: "READING_WRITING", description: "Vocabulary in context" },
        { name: "SAT Algebra", section: "MATH", description: "Linear equations, inequalities, systems" },
        { name: "SAT Advanced Math", section: "MATH", description: "Quadratics, polynomials, exponentials" },
        { name: "SAT Geometry", section: "MATH", description: "Geometry and trigonometry" },
        { name: "SAT Data & Statistics", section: "MATH", description: "Data analysis, probability, statistics" },
    ];
    for (const cat of categories) {
        await QuestionCategory_1.default.updateOne({ name: cat.name }, { $set: cat }, { upsert: true });
    }
    const all = await QuestionCategory_1.default.find({ name: { $regex: /^SAT / } });
    return new Map(all.map((c) => [c.name, c._id]));
}
async function main() {
    const connected = await (0, db_1.connectDB)();
    if (!connected)
        throw new Error("Database connection failed");
    console.log("-----------------------------------------");
    console.log("1. CLEARING PREVIOUS SAT DATA");
    console.log("-----------------------------------------");
    const deletedQuestions = await Question_1.default.deleteMany({ source: "SAT" });
    console.log(`Deleted ${deletedQuestions.deletedCount} legacy SAT questions.`);
    const deletedTests = await SATTest_1.default.deleteMany({});
    console.log(`Deleted ${deletedTests.deletedCount} legacy SAT tests.`);
    const deletedDiagnostics = await DiagnosticTest_1.default.deleteMany({ title: /SAT Practice Test/i });
    console.log(`Deleted ${deletedDiagnostics.deletedCount} legacy SAT diagnostic tests.`);
    const digitalsatpapersDir = path_1.default.resolve(__dirname, "../../../reference_data/digitalsatpapers");
    const digitalsatpapers2Dir = path_1.default.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
    const categoryMap = await ensureCategories();
    const uploadsDir = path_1.default.resolve(__dirname, "../../uploads/sat");
    if (!fs_1.default.existsSync(uploadsDir))
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    const orderedModuleKeys = [
        { section: "READING_WRITING", moduleType: "MOD1", name: "Reading & Writing Module 1" },
        { section: "READING_WRITING", moduleType: "MOD2_EASY", name: "Reading & Writing Module 2 - Easier" },
        { section: "READING_WRITING", moduleType: "MOD2_HARD", name: "Reading & Writing Module 2 - Harder" },
        { section: "MATH", moduleType: "MOD1", name: "Math Module 1" },
        { section: "MATH", moduleType: "MOD2_EASY", name: "Math Module 2 - Easier" },
        { section: "MATH", moduleType: "MOD2_HARD", name: "Math Module 2 - Harder" }
    ];
    for (let tNum = 1; tNum <= 18; tNum++) {
        console.log(`\n=========================================`);
        console.log(`PROCESSING DSAT TEST #${tNum}`);
        console.log(`=========================================`);
        let parsedModules = [];
        let pdfUrl = "";
        if (tNum <= 8) {
            const fileNum = tNum === 8 ? 10 : tNum;
            let questionsPath = path_1.default.join(digitalsatpapersDir, `DSAT${fileNum}_text.txt`);
            if (!fs_1.default.existsSync(questionsPath)) {
                questionsPath = path_1.default.join(digitalsatpapersDir, `DSAT${fileNum}.md`);
            }
            let solutionsPath = path_1.default.join(digitalsatpapersDir, `DSAT${fileNum}sol_text.txt`);
            if (!fs_1.default.existsSync(solutionsPath)) {
                solutionsPath = path_1.default.join(digitalsatpapersDir, `DSAT${fileNum}sol.md`);
            }
            if (!fs_1.default.existsSync(questionsPath) || !fs_1.default.existsSync(solutionsPath)) {
                console.warn(`DSAT${fileNum} questions or solutions text file not found, skipping.`);
                continue;
            }
            let fileAContent = fs_1.default.readFileSync(questionsPath, "utf-8");
            const first120 = fileAContent.substring(0, 120).toUpperCase();
            if (first120.includes("ANSWER KEY") || first120.includes("SOLUTIONS")) {
                console.log(`[Self-Healing] Swapped file detected for DSAT${fileNum}. Correcting...`);
                const temp = questionsPath;
                questionsPath = solutionsPath;
                solutionsPath = temp;
            }
            const rawModules = parseQuestionsFile(questionsPath);
            const rawSolModules = parseSolutionsFile(solutionsPath);
            const solMap = new Map();
            for (const solMod of rawSolModules) {
                for (const sol of solMod.solutions) {
                    const key = `${solMod.section}-${solMod.moduleType}-${sol.questionNumber}`;
                    solMap.set(key, sol);
                }
            }
            for (const rawMod of rawModules) {
                const questions = [];
                for (const q of rawMod.questions) {
                    const solKey = `${rawMod.section}-${rawMod.moduleType}-${q.questionNumber}`;
                    const sol = solMap.get(solKey);
                    if (!sol || !sol.answer) {
                        throw new Error(`No answer/solution found for question ${q.questionNumber} in ${rawMod.name}`);
                    }
                    questions.push({
                        questionNumber: q.questionNumber,
                        skill: q.skill,
                        difficulty: q.difficulty,
                        text: cleanUnnecessaryQuestionText(fixExponents(q.text)),
                        options: q.options.map(o => ({
                            label: o.label,
                            text: cleanUnnecessaryQuestionText(fixExponents(o.text))
                        })),
                        correctAnswer: sol.answer,
                        explanation: cleanUnnecessaryQuestionText(fixExponents(sol.explanation)),
                        isFreeResponse: q.isFreeResponse
                    });
                }
                parsedModules.push({
                    name: rawMod.name,
                    section: rawMod.section,
                    moduleType: rawMod.moduleType,
                    questions
                });
            }
            const pdfSource = path_1.default.resolve(digitalsatpapersDir, `DSAT${fileNum}.pdf`);
            if (fs_1.default.existsSync(pdfSource)) {
                const pdfDest = path_1.default.join(uploadsDir, `DSAT${tNum}.pdf`);
                fs_1.default.copyFileSync(pdfSource, pdfDest);
                pdfUrl = `/uploads/sat/DSAT${tNum}.pdf`;
                console.log(`PDF copied to uploads: ${pdfDest}`);
            }
        }
        else {
            const qPdfPath = path_1.default.join(digitalsatpapers2Dir, `SAT Practice Test ${tNum}.pdf`);
            const sPdfPath = path_1.default.join(digitalsatpapers2Dir, `SAT Practice Test ${tNum} Answer Key.pdf`);
            if (!fs_1.default.existsSync(qPdfPath) || !fs_1.default.existsSync(sPdfPath)) {
                console.warn(`PDF or Solution Key for Test ${tNum} not found, skipping.`);
                continue;
            }
            console.log(`Parsing PDF: ${path_1.default.basename(qPdfPath)}`);
            parsedModules = await parsePdfTest(qPdfPath, sPdfPath);
            const pdfDest = path_1.default.join(uploadsDir, `SAT Practice Test ${tNum}.pdf`);
            fs_1.default.copyFileSync(qPdfPath, pdfDest);
            pdfUrl = `/uploads/sat/SAT Practice Test ${tNum}.pdf`;
            console.log(`PDF copied to uploads: ${pdfDest}`);
        }
        const satModules = [];
        for (let idx = 0; idx < orderedModuleKeys.length; idx++) {
            const keyConfig = orderedModuleKeys[idx];
            const parsedMod = parsedModules.find(m => m.section === keyConfig.section && m.moduleType === keyConfig.moduleType);
            if (!parsedMod) {
                throw new Error(`Could not find parsed module for ${keyConfig.name}`);
            }
            const questionIds = [];
            console.log(`Saving ${keyConfig.name} (${parsedMod.questions.length} questions)...`);
            for (const q of parsedMod.questions) {
                const catName = classifyCategory(q.skill, keyConfig.section);
                const categoryId = categoryMap.get(catName);
                if (!categoryId) {
                    throw new Error(`Category not found: ${catName}`);
                }
                const uniqueTag = `dsat-${tNum}-m${idx}-q${q.questionNumber}`;
                const doc = await Question_1.default.create({
                    text: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation,
                    category: categoryId,
                    difficulty: q.difficulty,
                    section: keyConfig.section,
                    tags: [uniqueTag, `dsat-${tNum}`, `dsat-${tNum}-m${idx}`, q.skill],
                    source: "SAT",
                    status: "PUBLISHED"
                });
                questionIds.push(doc._id);
            }
            satModules.push({
                name: keyConfig.name,
                section: keyConfig.section,
                moduleNumber: idx + 1,
                questions: questionIds,
                timeLimitMinutes: keyConfig.section === "READING_WRITING" ? 32 : 35
            });
        }
        const test = await SATTest_1.default.create({
            title: `Digital SAT Practice Test ${tNum}`,
            description: `Adaptive Digital SAT practice test #${tNum}. Includes full module routing based on your performance.`,
            year: 2025,
            testNumber: tNum,
            isAdaptive: true,
            modules: satModules,
            breakDurationMinutes: 10,
            isActive: true,
            accessLevel: "FREE",
            pdfUrl
        });
        console.log(`Created SAT Test: ${test.title} (ID: ${test._id})`);
    }
    console.log("Import completed successfully!");
    await mongoose_1.default.disconnect();
}
main().catch((e) => {
    console.error("Import failed:", e);
    process.exitCode = 1;
});
