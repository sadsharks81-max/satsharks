import "../config/env";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

// Interfaces
interface ParsedQuestion {
  questionNumber: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  text: string;
  options: { label: string; text: string }[];
}

interface ParsedSolution {
  questionNumber: number;
  correctAnswer: string;
  explanation: string;
}

// Map each pair of files to a specific category and tags for folder 1
const ORIGINAL_FILE_MAP = [
  {
    questions: "01_Overall_Structure_Questions.pdf",
    solutions: "02_Overall_Structure_Solutions.pdf",
    category: "SAT Practice: Overall Structure",
    tag: "overall-structure",
    type: "pdf"
  },
  {
    questions: "03_Cross_Text_Questions.pdf",
    solutions: "04_Cross_Text_Solutions.pdf",
    category: "SAT Practice: Cross-Text Connections",
    tag: "cross-text",
    type: "pdf"
  },
  {
    questions: "05_Detail_Questions.pdf",
    solutions: "06_Detail_Solutions.pdf",
    category: "SAT Practice: Detail",
    tag: "detail",
    type: "pdf"
  },
  {
    questions: "07_Claim_Example_Match_Questions.pdf",
    solutions: "08_Claim_Example_Match_Solutions.pdf",
    category: "SAT Practice: Claim-Example Match",
    tag: "claim-example-match",
    type: "pdf"
  },
  {
    questions: "DOC1_Vocab_Questions.pdf",
    solutions: "DOC2_Vocab_Solutions.pdf",
    category: "SAT Practice: Vocabulary",
    tag: "vocabulary",
    type: "pdf"
  },
  {
    questions: "DSAT_Evidence_DataGraphTable_50MCQs_QUESTIONS.pdf",
    solutions: "DSAT_Evidence_DataGraphTable_50MCQs_SOLUTIONS.pdf",
    category: "SAT Practice: Evidence (Data, Graphs, Tables)",
    tag: "evidence-data-graph-table",
    type: "pdf"
  },
  {
    questions: "DSAT_Evidence_Support_Weaken_50_Questions.docx",
    solutions: "DSAT_Evidence_Support_Weaken_50_Solutions.docx",
    category: "SAT Practice: Evidence (Support, Weaken)",
    tag: "evidence-support-weaken",
    type: "docx"
  },
  {
    questions: "DSAT_Function_Underlined_Questions.pdf",
    solutions: "DSAT_Function_Underlined_Solutions.pdf",
    category: "SAT Practice: Function of Underlined Text",
    tag: "function-underlined",
    type: "pdf"
  },
  {
    questions: "DSAT_Grammar_150_Questions.pdf",
    solutions: "DSAT_Grammar_150_Solutions.pdf",
    category: "SAT Practice: Grammar",
    tag: "grammar",
    type: "pdf"
  },
  {
    questions: "DSAT_Inference_Complete_the_Text_80_QUESTIONS.pdf",
    solutions: "DSAT_Inference_Complete_the_Text_80_SOLUTIONS.pdf",
    category: "SAT Practice: Inference & Complete the Text",
    tag: "inference",
    type: "pdf"
  },
  {
    questions: "DSAT_Main_Idea_Questions.pdf",
    solutions: "DSAT_Main_Idea_Solutions.pdf",
    category: "SAT Practice: Main Idea",
    tag: "main-idea",
    type: "pdf"
  },
  {
    questions: "DSAT_Main_Purpose_Questions.pdf",
    solutions: "DSAT_Main_Purpose_Solutions.pdf",
    category: "SAT Practice: Main Purpose",
    tag: "main-purpose",
    type: "pdf"
  },
  {
    questions: "DSAT_Quotation_Illustrates_Claim_Questions.pdf",
    solutions: "DSAT_Quotation_Illustrates_Claim_Solutions.pdf",
    category: "SAT Practice: Quotation Illustrates Claim",
    tag: "quotation-illustrates-claim",
    type: "pdf"
  },
  {
    questions: "DSAT_Transitions_80_Questions.pdf",
    solutions: "DSAT_Transitions_80_Solutions.pdf",
    category: "SAT Practice: Transitions",
    tag: "transitions",
    type: "pdf"
  },
  {
    questions: "Rhetorical_Synthesis_90_QUESTIONS.md",
    solutions: "Rhetorical_Synthesis_90_SOLUTIONS.md",
    category: "SAT Practice: Rhetorical Synthesis",
    tag: "rhetorical-synthesis",
    type: "md"
  }
];

