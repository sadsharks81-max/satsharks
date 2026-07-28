import "../config/env";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { connectDB } from "../config/db";
import QuestionCategory from "../models/QuestionCategory";
import Question from "../models/Question";
import SATTest from "../models/SATTest";
import DiagnosticTest from "../models/DiagnosticTest";
import { PDFParse } from "pdf-parse";

interface ParsedQuestion {
  questionNumber: number;
  skill: string;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  isFreeResponse: boolean;
}

interface ParsedModule {
  sectionName: string;
  section: "READING_WRITING" | "MATH";
  moduleNumber: number;
  questions: ParsedQuestion[];
}

const PDF_DIRECTORY = path.resolve(__dirname, "../../../satpapers");
const PDF_FILE_REGEX = /^SAT(\d+)\.pdf$/i;

function normalizePdfText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/-\n([A-Za-z])/g, "$1")
    .replace(/\u00A0/g, " ");
}

function isIgnoredLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed === "") return true;
  if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(trimmed)) return true;
  if (/^Page\s+\d+$/i.test(trimmed)) return true;
  if (/^\d+: Page\s+\d+$/i.test(trimmed)) return true;
  if (/^SAT[- ]Style Practice Test/i.test(trimmed)) return true;
  if (/^SAT Practice Test/i.test(trimmed)) return true;
  if (/^Original SAT[- ]Style Full Practice Test/i.test(trimmed)) return true;
  return false;
}

function normalizeSectionName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

function createOrGetModule(
  modules: ParsedModule[],
  sectionName: string,
  section: "READING_WRITING" | "MATH",
  moduleNumber: number
): ParsedModule {
  const normalized = `${normalizeSectionName(sectionName)} Module ${moduleNumber}`;
  const existing = modules.find(
    (mod) => mod.sectionName.toLowerCase() === normalized.toLowerCase() && mod.moduleNumber === moduleNumber
  );
  if (existing) return existing;

  const module = {
    sectionName: normalized,
    section,
    moduleNumber,
    questions: [],
  };
  modules.push(module);
  return module;
}

function parseAnswerKey(text: string, modules: ParsedModule[]) {
  const answerKeyIndex = text.toLowerCase().lastIndexOf("answer key");
  if (answerKeyIndex === -1) return;

  const answerKeyText = text.substring(answerKeyIndex);
  const lines = answerKeyText.split("\n").map((l) => l.trim()).filter(Boolean);

  let currentKeyModuleNumber: number | null = null;

  for (const line of lines) {
    const headerMatch = line.match(/SECTION\s*(\d+)\b.*\bMODULE\s*(\d+)/i);
    if (headerMatch) {
      const sectionNum = parseInt(headerMatch[1], 10);
      const moduleNum = parseInt(headerMatch[2], 10);
      currentKeyModuleNumber = (sectionNum - 1) * 2 + moduleNum;
      continue;
    }

    if (currentKeyModuleNumber !== null) {
      const pairRegex = /\b(\d+)\.\s*([A-D]|[0-9\.\/-]+)\b/gi;
      let match;
      while ((match = pairRegex.exec(line)) !== null) {
        const questionNum = parseInt(match[1], 10);
        const answerText = match[2].trim();

        const targetModule = modules.find((m) => m.moduleNumber === currentKeyModuleNumber);
        if (targetModule) {
          const question = targetModule.questions.find((q) => q.questionNumber === questionNum);
          if (question) {
            question.correctAnswer = answerText.toUpperCase();
            if (!["A", "B", "C", "D"].includes(question.correctAnswer)) {
              question.isFreeResponse = true;
            }
          }
        }
      }
    }
  }
}

