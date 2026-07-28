import "../config/env";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import QuestionCategory from "../models/QuestionCategory";
import Question from "../models/Question";
import SATTest from "../models/SATTest";
import DiagnosticTest from "../models/DiagnosticTest";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface ParsedQuestion {
  questionNumber: number;
  skill: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  isFreeResponse: boolean;
}

interface ParsedModule {
  name: string;
  section: "READING_WRITING" | "MATH";
  moduleType: "MOD1" | "MOD2_EASY" | "MOD2_HARD";
  questions: ParsedQuestion[];
}

interface TextItem {
  str: string;
  x: number;
  y: number;
}

// ----------------------------------------------------
// EXPONENT FIXING UTILITY
// ----------------------------------------------------
function fixExponents(text: string): string {
  if (!text) return text;
  let fixed = text.replace(/([a-zA-Z])([2-9])\b/g, "$1^$2");
  fixed = fixed.replace(/\)\s*([2-9])\b/g, ")^$1");
  return fixed;
}

// ----------------------------------------------------
// QUESTION STATEMENT CLEANING UTILITY
// ----------------------------------------------------
function cleanUnnecessaryQuestionText(text: string): string {
  if (!text) return text;
  let cleaned = text;
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
// PDF LAYOUT RECONSTRUCTION
// ----------------------------------------------------
async function extractPagesText(pdfPath: string): Promise<{ text: string; pageNum: number }[]> {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLegacy.getDocument({ data });
  const pdf = await loadingTask.promise;
  const pages: { text: string; pageNum: number }[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    const items: TextItem[] = textContent.items.map((item: any) => ({
      str: item.str,
      x: item.transform[4],
      y: item.transform[5]
    }));
    
    items.sort((a, b) => b.y - a.y);
    
    const lines: TextItem[][] = [];
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
    
    pages.push({ text: pageText, pageNum });
  }
  return pages;
}

function shouldSkipLine(line: string): boolean {
  const clean = line.trim();
  if (!clean) return true;
  
  if (/^--\s*page\s*\d+\s*--$/i.test(clean)) return true;
  if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(clean)) return true;
  
  // Skip any line that contains ONLY numbers, spaces, and dashes/slashes (page numbers, running numbers)
  if (/^[\d\s−\-–/]+$/i.test(clean)) return true;
  
  // Skip running section/module headers
  const lower = clean.toLowerCase();
  if (/^section\s+\d/i.test(clean)) return true;
  if (lower.includes("module") && (lower.includes("math") || lower.includes("reading") || lower.includes("writing") || lower.includes("adaptive"))) return true;
  if (lower.includes("questions") && (lower.includes("minutes") || lower.includes("limit"))) return true;
  if (lower.includes("minutes") && lower.includes("|")) return true;
  if (lower.includes("time:") || lower.includes("time limit") || /^time\s+limit/i.test(clean)) return true;
  if (/^\(?q\d+[-–—−]\d+\)?$/i.test(clean)) return true;
  
  // Instructions
  if (lower.startsWith("directions")) return true;
  if (lower.startsWith("for questions") && lower.includes("solve")) return true;
  if (lower.includes("student-produced response") || lower.includes("enter your answer") || lower.includes("disregard the unit symbol")) return true;
  
  // Separator lines
  if (/^[=\-−–—\s]+$/.test(clean)) return true;
  
  return false;
}

// ----------------------------------------------------
// QUESTION MAPPING RULES
// ----------------------------------------------------
interface MappedInfo {
  section: "READING_WRITING" | "MATH";
  moduleType: "MOD1" | "MOD2_EASY" | "MOD2_HARD";
}