function normalizeText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u00A0/g, " ");
}

function preprocessQuestionText(text: string): string {
  const lines = text.split("\n").map(l => l.trim());
  const processed: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      if (processed.length > 0 && processed[processed.length - 1] !== "") {
        processed.push("");
      }
      continue;
    }

    if (processed.length > 0) {
      const lastIdx = processed.length - 1;
      const lastLine = processed[lastIdx];

      const isNewBlock = line.match(/^Q\d+/i) || line.match(/^[A-D][\)\.]/i) || line.match(/^\[(Easy|Medium|Hard)\]/i);
      const lastLineEndsInWord = lastLine && /[a-zA-Z0-9,\-'"”\)]$/.test(lastLine) && !lastLine.endsWith(".") && !lastLine.endsWith("?") && !lastLine.endsWith("!") && !lastLine.endsWith(":");
      const currentLineIsContinuation = /^[a-z0-9\)\}\]%,;]/.test(line);

      if (!isNewBlock && (lastLineEndsInWord || currentLineIsContinuation) && lastLine !== "") {
        processed[lastIdx] = `${lastLine} ${line}`.replace(/\s+/g, " ");
        continue;
      }
    }

    processed.push(line);
  }

  return processed.join("\n").trim();
}

function isIgnoredPracticeLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (/^Page\s+\d+$/i.test(trimmed)) return true;
  if (/^\d+$/i.test(trimmed)) return true; // standalone page number
  if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(trimmed)) return true; // stand-alone page number tag
  if (/^DSAT Practice/i.test(trimmed)) return true;
  if (/Original MCQs/i.test(trimmed)) return true;
  if (/Solutions with Reasoning/i.test(trimmed)) return true;
  if (/DIGITAL SAT READING/i.test(trimmed)) return true;
  if (/Practice Questions/i.test(trimmed)) return true;
  if (/DOC \d+/i.test(trimmed)) return true;
  if (/QUESTIONS ONLY/i.test(trimmed)) return true;
  if (/Detailed Solutions/i.test(trimmed)) return true;
  if (/Evidence\s*,\s*/i.test(trimmed)) return true;
  return false;
}

function parseOptionsFromLine(line: string, currentQ: ParsedQuestion): boolean {
  const firstOptMatch = line.match(/(?:^|[\s\*]+)([A-D][\)\.]\s)/i) || line.match(/^(\*\*?[A-D][\)\.])/i);
  if (!firstOptMatch) return false;

  const labelMatch = firstOptMatch[1] || firstOptMatch[0];
  const firstOptIndex = line.indexOf(labelMatch);

  // Append any prefix text to the previous option if one exists
  if (firstOptIndex > 0) {
    const prefixText = line.substring(0, firstOptIndex).trim();
    if (prefixText && currentQ.options.length > 0) {
      const lastOpt = currentQ.options[currentQ.options.length - 1];
      lastOpt.text = `${lastOpt.text} ${prefixText}`.trim();
    }
  }

  // Parse all options starting from firstOptIndex
  const optLine = line.substring(firstOptIndex);
  const matches = [...optLine.matchAll(/([A-D])[\)\.]\s*(.*?)(?=\s+[A-D][\)\.]\s*|$)/gi)];

  for (const m of matches) {
    const label = m[1].toUpperCase();
    const text = m[2].trim();
    const existing = currentQ.options.find(o => o.label === label);
    if (existing) {
      existing.text = `${existing.text} ${text}`.trim();
    } else {
      currentQ.options.push({ label, text });
    }
  }

  return true;
}

