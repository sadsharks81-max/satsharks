import "../config/env";
import fs from "fs";
import path from "path";
import * as pdfjsLegacy from "pdfjs-dist/legacy/build/pdf.mjs";

interface TextItem {
  str: string;
  x: number;
  y: number;
}

interface TestConfig {
  testNumber: number;
  questions: {
    rw_mod1: [number, number];
    rw_mod2_easy: [number, number];
    rw_mod2_hard: [number, number];
    math_mod1: [number, number];
    math_mod2_easy: [number, number];
    math_mod2_hard: [number, number];
  };
  solutions: {
    rw_mod1: [number, number];
    rw_mod2_easy: [number, number];
    rw_mod2_hard: [number, number];
    math_mod1: [number, number];
    math_mod2_easy: [number, number];
    math_mod2_hard: [number, number];
  };
}

const configs: TestConfig[] = [
  {
    testNumber: 10,
    questions: {
      rw_mod1: [2, 11],
      rw_mod2_easy: [12, 21],
      rw_mod2_hard: [22, 32],
      math_mod1: [33, 37],
      math_mod2_easy: [38, 43],
      math_mod2_hard: [44, 48]
    },
    solutions: {
      rw_mod1: [2, 7],
      rw_mod2_easy: [8, 13],
      rw_mod2_hard: [14, 18],
      math_mod1: [19, 21],
      math_mod2_easy: [22, 24],
      math_mod2_hard: [25, 27]
    }
  },
  {
    testNumber: 11,
    questions: {
      rw_mod1: [2, 14],
      rw_mod2_easy: [15, 29],
      rw_mod2_hard: [30, 43],
      math_mod1: [44, 50],
      math_mod2_easy: [50, 56],
      math_mod2_hard: [57, 62]
    },
    solutions: {
      rw_mod1: [2, 9],
      rw_mod2_easy: [10, 17],
      rw_mod2_hard: [18, 27],
      math_mod1: [28, 31],
      math_mod2_easy: [32, 36],
      math_mod2_hard: [37, 41]
    }
  },
  {
    testNumber: 12,
    questions: {
      rw_mod1: [2, 11],
      rw_mod2_easy: [12, 22],
      rw_mod2_hard: [23, 33],
      math_mod1: [33, 38],
      math_mod2_easy: [39, 43],
      math_mod2_hard: [44, 48]
    },
    solutions: {
      rw_mod1: [3, 5],
      rw_mod2_easy: [6, 9],
      rw_mod2_hard: [10, 13],
      math_mod1: [13, 16],
      math_mod2_easy: [16, 18],
      math_mod2_hard: [18, 21]
    }
  }
];

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
  if (/^[\d\s−\-–/]+$/i.test(clean)) return true;
  const lower = clean.toLowerCase();
  if (/^section\s+\d/i.test(clean)) return true;
  if (lower.includes("module") && (lower.includes("math") || lower.includes("reading") || lower.includes("writing") || lower.includes("adaptive"))) return true;
  if (lower.includes("questions") && (lower.includes("minutes") || lower.includes("limit"))) return true;
  if (lower.includes("minutes") && lower.includes("|")) return true;
  if (lower.includes("time:") || lower.includes("time limit") || /^time\s+limit/i.test(clean)) return true;
  if (/^\(?q\d+[-–—−]\d+\)?$/i.test(clean)) return true;
  if (lower.startsWith("directions")) return true;
  if (lower.startsWith("for questions") && lower.includes("solve")) return true;
  if (lower.includes("student-produced response") || lower.includes("enter your answer") || lower.includes("disregard the unit symbol")) return true;
  if (/^[=\-−–—\s]+$/.test(clean)) return true;
  return false;
}