function getMappingForPageAndQ(pageNum: number, qNum: number): MappedInfo | null {
  // Page 2 to 10: R&W MOD1 (Q1 to Q27)
  if (pageNum >= 2 && pageNum <= 10) {
    if (qNum > 27) return null;
    return { section: "READING_WRITING", moduleType: "MOD1" };
  }
  // Page 11 to 18: R&W MOD2_EASY (Q1 to Q27)
  if (pageNum >= 11 && pageNum <= 18) {
    if (qNum > 27) return null;
    return { section: "READING_WRITING", moduleType: "MOD2_EASY" };
  }
  // Page 19 to 28: R&W MOD2_HARD (Q1 to Q27)
  if (pageNum >= 19 && pageNum <= 28) {
    if (qNum > 27) return null;
    return { section: "READING_WRITING", moduleType: "MOD2_HARD" };
  }
  // Page 29 to 32: Math MOD1 (Q1 to Q22)
  if (pageNum >= 29 && pageNum <= 32) {
    if (qNum > 22) return null;
    return { section: "MATH", moduleType: "MOD1" };
  }
  // Page 33: R&W MOD2_EASY Q27, or Math MOD1 Q20, or Math MOD2_EASY Q21-22
  if (pageNum === 33) {
    if (qNum === 27) {
      return { section: "READING_WRITING", moduleType: "MOD2_EASY" };
    }
    if (qNum === 20) {
      return { section: "MATH", moduleType: "MOD1" };
    }
    if (qNum === 21 || qNum === 22) {
      return { section: "MATH", moduleType: "MOD2_EASY" };
    }
    return null;
  }
  // Page 34 to 37: Math MOD2_EASY (Q1 to Q22)
  if (pageNum >= 34 && pageNum <= 37) {
    if (qNum > 22) return null;
    return { section: "MATH", moduleType: "MOD2_EASY" };
  }
  // Page 38: Math MOD1 Q21-22
  if (pageNum === 38) {
    if (qNum === 21 || qNum === 22) {
      return { section: "MATH", moduleType: "MOD1" };
    }
    return null;
  }
  // Page 39 to 43: Math MOD2_HARD (Q1 to Q22)
  if (pageNum >= 39 && pageNum <= 43) {
    if (qNum > 22) return null;
    return { section: "MATH", moduleType: "MOD2_HARD" };
  }
  return null;
}

function parseQuestionsFromPages(pages: { text: string; pageNum: number }[]) {
  const questions: any[] = [];
  let currentQ: any = null;
  let textLines: string[] = [];
  
  const flushQ = () => {
    if (currentQ) {
      currentQ.text = textLines.join(" ").trim();
      questions.push(currentQ);
    }
    currentQ = null;
    textLines = [];
  };
  
  for (const page of pages) {
    const lines = page.text.split("\n").map(l => l.trim());
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Auto-flush when section or module changes
      const isHeader = lowerLine.includes("section 1") || lowerLine.includes("section 2") || 
                       lowerLine.includes("module 1") || lowerLine.includes("module 2") ||
                       (lowerLine.includes("reading & writing") && lowerLine.includes("module")) ||
                       (lowerLine.includes("math") && lowerLine.includes("module"));
      if (isHeader) {
        flushQ();
      }
      
      if (shouldSkipLine(line)) continue;
      const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
      if (!cleanLine) continue;
      
      const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
      if (qMatch) {
        flushQ();
        currentQ = {
          pageNum: page.pageNum,
          num: parseInt(qMatch[2], 10),
          skill: "Words in Context", // default
          difficulty: "MEDIUM",
          options: []
        };
        const rest = cleanLine.substring(qMatch[0].length).trim();
        if (rest.length > 0 && !rest.toLowerCase().startsWith("skill:") && !rest.toLowerCase().startsWith("—skill:")) {
          textLines.push(rest);
        }
        continue;
      }
      
      if (!currentQ) continue;
      
      if (cleanLine.toLowerCase().includes("skill:")) {
        const match = cleanLine.match(/Skill:\s*([^|\-\—]+)(?:[|\-\—]\s*Difficulty:\s*(Easy|Medium|Hard))?/i);
        if (match) {
          currentQ.skill = match[1].trim();
          if (match[2]) {
            currentQ.difficulty = match[2].toUpperCase();
          }
        }
        continue;
      }
      
      const optMatch = cleanLine.match(/^([A-D])\)\s*(.*)/) || cleanLine.match(/^([A-D])\.\s*(.*)/);
      if (optMatch) {
        currentQ.options.push(cleanLine);
        continue;
      }
      
      // If we are already parsing options, this line is a continuation of the last option!
      if (currentQ.options.length > 0) {
        const lastIdx = currentQ.options.length - 1;
        currentQ.options[lastIdx] += " " + cleanLine;
      } else {
        textLines.push(cleanLine);
      }
    }
  }
  flushQ();
  return questions;
}