// Robust, universal Question parser
function parseQuestions(text: string): ParsedQuestion[] {
  const normalized = normalizeText(text);
  const lines = normalized.split("\n").map(l => l.trim());
  const questions: ParsedQuestion[] = [];

  let currentQ: ParsedQuestion | null = null;
  let textLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isIgnoredPracticeLine(line)) continue;

    // Detect question start:
    // MD formatting: **1.** 🟢 Easy or **Question 1**
    const mdMatch = line.match(/^\*\*Q?(\d+)\.\s*(?:\*\*|\s)*(?:🟢|🟡|🔴)?\s*\[?(Easy|Medium|Hard)\]?/i) || 
                    line.match(/^\*\*(\d+)\.\*\*\s*(?:🟢|🟡|🔴)?\s*(Easy|Medium|Hard)/i) || 
                    line.match(/^\*\*(\d+)\.\*\*\s*(Easy|Medium|Hard)/i) || 
                    line.match(/^\*\*(\d+)\.\s*(?:🟢|🟡|🔴)?\s*(Easy|Medium|Hard)/i) ||
                    line.match(/^##\s*Question\s+(\d+)\b/i);
    
    // Normal text formatting: Question 1    🟢 Easy    [Multiple Choice] or Q1. or 1 Easy
    const textMatch = line.match(/^Question\s+(\d+)\s*(?:🟢|🟡|🔴)?\s*\[?(Easy|Medium|Hard)\]?/i) || 
                      line.match(/^Q(\d+)\b(?:\.|\s)*(?:🟢|🟡|🔴)?\s*\[?(Easy|Medium|Hard)\]?/i) ||
                      line.match(/^Q(\d+)\b/i) ||
                      line.match(/^Question\s+(\d+)\b/i) ||
                      line.match(/^(\d+)\s+(Easy|Medium|Hard)\b/i);

    if (mdMatch || textMatch) {
      // Flush previous
      if (currentQ) {
        if (!currentQ.text) {
          currentQ.text = textLines.join("\n").trim();
        }
        questions.push(currentQ);
      }

      const qNum = parseInt((mdMatch ? mdMatch[1] : textMatch![1]), 10);
      let diffStr = (mdMatch ? mdMatch[2] : textMatch![2])?.toUpperCase();

      // Lookahead for difficulty in next 3 lines
      if (!diffStr) {
        for (let offset = 1; offset <= 3 && i + offset < lines.length; offset++) {
          const nextLine = lines[i + offset];
          if (/^DIFFICULTY:\s*(Easy|Medium|Hard)/i.test(nextLine)) {
            diffStr = nextLine.replace(/DIFFICULTY:\s*/i, "").toUpperCase();
            i += offset;
            break;
          }
          if (/^\[?(Easy|Medium|Hard)\]?$/i.test(nextLine)) {
            diffStr = nextLine.replace(/[\[\]]/g, "").toUpperCase();
            i += offset;
            break;
          }
        }
      }

      currentQ = {
        questionNumber: qNum,
        difficulty: (diffStr === "EASY" || diffStr === "MEDIUM" || diffStr === "HARD" ? diffStr : "MEDIUM") as any,
        text: "",
        options: []
      };
      textLines = [];
      continue;
    }

    if (!currentQ) continue;

    // Detect if this line starts options (e.g. starts with A) or A.)
    const startsWithOptions = line.match(/^[A-D][\)\.]/i) || line.match(/^\*\*?[A-D][\)\.]/i);
    if (startsWithOptions) {
      // Flush question text if we are starting option A
      if (line.match(/^[A\(\*\s]*A[\)\.]/i)) {
        if (textLines.length > 0 && currentQ.text === "") {
          currentQ.text = textLines.join("\n").trim();
          textLines = [];
        }
      }
      parseOptionsFromLine(line, currentQ);
      continue;
    }

    // If we've already started collecting options, handle subsequent options or line wraps
    if (currentQ.options.length > 0) {
      const parsed = parseOptionsFromLine(line, currentQ);
      if (parsed) continue;

      const lastOpt = currentQ.options[currentQ.options.length - 1];
      lastOpt.text = `${lastOpt.text} ${line}`.trim();
      continue;
    }

    textLines.push(line);
  }

  // Flush last
  if (currentQ) {
    if (!currentQ.text) {
      currentQ.text = textLines.join("\n").trim();
    }
    questions.push(currentQ);
  }

  return questions;
}