function parseQuestionsFromPages(pages: { text: string; pageNum: number }[]) {
  const questions: any[] = [];
  let currentQ: any = null;
  let textLines: string[] = [];
  let currentSection: "READING_WRITING" | "MATH" = "READING_WRITING";
  
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
      
      const isHeader = lowerLine.includes("section 1") || lowerLine.includes("section 2") || 
                       lowerLine.includes("module 1") || lowerLine.includes("module 2") ||
                       (lowerLine.includes("reading & writing") && lowerLine.includes("module")) ||
                       (lowerLine.includes("math") && lowerLine.includes("module"));
      if (isHeader) {
        flushQ();
        if (lowerLine.includes("section 1") || lowerLine.includes("reading & writing") || lowerLine.includes("reading and writing")) {
          currentSection = "READING_WRITING";
        } else if (lowerLine.includes("section 2") || lowerLine.includes("math")) {
          currentSection = "MATH";
        }
      }
      
      if (shouldSkipLine(line)) continue;
      const cleanLine = line.replace(/^[#\*_\s]+|[#\*_\s]+$/g, "").trim();
      if (!cleanLine) continue;
      
      const qMatch = cleanLine.match(/^(Question|Q)\s*(\d+)(?!\d)/i);
      if (qMatch) {
        flushQ();
        currentQ = {
          section: currentSection,
          pageNum: page.pageNum,
          num: parseInt(qMatch[2], 10),
          skill: "Words in Context",
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

async function runTest(cfg: TestConfig) {
  const dir = path.resolve(__dirname, "../../../reference_data/digitalsatpapers2");
  const qPath = path.join(dir, `SAT Practice Test ${cfg.testNumber} - Standardized.pdf`);
  const sPath = path.join(dir, `SAT Practice Test ${cfg.testNumber} - Standardized Answer Key.pdf`);
  
  console.log(`\n=========================================`);
  console.log(`RUNNING DRY RUN FOR TEST ${cfg.testNumber}`);
  console.log(`=========================================`);
  
  const qPages = await extractPagesText(qPath);
  const rawQs = parseQuestionsFromPages(qPages);
  
  const sPages = await extractPagesText(sPath);
  const rawSols = parseSolutionsFromPages(sPages);
  
  const mapQ = (pageNum: number, qNum: number, section: string): string | null => {
    // Upper bounds validation
    if (section === "READING_WRITING" && qNum > 27) return null;
    if (section === "MATH" && qNum > 22) return null;
    
    const q = cfg.questions;
    
    // Test 11 Question Boundary resolution for Page 50 (shared between math_mod1 and math_mod2_easy)
    if (cfg.testNumber === 11 && pageNum === 50) {
      if (qNum <= 10) return "math_mod2_easy";
      return "math_mod1";
    }
    
    // Test 12 Question Boundary resolution for Page 33 (shared between rw_mod2_hard and math_mod1)
    if (cfg.testNumber === 12 && pageNum === 33) {
      if (section === "READING_WRITING") return "rw_mod2_hard";
      return "math_mod1";
    }
    
    if (section === "READING_WRITING") {
      if (pageNum >= q.rw_mod1[0] && pageNum <= q.rw_mod1[1]) return "rw_mod1";
      if (pageNum >= q.rw_mod2_easy[0] && pageNum <= q.rw_mod2_easy[1]) return "rw_mod2_easy";
      if (pageNum >= q.rw_mod2_hard[0] && pageNum <= q.rw_mod2_hard[1]) return "rw_mod2_hard";
    } else {
      if (pageNum >= q.math_mod1[0] && pageNum <= q.math_mod1[1]) return "math_mod1";
      if (pageNum >= q.math_mod2_easy[0] && pageNum <= q.math_mod2_easy[1]) return "math_mod2_easy";
      if (pageNum >= q.math_mod2_hard[0] && pageNum <= q.math_mod2_hard[1]) return "math_mod2_hard";
    }
    return null;
  };
  
  const mapSol = (pageNum: number, qNum: number, section: string): string | null => {
    // Upper bounds validation
    if (section === "READING_WRITING" && qNum > 27) return null;
    if (section === "MATH" && qNum > 22) return null;
    
    const s = cfg.solutions;
    
    // Test 12 Solution Boundary resolution for Page 16 (shared between math_mod1 and math_mod2_easy)
    if (cfg.testNumber === 12 && pageNum === 16 && section === "MATH") {
      if (qNum === 22) return "math_mod1";
      return "math_mod2_easy";
    }
    
    if (section === "READING_WRITING") {
      if (pageNum >= s.rw_mod1[0] && pageNum <= s.rw_mod1[1]) return "rw_mod1";
      if (pageNum >= s.rw_mod2_easy[0] && pageNum <= s.rw_mod2_easy[1]) return "rw_mod2_easy";
      if (pageNum >= s.rw_mod2_hard[0] && pageNum <= s.rw_mod2_hard[1]) return "rw_mod2_hard";
    } else {
      if (pageNum >= s.math_mod1[0] && pageNum <= s.math_mod1[1]) return "math_mod1";
      if (pageNum >= s.math_mod2_easy[0] && pageNum <= s.math_mod2_easy[1]) return "math_mod2_easy";
      if (pageNum >= s.math_mod2_hard[0] && pageNum <= s.math_mod2_hard[1]) return "math_mod2_hard";
    }
    return null;
  };
  
  const mappedQs: Record<string, any[]> = {
    rw_mod1: [], rw_mod2_easy: [], rw_mod2_hard: [],
    math_mod1: [], math_mod2_easy: [], math_mod2_hard: []
  };
  
  const seenQ = new Set<string>();
  for (const q of rawQs) {
    const target = mapQ(q.pageNum, q.num, q.section);
    if (!target) continue;
    
    const key = `${target}-${q.num}`;
    if (seenQ.has(key)) {
      const existingIdx = mappedQs[target].findIndex(x => x.num === q.num);
      if (existingIdx !== -1) {
        if (q.text.length > mappedQs[target][existingIdx].text.length) {
          mappedQs[target][existingIdx] = q;
        }
      }
      continue;
    }
    seenQ.add(key);
    mappedQs[target].push(q);
  }
  
  const mappedSols: Record<string, any[]> = {
    rw_mod1: [], rw_mod2_easy: [], rw_mod2_hard: [],
    math_mod1: [], math_mod2_easy: [], math_mod2_hard: []
  };
  
  const seenSol = new Set<string>();
  for (const s of rawSols) {
    const target = mapSol(s.pageNum, s.num, s.section);
    if (!target) continue;
    
    const key = `${target}-${s.num}`;
    if (seenSol.has(key)) {
      const existingIdx = mappedSols[target].findIndex(x => x.num === s.num);
      if (existingIdx !== -1) {
        if (s.explanation.length > mappedSols[target][existingIdx].explanation.length) {
          mappedSols[target][existingIdx] = s;
        }
      }
      continue;
    }
    seenSol.add(key);
    mappedSols[target].push(s);
  }
  
  console.log("Dry Run Summary:");
  for (const key of Object.keys(mappedQs)) {
    const qCount = mappedQs[key].length;
    const sCount = mappedSols[key].length;
    const expected = key.startsWith("rw") ? 27 : 22;
    console.log(`  ${key}: Questions = ${qCount}/${expected}, Solutions = ${sCount}/${expected}`);
    if (qCount !== expected || sCount !== expected) {
      console.log(`    WARNING: mismatch for ${key}!`);
      const missingQs = [];
      for (let i = 1; i <= expected; i++) {
        if (!mappedQs[key].some(x => x.num === i)) missingQs.push(`Q${i}`);
      }
      const missingSols = [];
      for (let i = 1; i <= expected; i++) {
        if (!mappedSols[key].some(x => x.num === i)) missingSols.push(`Q${i}`);
      }
      if (missingQs.length > 0) console.log(`      Missing Questions: ${missingQs.join(", ")}`);
      if (missingSols.length > 0) console.log(`      Missing Solutions: ${missingSols.join(", ")}`);
    }
  }
}

async function main() {
  for (const cfg of configs) {
    await runTest(cfg);
  }
}

main().catch(console.error);