// ----------------------------------------------------
// SOLUTIONS MAPPING RULES
// ----------------------------------------------------
function getMappingForSolPage(pageNum: number, qNum: number, section: "READING_WRITING" | "MATH"): MappedInfo | null {
  if (section === "READING_WRITING") {
    if (pageNum > 15) return null;
    
    if (pageNum <= 9) {
      if (qNum > 27) return null;
      return { section, moduleType: "MOD1" };
    }
    if (pageNum >= 10 && pageNum <= 12) {
      if (qNum > 27) return null;
      return { section, moduleType: "MOD2_EASY" };
    }
    if (pageNum >= 13 && pageNum <= 15) {
      if (qNum > 27) return null;
      return { section, moduleType: "MOD2_HARD" };
    }
  } else {
    if (pageNum < 16) return null;
    
    if (pageNum <= 19) {
      if (qNum > 22) return null;
      return { section, moduleType: "MOD1" };
    }
    if (pageNum >= 20 && pageNum <= 21) {
      if (qNum > 22) return null;
      return { section, moduleType: "MOD2_EASY" };
    }
    if (pageNum >= 22 && pageNum <= 24) {
      if (qNum > 22) return null;
      return { section, moduleType: "MOD2_HARD" };
    }
  }
  return null;
}

function parseSolutionsFromPages(pages: { text: string; pageNum: number }[]) {
  const solutions: any[] = [];
  let currentSection: "READING_WRITING" | "MATH" = "READING_WRITING";
  let currentSol: any = null;
  let explLines: string[] = [];
  
  const flushSol = () => {
    if (currentSol) {
      currentSol.explanation = explLines.join(" ").trim();
      solutions.push(currentSol);
    }
    currentSol = null;
    explLines = [];
  };
  
  for (const page of pages) {
    const lines = page.text.split("\n").map(l => l.trim());
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lowerLine = line.toLowerCase();
      
      // Auto-flush and update section state on headers
      const isHeader = lowerLine.includes("reading & writing") || lowerLine.includes("reading and writing") ||
                       lowerLine.includes("section 2: math") || (lowerLine.includes("math") && lowerLine.includes("module"));
      if (isHeader) {
        flushSol();
        if (lowerLine.includes("reading & writing") || lowerLine.includes("reading and writing")) {
          currentSection = "READING_WRITING";
        } else {
          currentSection = "MATH";
        }
      }
      
      if (shouldSkipLine(line)) continue;
      const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
      if (!cleanLine) continue;
      
      const qCount = (cleanLine.match(/\bQ\d+\b/gi) || []).length + (cleanLine.match(/\bQuestion\s+\d+/gi) || []).length;
      if (qCount > 1) {
        continue;
      }
      
      const isQuestionWord = cleanLine.match(/^Question\s*(\d+)(?!\d)/i);
      const isQShortWithSeparator = cleanLine.match(/^Q(\d+)(?:\s*[:|—\-.]|\s+([A-D])(?=[A-Z\s]|$))/i);
      
      if (isQuestionWord || isQShortWithSeparator) {
        flushSol();
        const qNumStr = isQuestionWord ? isQuestionWord[1] : isQShortWithSeparator![1];
        
        let matchedLength = 0;
        let preExtractAnswer = "";
        let parsedSkill = "";
        if (isQuestionWord) {
          matchedLength = isQuestionWord[0].length;
        } else {
          if (isQShortWithSeparator![2]) {
            preExtractAnswer = isQShortWithSeparator![2].toUpperCase();
            matchedLength = isQShortWithSeparator![0].length;
          } else {
            matchedLength = isQShortWithSeparator![0].length;
          }
        }
        
        const rest = cleanLine.substring(matchedLength).trim();
        const skillMatch = rest.match(/Skill:\s*([^|\-\—]+)/i);
        if (skillMatch) {
          parsedSkill = skillMatch[1].trim();
        }
        
        currentSol = {
          section: currentSection,
          pageNum: page.pageNum,
          num: parseInt(qNumStr, 10),
          skill: parsedSkill,
          answer: preExtractAnswer,
          explanation: ""
        };
        
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
          } else if (rest.length > 0 && rest.length < 20) {
            currentSol.answer = rest;
          }
        }
        
        const explRest = rest.replace(/(?:Correct\s+)?Answer:\s*([A-D]|[0-9\.\/+\-−]+)/i, "")
                            .replace(/^[:|\-\s]*([A-D])\b/i, "")
                            .replace(/^([A-D])\b/i, "")
                            .replace(/^([A-D])(?=[A-Z])/, "")
                            .replace(/^[-−]?[0-9\.\/]+(?!\d)/, "")
                            .replace(/^[:|\-\s]*/, "")
                            .trim();
        if (explRest.length > 0 && explRest !== currentSol.answer) {
          explLines.push(explRest);
        }
        continue;
      }
      
      if (!currentSol) continue;
      
      if (cleanLine.toLowerCase().startsWith("correct answer:") || cleanLine.toLowerCase().startsWith("answer:") || cleanLine.toLowerCase().startsWith("grid-in:")) {
        const rawAns = cleanLine.replace(/^(correct\s+)?answer:\s*/i, "").replace(/^grid-in:\s*/i, "").trim();
        const ansMatch = rawAns.match(/^([A-D])\b/i) || rawAns.match(/^\)\s*([A-D])\b/i) || rawAns.match(/^([0-9\.\/+\-−]+)\b/i);
        if (ansMatch) {
          currentSol.answer = ansMatch[1].toUpperCase();
        } else {
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
  }
  flushSol();
  return solutions;
}