// Robust, universal Solutions parser
function parseSolutions(text: string): ParsedSolution[] {
  const normalized = normalizeText(text);
  const lines = normalized.split("\n").map(l => l.trim());
  const solutions: ParsedSolution[] = [];

  let currentSol: ParsedSolution | null = null;
  let explLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (isIgnoredPracticeLine(line)) continue;

    // Detect if this line starts a new solution block
    const qMatch = line.match(/^##\s*Question\s+(\d+)\b/i) ||
                  line.match(/^Question\s+(\d+)\b/i) ||
                  line.match(/^Q(\d+)\b/i) ||
                  line.match(/^\*\*Q(\d+)\b/i);

    if (qMatch) {
      const qNum = parseInt(qMatch[1], 10);
      
      // Flush previous
      if (currentSol) {
        currentSol.explanation = explLines.join("\n").trim();
        solutions.push(currentSol);
        currentSol = null;
        explLines = [];
      }

      // Look for Correct Answer in this line or subsequent lines (up to 4 lines)
      let ans = "";
      let matchedIndex = -1;
      let matchedLineOffset = 0;

      for (let offset = 0; offset <= 4 && i + offset < lines.length; offset++) {
        const checkLine = lines[i + offset];
        const ansMatch = checkLine.match(/Correct Answer:\s*([A-D]|[\d\.\-\/]+)/i) || 
                         checkLine.match(/Answer:\s*([A-D]|[\d\.\-\/]+)/i) ||
                         checkLine.match(/n Correct Answer:\s*([A-D]|[\d\.\-\/]+)/i);
                         
        if (ansMatch) {
          ans = ansMatch[1].trim();
          const optMatch = ans.match(/^([A-D])(?:\s+|\)|\]|\b)/i) || ans.match(/^([A-D])$/i);
          if (optMatch) {
            ans = optMatch[1].toUpperCase();
          }
          matchedIndex = ansMatch.index ?? -1;
          matchedLineOffset = offset;
          break;
        }
      }

      currentSol = {
        questionNumber: qNum,
        correctAnswer: ans || "A",
        explanation: ""
      };
      explLines = [];

      // If Correct Answer was found in the same line, append any trailing text to explanation
      if (ans && matchedLineOffset === 0 && matchedIndex !== -1) {
        const rest = line.substring(matchedIndex + "Correct Answer: X".length).trim();
        if (rest) {
          explLines.push(rest.replace(/^[:\|\s,\.-]+/, "").trim());
        }
      }
      
      // Fast-forward the loop pointer if we consumed lines to find the answer
      i += matchedLineOffset;
      continue;
    }

    if (!currentSol) continue;
    explLines.push(line);
  }

  // Flush last
  if (currentSol) {
    currentSol.explanation = explLines.join("\n").trim();
    solutions.push(currentSol);
  }

  return solutions;
}

async function extractText(filePath: string, type: "pdf" | "docx" | "md"): Promise<string> {
  if (type === "md") {
    return fs.readFileSync(filePath, "utf-8");
  } else if (type === "docx") {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }
}

function getSolutionsFile(qFile: string): string | null {
  if (qFile === "DSAT_Linear_Models_Q1_Questions_FINAL.pdf") {
    return "DSAT_Linear_Models_Q2_Solutions_FINAL.pdf";
  }
  if (qFile === "DSAT_Questions_Only_FINAL.pdf") {
    return "DSAT_Solutions_FINAL.pdf";
  }
  
  const patterns = [
    { q: /_QUESTIONS/i, s: "_SOLUTIONS" },
    { q: /_Questions/i, s: "_Solutions" },
    { q: / - Questions/i, s: " - Solutions" },
    { q: / Questions/i, s: " Solutions" },
    { q: /_Questions_Only/i, s: "_Solutions" }
  ];
  
  for (const pat of patterns) {
    if (pat.q.test(qFile)) {
      return qFile.replace(pat.q, pat.s);
    }
  }
  return null;
}

function cleanCategoryName(qFile: string): string {
  let base = qFile
    .replace(/\.pdf$/i, "")
    .replace(/\.docx$/i, "")
    .replace(/\.md$/i, "");
    
  if (base === "DSAT_Questions_Only_FINAL") {
    return "SAT Practice: Function Notation & Linear Models";
  }
  if (base === "DSAT_Linear_Models_Q1_Questions_FINAL") {
    return "SAT Practice: Creating Linear Models";
  }
  
  base = base
    .replace(/_Questions_Only_FINAL$/i, "")
    .replace(/_Questions_FINAL$/i, "")
    .replace(/_Questions_50MCQ$/i, "")
    .replace(/_QUESTIONS$/i, "")
    .replace(/_Questions$/i, "")
    .replace(/ - Questions$/i, "")
    .replace(/ Questions$/i, "")
    .replace(/_Questions_v2$/i, "")
    .replace(/_Questions_Only$/i, "");
    
  base = base.replace(/^DSAT_\d+_/i, "").replace(/^DSAT_Topic\d+_/i, "").replace(/^DSAT_/i, "");
  base = base.replace(/_/g, " ").trim();
  
  const mapping: { [key: string]: string } = {
    "AP": "Arithmetic Progression",
    "CompAngleTrig": "Complementary Angle Trigonometry",
    "DI": "Data Interpretation",
    "LA": "Lines & Angles",
    "LM": "Creating Linear Models",
    "TP": "Triangle Properties",
    "VSA": "Volume & Surface Area",
    "SpecialRightTriangles": "Special Right Triangles",
    "ExponentRules": "Exponent Rules & Properties",
    "Discriminant": "Discriminant & Number of Solutions",
    "NonlinearSystems": "Nonlinear Systems of Equations",
    "UnitConversion": "Unit Conversion & Dimensional Analysis",
    "Function Notation": "Function Notation & Evaluations",
    "Linear Equations": "Linear Equations in One & Two Variables",
    "Linear Inequalities": "Linear Inequalities",
    "Systems of Linear Equations": "Systems of Linear Equations",
    "Systems V2": "Systems of Linear Equations (Advanced)",
    "Right Triangle Trigonometry": "Right Triangle Trigonometry",
    "Statistics Mean Median": "Statistics: Mean & Median",
    "Quadratic": "Quadratic Equations - Solving",
    "Topic1 Quadratics": "Quadratic Equations - Solving",
    "Topic2 Exponential": "Exponential Functions - Growth & Decay"
  };
  
  if (mapping[base]) {
    base = mapping[base];
  }
  
  return `SAT Practice: ${base}`;
}