function parseSATText(text: string): ParsedModule[] {
  const modules: ParsedModule[] = [];
  
  const rawLines = normalizePdfText(text).split("\n").map((line) => line.trim());
  const lines: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    if (isIgnoredLine(line)) continue;

    // Filter page numbers (digits near page boundary markers)
    if (/^\d+$/.test(line)) {
      let isPageNum = false;
      for (let offset = -3; offset <= 3; offset++) {
        const idx = i + offset;
        if (idx >= 0 && idx < rawLines.length) {
          const l = rawLines[idx];
          if (/^--\s*\d+\s*of\s*\d+\s*--$/i.test(l) || /^Page\s+\d+$/i.test(l) || /^\d+: Page\s+\d+$/i.test(l)) {
            isPageNum = true;
            break;
          }
        }
      }
      if (isPageNum) continue;
    }

    lines.push(line);
  }

  let currentSectionNumber: number | null = null;
  let currentSectionName = "";
  let currentModule: ParsedModule | null = null;
  let currentQuestion: ParsedQuestion | null = null;
  let textLines: string[] = [];
  let collectingOptions = false;
  let lastOption: ParsedQuestion["options"][number] | null = null;

  const flushQuestion = () => {
    if (currentQuestion && currentModule) {
      if (!currentQuestion.text && textLines.length > 0) {
        currentQuestion.text = textLines.join(" ").trim();
      }
      // Save question even if correctAnswer is empty (Answer Key will fill it)
      if (currentQuestion.text) {
        currentModule.questions.push(currentQuestion);
      }
    }
    currentQuestion = null;
    textLines = [];
    collectingOptions = false;
    lastOption = null;
  };

  const createModuleFromHeader = (sectionNum: number, moduleNum: number, sectionLabel: string) => {
    const section = sectionNum === 1 ? "READING_WRITING" : "MATH";
    currentSectionNumber = sectionNum;
    currentSectionName = normalizeSectionName(sectionLabel);
    currentModule = createOrGetModule(modules, currentSectionName, section, (sectionNum - 1) * 2 + moduleNum);
  };

  const maybeCreateModuleFromSectionOnly = (sectionNum: number, sectionLabel: string) => {
    currentSectionNumber = sectionNum;
    currentSectionName = normalizeSectionName(sectionLabel);
    const moduleNumber = sectionNum === 1 ? 1 : 3;
    currentModule = createOrGetModule(modules, currentSectionName, sectionNum === 1 ? "READING_WRITING" : "MATH", moduleNumber);
  };

  for (const line of lines) {
    // Ignore overview lines in matching headers
    if (line.match(/Modules\s+\d+/i) || line.match(/\d+\s*Questions/i)) {
      continue;
    }

    let sectionMatch = line.match(/^#{1,2}\s*SECTION\s+(\d+),\s*MODULE\s+(\d+):\s*(.+)$/i);
    if (!sectionMatch) {
      sectionMatch = line.match(/^SECTION\s+(\d+),\s*MODULE\s+(\d+):\s*(.+)$/i);
    }
    if (sectionMatch) {
      flushQuestion();
      createModuleFromHeader(parseInt(sectionMatch[1], 10), parseInt(sectionMatch[2], 10), sectionMatch[3]);
      continue;
    }

    const sectionOnlyMatch = line.match(/^#{1,2}\s*SECTION\s+(\d+)\s*(?:,|-|:)\s*(.+)$/i)
      || line.match(/^SECTION\s+(\d+)\s*(?:,|-|:)\s*(.+)$/i);
    if (sectionOnlyMatch) {
      flushQuestion();
      maybeCreateModuleFromSectionOnly(parseInt(sectionOnlyMatch[1], 10), sectionOnlyMatch[2]);
      continue;
    }

    const moduleMatch = line.match(/^MODULE\s+(\d+)\b/i);
    if (moduleMatch && currentSectionNumber) {
      flushQuestion();
      const moduleNum = parseInt(moduleMatch[1], 10);
      const section = currentSectionNumber === 1 ? "READING_WRITING" : "MATH";
      currentModule = createOrGetModule(modules, currentSectionName, section, (currentSectionNumber - 1) * 2 + moduleNum);
      continue;
    }

    const questionMatch = line.match(/^Question\s+(\d+)(?:\s+Skill:\s*(.+?))?(?:\s*(?:-|,|:)?\s*(.*))?$/i);
    if (questionMatch) {
      flushQuestion();
      const questionNumber = parseInt(questionMatch[1], 10);

      // Auto-split module if we see Question 1 when questions are already parsed
      if (questionNumber === 1 && currentModule && currentModule.questions.length > 0) {
        if (currentModule.moduleNumber === 1) {
          currentModule = createOrGetModule(modules, currentSectionName, "READING_WRITING", 2);
        } else if (currentModule.moduleNumber === 3) {
          currentModule = createOrGetModule(modules, currentSectionName, "MATH", 4);
        }
      }

      currentQuestion = {
        questionNumber,
        skill: questionMatch[2]?.trim() ?? "",
        text: "",
        options: [],
        correctAnswer: "",
        explanation: "",
        isFreeResponse: false,
      };
      textLines = [];
      collectingOptions = false;
      lastOption = null;
      if (questionMatch[3]) {
        textLines.push(questionMatch[3].trim());
      }
      continue;
    }

    if (!currentQuestion) {
      continue;
    }

    const skillMatch = line.match(/^Skill:\s*(.+)$/i);
    if (skillMatch) {
      currentQuestion.skill = skillMatch[1].trim();
      textLines = [];
      collectingOptions = false;
      lastOption = null;
      continue;
    }

    const optionMatch = line.match(/^([A-D])\)\s*(.*)$/);
    if (optionMatch) {
      if (!currentQuestion) continue;
      if (!currentQuestion.text && textLines.length > 0) {
        currentQuestion.text = textLines.join(" ").trim();
        textLines = [];
      }
      collectingOptions = true;
      const option = {
        label: optionMatch[1],
        text: optionMatch[2].trim(),
      };
      currentQuestion.options.push(option);
      lastOption = option;
      continue;
    }

    // Capture correct answer in a more general format (allows numbers and formulas)
    const answerMatch = line.match(/^Answer:\s*(.+)$/i);
    if (answerMatch) {
      if (!currentQuestion) continue;
      if (!currentQuestion.text && textLines.length > 0) {
        currentQuestion.text = textLines.join(" ").trim();
        textLines = [];
      }
      const ans = answerMatch[1].trim();
      currentQuestion.correctAnswer = ans.toUpperCase();
      currentQuestion.isFreeResponse = !["A", "B", "C", "D"].includes(currentQuestion.correctAnswer);
      collectingOptions = false;
      lastOption = null;
      continue;
    }

    if (collectingOptions && lastOption) {
      lastOption.text = `${lastOption.text} ${line}`.trim();
      continue;
    }

    textLines.push(line);
  }

  flushQuestion();

  // Parse Answer Key to overlay/merge answers
  parseAnswerKey(text, modules);

  // Validation: filter out questions without answers or text
  for (const mod of modules) {
    mod.questions = mod.questions.filter((q) => {
      if (!q.text) return false;
      if (!q.correctAnswer) {
        return false;
      }
      return true;
    });
  }

  return modules;
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
    await QuestionCategory.updateOne({ name: cat.name }, { $set: cat }, { upsert: true });
  }

  const all = await QuestionCategory.find({ name: { $regex: /^SAT / } });
  return new Map(all.map((c) => [c.name, c._id]));
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