async function parsePdfTest(pdfPath: string, solutionPdfPath: string): Promise<ParsedModule[]> {
  console.log("Extracting question pages...");
  const qPages = await extractPagesText(pdfPath);
  console.log("Parsing questions...");
  const rawQs = parseQuestionsFromPages(qPages);
  
  console.log("Extracting solution pages...");
  const sPages = await extractPagesText(solutionPdfPath);
  console.log("Parsing solutions...");
  const rawSols = parseSolutionsFromPages(sPages);
  
  // Map questions
  const mappedQs: any[] = [];
  const seenQKeys = new Set<string>();
  for (const q of rawQs) {
    const mapping = getMappingForPageAndQ(q.pageNum, q.num);
    if (!mapping) continue;
    
    const key = `${mapping.section}-${mapping.moduleType}-${q.num}`;
    if (seenQKeys.has(key)) {
      const existingIdx = mappedQs.findIndex(x => `${x.section}-${x.moduleType}-${x.num}` === key);
      if (existingIdx !== -1) {
        const existing = mappedQs[existingIdx];
        if (q.text.length > existing.text.length) {
          mappedQs[existingIdx] = { ...q, ...mapping };
        }
      }
      continue;
    }
    seenQKeys.add(key);
    mappedQs.push({ ...q, ...mapping });
  }
  
  // Map solutions
  const mappedSols: any[] = [];
  const seenSolKeys = new Set<string>();
  for (const s of rawSols) {
    const mapping = getMappingForSolPage(s.pageNum, s.num, s.section);
    if (!mapping) continue;
    
    const key = `${mapping.section}-${mapping.moduleType}-${s.num}`;
    if (seenSolKeys.has(key)) {
      const existingIdx = mappedSols.findIndex(x => `${x.section}-${x.moduleType}-${x.num}` === key);
      if (existingIdx !== -1) {
        const existing = mappedSols[existingIdx];
        if (s.explanation.length > existing.explanation.length) {
          mappedSols[existingIdx] = { ...s, ...mapping };
        }
      }
      continue;
    }
    seenSolKeys.add(key);
    mappedSols.push({ ...s, ...mapping });
  }
  
  // Construct modules
  const modules: ParsedModule[] = [
    { name: "Reading & Writing Module 1", section: "READING_WRITING", moduleType: "MOD1", questions: [] },
    { name: "Reading & Writing Module 2 - Easier", section: "READING_WRITING", moduleType: "MOD2_EASY", questions: [] },
    { name: "Reading & Writing Module 2 - Harder", section: "READING_WRITING", moduleType: "MOD2_HARD", questions: [] },
    { name: "Math Module 1", section: "MATH", moduleType: "MOD1", questions: [] },
    { name: "Math Module 2 - Easier", section: "MATH", moduleType: "MOD2_EASY", questions: [] },
    { name: "Math Module 2 - Harder", section: "MATH", moduleType: "MOD2_HARD", questions: [] },
  ];
  
  for (const mod of modules) {
    const modQs = mappedQs.filter(q => q.section === mod.section && q.moduleType === mod.moduleType);
    const modSols = mappedSols.filter(s => s.section === mod.section && s.moduleType === mod.moduleType);
    
    const totalQs = mod.section === "READING_WRITING" ? 27 : 22;
    for (let qNum = 1; qNum <= totalQs; qNum++) {
      const q = modQs.find(x => x.num === qNum);
      const s = modSols.find(x => x.num === qNum);
      
      if (!q || !s) {
        throw new Error(`Missing question or solution for ${mod.name} Q${qNum}`);
      }
      
      const options: { label: string; text: string }[] = [];
      for (const optStr of q.options) {
        const match = optStr.match(/^([A-D])\)\s*(.*)/) || optStr.match(/^([A-D])\.\s*(.*)/);
        if (match) {
          options.push({
            label: match[1].toUpperCase(),
            text: cleanUnnecessaryQuestionText(fixExponents(match[2].trim()))
          });
        }
      }
      
      mod.questions.push({
        questionNumber: qNum,
        skill: q.skill,
        difficulty: q.difficulty,
        text: cleanUnnecessaryQuestionText(fixExponents(q.text)),
        options,
        correctAnswer: s.answer,
        explanation: cleanUnnecessaryQuestionText(fixExponents(s.explanation)),
        isFreeResponse: options.length === 0
      });
    }
  }
  
  return modules;
}