async function run() {
  console.log("=== DRY RUN PARSING PRACTICE QUESTIONS ===");
  
  const practiceDir = path.resolve(__dirname, "../../../practicequestions");
  const practiceDir2 = path.resolve(__dirname, "../../../practicequestions2");
  
  let totalErrors = 0;
  
  // 1. Process folder 1 (original)
  console.log("\n--- FOLDER 1: practicequestions ---");
  for (const item of ORIGINAL_FILE_MAP) {
    const qPath = path.join(practiceDir, item.questions);
    const sPath = path.join(practiceDir, item.solutions);
    
    if (!fs.existsSync(qPath) || !fs.existsSync(sPath)) {
      console.error(`  ERROR: Files not found for ${item.category}`);
      totalErrors++;
      continue;
    }
    
    const qText = await extractText(qPath, item.type as any);
    const sText = await extractText(sPath, item.type as any);
    
    const parsedQ = parseQuestions(qText);
    const parsedS = parseSolutions(sText);
    
    if (parsedQ.length !== parsedS.length) {
      console.warn(`  WARNING: count mismatch for ${item.category}: Q=${parsedQ.length}, S=${parsedS.length}`);
      totalErrors++;
    } else {
      console.log(`  SUCCESS: ${item.category} -> Parsed ${parsedQ.length} Q/S pairs.`);
    }
  }
  
  // 2. Process folder 2 (new)
  console.log("\n--- FOLDER 2: practicequestions2 ---");
  const files2 = fs.readdirSync(practiceDir2).filter(f => !f.includes("(1)"));
  const questionFiles = files2.filter(f => f.toLowerCase().includes("question") || f.toLowerCase().includes("questions_only"));
  
  for (const qFile of questionFiles) {
    const sFile = getSolutionsFile(qFile);
    if (!sFile || !fs.existsSync(path.join(practiceDir2, sFile))) {
      console.warn(`  WARNING: No solution file found for questions file "${qFile}" (expected "${sFile}")`);
      totalErrors++;
      continue;
    }
    
    const qPath = path.join(practiceDir2, qFile);
    const sPath = path.join(practiceDir2, sFile);
    
    const qExt = path.extname(qFile).substring(1) as any;
    const sExt = path.extname(sFile).substring(1) as any;
    
    const qText = await extractText(qPath, qExt);
    const sText = await extractText(sPath, sExt);
    
    const parsedQ = parseQuestions(qText);
    const parsedS = parseSolutions(sText);
    
    const catName = cleanCategoryName(qFile);
    
    if (parsedQ.length === 0) {
      console.error(`  ERROR: 0 questions parsed for file "${qFile}"`);
      totalErrors++;
    } else if (parsedS.length === 0) {
      console.error(`  ERROR: 0 solutions parsed for file "${sFile}"`);
      totalErrors++;
    } else if (parsedQ.length !== parsedS.length) {
      console.warn(`  WARNING: count mismatch for "${catName}" (Q file: ${qFile}, S file: ${sFile}): Q=${parsedQ.length}, S=${parsedS.length}`);
      totalErrors++;
    } else {
      console.log(`  SUCCESS: "${catName}" -> Parsed ${parsedQ.length} Q/S pairs.`);
    }
  }
  
  console.log(`\nDry run completed with ${totalErrors} errors/warnings.`);
}

run().catch(console.error);