async function importQuestions(
  modules: ParsedModule[],
  categoryMap: Map<string, mongoose.Types.ObjectId>,
  testNumber: number
): Promise<Map<string, mongoose.Types.ObjectId[]>> {
  const moduleQuestionIds = new Map<string, mongoose.Types.ObjectId[]>();
  let totalImported = 0;

  for (const mod of modules) {
    const ids: mongoose.Types.ObjectId[] = [];

    for (const q of mod.questions) {
      const catName = classifyCategory(q.skill, mod.section);
      const categoryId = categoryMap.get(catName);
      if (!categoryId) {
        console.warn(`  WARNING: Category not found: ${catName} for skill: "${q.skill}"`);
        continue;
      }

      const uniqueTag = `sat-${testNumber}-m${mod.moduleNumber}-q${q.questionNumber}`;

      const doc = await Question.create({
        text: q.text,
        options: q.options.length > 0 ? q.options : [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        category: categoryId,
        difficulty: "MEDIUM",
        section: mod.section,
        tags: [uniqueTag, `sat-test-${testNumber}`, q.skill],
        source: "SAT",
        status: "PUBLISHED",
      });

      ids.push(doc._id as mongoose.Types.ObjectId);
      totalImported++;
    }

    moduleQuestionIds.set(mod.sectionName, ids);
    console.log(`  ${mod.sectionName}: ${ids.length} questions (${mod.questions.length} parsed)`);
  }

  console.log(`  Total: ${totalImported} imported`);
  return moduleQuestionIds;
}

async function createSATTest(
  modules: ParsedModule[],
  moduleQuestionIds: Map<string, mongoose.Types.ObjectId[]>,
  testNumber: number,
  year: number,
  pdfUrl: string
) {
  const existing = await SATTest.findOne({ year, testNumber });
  if (existing) {
    console.log(`SAT Test ${year} #${testNumber} already exists , updating question references.`);
    existing.modules = modules.map((mod) => ({
      name: mod.sectionName,
      section: mod.section,
      moduleNumber: mod.moduleNumber,
      questions: moduleQuestionIds.get(mod.sectionName) || [],
      timeLimitMinutes: mod.section === "READING_WRITING" ? 32 : 35,
    }));
    if (pdfUrl) existing.pdfUrl = pdfUrl;
    await existing.save();
    return existing;
  }

  const satModules = modules.map((mod) => ({
    name: mod.sectionName,
    section: mod.section,
    moduleNumber: mod.moduleNumber,
    questions: moduleQuestionIds.get(mod.sectionName) || [],
    timeLimitMinutes: mod.section === "READING_WRITING" ? 32 : 35,
  }));

  const test = await SATTest.create({
    title: `SAT Practice Test ${testNumber} , 2024`,
    description: `Official-format Digital SAT practice test #${testNumber}, 2024 edition. Extracted from the corresponding PDF file.`,
    year: 2024,
    testNumber,
    modules: satModules,
    breakDurationMinutes: 10,
    isActive: true,
    accessLevel: "FREE",
    pdfUrl,
  });

  console.log(`Created SAT Test: ${test.title}`);
  return test;
}

async function createDiagnosticTest(
  testNumber: number,
  questionIds: mongoose.Types.ObjectId[]
) {
  const title = `SAT Practice Test ${testNumber}`;
  const existing = await DiagnosticTest.findOne({ title: new RegExp(`^SAT Practice Test ${testNumber}\\s*$`, 'i') });

  const testData = {
    title,
    description: `Official-format Digital SAT practice test #${testNumber}, 2024 edition.`,
    section: "FULL" as const,
    questions: questionIds,
    timeLimit: 134, // 32 + 32 + 35 + 35 = 134 minutes
    totalMarks: questionIds.length,
    isActive: true,
    accessLevel: "FREE" as const,
  };

  if (existing) {
    console.log(`  Updating existing Diagnostic Test: ${title}`);
    await DiagnosticTest.updateOne({ _id: existing._id }, { $set: testData });
  } else {
    console.log(`  Creating new Diagnostic Test: ${title}`);
    await DiagnosticTest.create(testData);
  }
}

async function parseSATPdfFile(filePath: string): Promise<ParsedModule[]> {
  const data = fs.readFileSync(filePath);
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  await parser.destroy();
  return parseSATText(result.text);
}

async function main() {
  const connected = await connectDB();
  if (!connected) throw new Error("DATABASE_URL is required.");

  const prevCount = await Question.countDocuments({ source: "SAT" });
  if (prevCount > 0) {
    console.log(`Deleting ${prevCount} previously imported SAT questions for clean re-import...`);
    await Question.deleteMany({ source: "SAT" });
  }
  await SATTest.deleteMany({});

  const uploadsDir = path.resolve(__dirname, "../../uploads/sat");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  console.log("Ensuring SAT categories...");
  const categoryMap = await ensureCategories();

  const pdfFiles = fs.readdirSync(PDF_DIRECTORY)
    .filter((file) => PDF_FILE_REGEX.test(file))
    .sort((a, b) => parseInt(a.match(PDF_FILE_REGEX)![1], 10) - parseInt(b.match(PDF_FILE_REGEX)![1], 10));

  if (pdfFiles.length === 0) {
    throw new Error(`No SAT PDF files found in ${PDF_DIRECTORY}`);
  }

  for (const pdfFile of pdfFiles) {
    const testNumber = parseInt(pdfFile.match(PDF_FILE_REGEX)![1], 10);
    const pdfSourcePath = path.resolve(PDF_DIRECTORY, pdfFile);
    const pdfDestPath = path.join(uploadsDir, pdfFile);
    const pdfUrl = `/uploads/sat/${pdfFile}`;

    console.log(`\nReading ${pdfFile}...`);
    const modules = await parseSATPdfFile(pdfSourcePath);

    if (modules.length === 0) {
      console.warn(`  WARNING: No modules parsed from ${pdfFile}. Skipping.`);
      continue;
    }

    let totalQ = 0;
    for (const m of modules) {
      totalQ += m.questions.length;
    }
    console.log(`  Total parsed for ${pdfFile}: ${totalQ} questions`);

    const moduleQuestionIds = await importQuestions(modules, categoryMap, testNumber);

    if (!fs.existsSync(pdfDestPath)) {
      fs.copyFileSync(pdfSourcePath, pdfDestPath);
      console.log(`  Copied PDF to ${pdfDestPath}`);
    }

    await createSATTest(modules, moduleQuestionIds, testNumber, 2024, pdfUrl);

    // Aggregate all question IDs for this test and create/update DiagnosticTest
    const allQuestionIds: mongoose.Types.ObjectId[] = [];
    for (const ids of moduleQuestionIds.values()) {
      allQuestionIds.push(...ids);
    }
    await createDiagnosticTest(testNumber, allQuestionIds);
  }

  console.log("\nSAT import complete!");
}

if (typeof require !== 'undefined' && require.main === module || (process.argv[1] && (process.argv[1].endsWith("importAllSAT.ts") || process.argv[1].endsWith("importAllSAT")))) {
  main()
    .catch((error) => {
      console.error("Import failed:", error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await mongoose.disconnect();
    });
}

export { parseSATText }; 