function classifyCategory(skill: string, section: "READING_WRITING" | "MATH"): string {
  const s = skill.toLowerCase();
  if (section === "READING_WRITING") {
    if (s.includes("vocabulary") || s.includes("fill-in")) return "SAT Vocabulary";
    if (s.includes("grammar") || s.includes("convention") || s.includes("sentence") || s.includes("punctuation") || s.includes("transition")) return "SAT Grammar & Writing";
    return "SAT Reading Comprehension";
  }
  if (s.includes("geometry") || s.includes("triangle") || s.includes("circle") || s.includes("angle") || s.includes("area") || s.includes("volume") || s.includes("perimeter")) return "SAT Geometry";
  if (s.includes("data") || s.includes("statistic") || s.includes("probability") || s.includes("scatter") || s.includes("table") || s.includes("graph") || s.includes("percent")) return "SAT Data & Statistics";
  if (s.includes("quadratic") || s.includes("polynomial") || s.includes("exponential") || s.includes("function") || s.includes("nonlinear") || s.includes("radical") || s.includes("exponent")) return "SAT Advanced Math";
  return "SAT Algebra";
}

async function ensureCategories(): Promise<Map<string, mongoose.Types.ObjectId>> {
  const categories = [
    { name: "SAT Reading Comprehension", section: "READING_WRITING" as const, description: "Reading passages and comprehension" },
    { name: "SAT Grammar & Writing", section: "READING_WRITING" as const, description: "Grammar, usage, and rhetoric" },
    { name: "SAT Vocabulary", section: "READING_WRITING" as const, description: "Vocabulary in context" },
    { name: "SAT Algebra", section: "MATH" as const, description: "Linear equations, inequalities, systems" },
    { name: "SAT Advanced Math", section: "MATH" as const, description: "Quadratics, polynomials, exponentials" },
    { name: "SAT Geometry", section: "MATH" as const, description: "Geometry and trigonometry" },
    { name: "SAT Data & Statistics", section: "MATH" as const, description: "Data analysis, probability, statistics" },
  ];

  for (const cat of categories) {
    await QuestionCategory.updateOne(
      { name: cat.name },
      { $set: cat },
      { upsert: true }
    );
  }

  const all = await QuestionCategory.find({ name: { $regex: /^SAT / } });
  return new Map(all.map((c) => [c.name, c._id as mongoose.Types.ObjectId]));
}

async function main() {
  const connected = await connectDB();
  if (!connected) throw new Error("Database connection failed");

  const tNum = 9;
  console.log(`=========================================`);
  console.log(`SAFE IMPORTING ONLY DSAT TEST #${tNum}`);
  console.log(`=========================================`);

  const digitalsatpapers2Dir = path.resolve(__dirname, "../../../digitalsatpapers2");
  
  const qPdfPath = path.join(digitalsatpapers2Dir, "SAT Practice Test 9 - Standardized.pdf");
  const sPdfPath = path.join(digitalsatpapers2Dir, "SAT Practice Test 9 - Standardized Answer Key.pdf");

  if (!fs.existsSync(qPdfPath) || !fs.existsSync(sPdfPath)) {
    throw new Error("PDF or Solution Key for Test 9 not found.");
  }

  // --- CLEAN PREVIOUS TEST 9 DATA ONLY ---
  const delQs = await Question.deleteMany({ tags: `dsat-${tNum}` });
  console.log(`Deleted ${delQs.deletedCount} existing questions for Test 9.`);

  const delTests = await SATTest.deleteMany({ testNumber: tNum });
  console.log(`Deleted ${delTests.deletedCount} existing test documents for Test 9.`);

  const delDiag = await DiagnosticTest.deleteMany({ title: new RegExp(`^SAT Practice Test ${tNum}\\s*$`, 'i') });
  console.log(`Deleted ${delDiag.deletedCount} existing diagnostic test documents for Test 9.`);

  // Ensure categories are set up
  const categoryMap = await ensureCategories();

  // Copy PDF to uploads
  const uploadsDir = path.resolve(__dirname, "../../uploads/sat");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const pdfDest = path.join(uploadsDir, `SAT Practice Test ${tNum}.pdf`);
  fs.copyFileSync(qPdfPath, pdfDest);
  const pdfUrl = `/uploads/sat/SAT Practice Test ${tNum}.pdf`;
  console.log(`PDF copied to uploads: ${pdfDest}`);

  // Parse PDF
  console.log(`Parsing PDF: ${path.basename(qPdfPath)}`);
  const parsedModules = await parsePdfTest(qPdfPath, sPdfPath);

  const orderedModuleKeys: { section: "READING_WRITING" | "MATH"; moduleType: "MOD1" | "MOD2_EASY" | "MOD2_HARD"; name: string }[] = [
    { section: "READING_WRITING", moduleType: "MOD1", name: "Reading & Writing Module 1" },
    { section: "READING_WRITING", moduleType: "MOD2_EASY", name: "Reading & Writing Module 2 - Easier" },
    { section: "READING_WRITING", moduleType: "MOD2_HARD", name: "Reading & Writing Module 2 - Harder" },
    { section: "MATH", moduleType: "MOD1", name: "Math Module 1" },
    { section: "MATH", moduleType: "MOD2_EASY", name: "Math Module 2 - Easier" },
    { section: "MATH", moduleType: "MOD2_HARD", name: "Math Module 2 - Harder" }
  ];

  const satModules = [];
  const allQuestionIds: mongoose.Types.ObjectId[] = [];

  for (let idx = 0; idx < orderedModuleKeys.length; idx++) {
    const keyConfig = orderedModuleKeys[idx];
    const parsedMod = parsedModules.find(m => m.section === keyConfig.section && m.moduleType === keyConfig.moduleType);
    
    if (!parsedMod) {
      throw new Error(`Could not find parsed module for ${keyConfig.name}`);
    }

    const questionIds: mongoose.Types.ObjectId[] = [];
    console.log(`Saving ${keyConfig.name} (${parsedMod.questions.length} questions)...`);

    for (const q of parsedMod.questions) {
      const catName = classifyCategory(q.skill, keyConfig.section);
      const categoryId = categoryMap.get(catName);
      if (!categoryId) {
        throw new Error(`Category not found: ${catName}`);
      }

      const uniqueTag = `dsat-${tNum}-m${idx}-q${q.questionNumber}`;
      
      // Safety check: Ensure tag does not contain dsat-1 through dsat-8
      const isProtected = [1,2,3,4,5,6,7,8].some(n => uniqueTag.includes(`dsat-${n}`));
      if (isProtected) {
        throw new Error(`SAFETY BREACH: Generated tag '${uniqueTag}' would touch protected tests 1-8!`);
      }

      const doc = await Question.create({
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

      questionIds.push(doc._id as mongoose.Types.ObjectId);
      allQuestionIds.push(doc._id as mongoose.Types.ObjectId);
    }

    satModules.push({
      name: keyConfig.name,
      section: keyConfig.section,
      moduleNumber: idx + 1,
      questions: questionIds,
      timeLimitMinutes: keyConfig.section === "READING_WRITING" ? 32 : 35
    });
  }

  // Create SATTest Document
  const test = await SATTest.create({
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

  // Create DiagnosticTest Document
  await DiagnosticTest.create({
    title: `SAT Practice Test ${tNum}`,
    description: `Official-format Digital SAT practice test #${tNum}, 2025 edition.`,
    section: "FULL" as const,
    questions: allQuestionIds,
    timeLimit: 134, // 32 + 32 + 35 + 35 = 134 minutes
    totalMarks: allQuestionIds.length,
    isActive: true,
    accessLevel: "FREE" as const,
  });

  console.log(`Created Diagnostic Test: SAT Practice Test ${tNum}`);

  console.log("Import completed successfully!");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error("Import failed:", e);
  process.exitCode = 1;
});
