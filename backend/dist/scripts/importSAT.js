"use strict";
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
function parseMarkdown(content) {
    const modules = [];
    const lines = content.split("\n");
    let currentModule = null;
    let currentQuestion = null;
    let textLines = [];
    let phase = "IDLE";
    const flushQuestion = () => {
        if (currentQuestion && currentModule) {
            if (phase === "COLLECTING_TEXT" && textLines.length > 0) {
                currentQuestion.text = textLines.join("\n").trim();
            }
            if (currentQuestion.text && currentQuestion.correctAnswer) {
                currentModule.questions.push(currentQuestion);
            }
        }
        currentQuestion = null;
        textLines = [];
        phase = "IDLE";
    };
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        // Section/module header
        const sectionMatch = trimmed.match(/^## SECTION (\d+), MODULE (\d+): (.+)/);
        if (sectionMatch) {
            flushQuestion();
            const sectionNum = parseInt(sectionMatch[1]);
            const moduleNum = parseInt(sectionMatch[2]);
            const sectionName = sectionMatch[3].trim();
            currentModule = {
                sectionName: `${sectionName} Module ${moduleNum}`,
                section: sectionNum === 1 ? "READING_WRITING" : "MATH",
                moduleNumber: (sectionNum - 1) * 2 + moduleNum,
                questions: [],
            };
            modules.push(currentModule);
            continue;
        }
        // Question header
        const questionMatch = trimmed.match(/^\*\*Question (\d+)\*\*/);
        if (questionMatch) {
            flushQuestion();
            currentQuestion = {
                questionNumber: parseInt(questionMatch[1]),
                skill: "",
                text: "",
                options: [],
                correctAnswer: "",
                explanation: "",
                isFreeResponse: false,
            };
            phase = "IDLE";
            textLines = [];
            continue;
        }
        if (!currentQuestion)
            continue;
        // Skill line , starts text collection
        const skillMatch = trimmed.match(/^\*Skill: (.+)\*$/);
        if (skillMatch) {
            currentQuestion.skill = skillMatch[1].trim();
            phase = "COLLECTING_TEXT";
            textLines = [];
            continue;
        }
        // Option lines , A) B) C) D)
        const optionMatch = trimmed.match(/^([A-D])\)\s+(.+)/);
        if (optionMatch) {
            if (phase === "COLLECTING_TEXT" && textLines.length > 0) {
                currentQuestion.text = textLines.join("\n").trim();
                textLines = [];
            }
            phase = "COLLECTING_OPTIONS";
            currentQuestion.options.push({
                label: optionMatch[1],
                text: optionMatch[2].trim(),
            });
            continue;
        }
        // Option label alone on a line (e.g. "A)" followed by a table on next lines)
        const optionLabelOnly = trimmed.match(/^([A-D])\)\s*$/);
        if (optionLabelOnly) {
            if (phase === "COLLECTING_TEXT" && textLines.length > 0) {
                currentQuestion.text = textLines.join("\n").trim();
                textLines = [];
            }
            phase = "COLLECTING_OPTIONS";
            // Gather the table/content lines until the next option or answer
            let optContent = [];
            for (let j = i + 1; j < lines.length; j++) {
                const peek = lines[j].trim();
                if (peek.match(/^([A-D])\)/) || peek.match(/^\*\*Answer/) || peek === "---")
                    break;
                if (peek)
                    optContent.push(peek);
            }
            currentQuestion.options.push({
                label: optionLabelOnly[1],
                text: optContent.join(" ").replace(/\|/g, " ").replace(/\s{2,}/g, " ").trim(),
            });
            continue;
        }
        // Answer line
        const answerMatch = trimmed.match(/^\*\*Answer:\s*(.+?)\*\*/);
        if (answerMatch) {
            // If text hasn't been flushed yet (free-response question with no options)
            if (phase === "COLLECTING_TEXT" && textLines.length > 0) {
                currentQuestion.text = textLines.join("\n").trim();
                textLines = [];
            }
            let ans = answerMatch[1].trim().replace(/\*\*/g, "");
            if (["A", "B", "C", "D"].includes(ans)) {
                currentQuestion.correctAnswer = ans;
                currentQuestion.isFreeResponse = false;
            }
            else {
                currentQuestion.correctAnswer = ans;
                currentQuestion.isFreeResponse = true;
            }
            phase = "POST_ANSWER";
            continue;
        }
        // Explanation , single-line or multi-line
        if (trimmed.startsWith("*(Explanation:")) {
            let expl = trimmed;
            if (!trimmed.endsWith(")*")) {
                for (let j = i + 1; j < lines.length; j++) {
                    expl += " " + lines[j].trim();
                    if (lines[j].includes(")*"))
                        break;
                }
            }
            expl = expl.replace(/^\*\(Explanation:\s*/, "").replace(/\)\*$/, "").trim();
            currentQuestion.explanation = expl;
            continue;
        }
        // Skip separators, blanks, metadata
        if (trimmed === "---" || trimmed === "")
            continue;
        if (trimmed.startsWith("> "))
            continue;
        if (trimmed.startsWith("**Total Question Count"))
            continue;
        if (trimmed.startsWith("- Section ") || trimmed.startsWith("- **Grand"))
            continue;
        // Collect question text lines
        if (phase === "COLLECTING_TEXT") {
            textLines.push(line);
        }
    }
    flushQuestion();
    return modules;
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
async function importQuestions(modules, categoryMap, testNumber) {
    const moduleQuestionIds = new Map();
    let totalImported = 0;
    for (const mod of modules) {
        const ids = [];
        for (const q of mod.questions) {
            const catName = classifyCategory(q.skill, mod.section);
            const categoryId = categoryMap.get(catName);
            if (!categoryId) {
                console.warn(`  WARNING: Category not found: ${catName} for skill: "${q.skill}"`);
                continue;
            }
            const uniqueTag = `sat-${testNumber}-m${mod.moduleNumber}-q${q.questionNumber}`;
            const doc = await Question_1.default.create({
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
            ids.push(doc._id);
            totalImported++;
        }
        moduleQuestionIds.set(mod.sectionName, ids);
        console.log(`  ${mod.sectionName}: ${ids.length} questions (${mod.questions.length} parsed)`);
    }
    console.log(`  Total: ${totalImported} imported`);
    return moduleQuestionIds;
}
async function createSATTest(modules, moduleQuestionIds, testNumber, year, pdfPath) {
    const existing = await SATTest_1.default.findOne({ year, testNumber });
    if (existing) {
        console.log(`SAT Test ${year} #${testNumber} already exists , updating question references.`);
        existing.modules = modules.map((mod) => ({
            name: mod.sectionName,
            section: mod.section,
            moduleNumber: mod.moduleNumber,
            questions: moduleQuestionIds.get(mod.sectionName) || [],
            timeLimitMinutes: mod.section === "READING_WRITING" ? 32 : 35,
        }));
        if (pdfPath)
            existing.pdfUrl = pdfPath;
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
    const test = await SATTest_1.default.create({
        title: `SAT Practice Test ${testNumber} , ${year}`,
        description: `Official-format Digital SAT practice test #${testNumber}, ${year} edition. 98 questions across 4 modules.`,
        year,
        testNumber,
        modules: satModules,
        breakDurationMinutes: 10,
        isActive: true,
        accessLevel: "FREE",
        pdfUrl: pdfPath,
    });
    console.log(`Created SAT Test: ${test.title}`);
    return test;
}
async function main() {
    const connected = await (0, db_1.connectDB)();
    if (!connected)
        throw new Error("DATABASE_URL is required.");
    // Clean ALL previous SAT imports so we get a fresh, correct import every time
    const prevCount = await Question_1.default.countDocuments({ source: "SAT" });
    if (prevCount > 0) {
        console.log(`Deleting ${prevCount} previously imported SAT questions for clean re-import...`);
        await Question_1.default.deleteMany({ source: "SAT" });
    }
    // Also delete previous SAT test documents so question references are rebuilt
    await SATTest_1.default.deleteMany({});
    const mdPath = path_1.default.resolve(__dirname, "../../../satpapers/SAT_Practice_Test_Original_June2024.md");
    if (!fs_1.default.existsSync(mdPath))
        throw new Error(`Markdown file not found: ${mdPath}`);
    console.log("Reading markdown...");
    const content = fs_1.default.readFileSync(mdPath, "utf-8");
    console.log("Parsing questions...");
    const modules = parseMarkdown(content);
    let totalQ = 0;
    let totalOpts = 0;
    let freeResponse = 0;
    for (const m of modules) {
        for (const q of m.questions) {
            totalQ++;
            totalOpts += q.options.length;
            if (q.isFreeResponse)
                freeResponse++;
        }
        console.log(`  ${m.sectionName}: ${m.questions.length} questions`);
    }
    console.log(`Total parsed: ${totalQ} questions, ${freeResponse} free-response`);
    console.log(`Average options per MCQ: ${totalQ - freeResponse > 0 ? (totalOpts / (totalQ - freeResponse)).toFixed(1) : 0}`);
    console.log();
    // Validate parser output
    let parseErrors = 0;
    for (const m of modules) {
        for (const q of m.questions) {
            if (!q.isFreeResponse && q.options.length !== 4) {
                console.warn(`  PARSE WARNING: ${m.sectionName} Q${q.questionNumber} has ${q.options.length} options (expected 4)`);
                parseErrors++;
            }
            if (!q.text) {
                console.warn(`  PARSE WARNING: ${m.sectionName} Q${q.questionNumber} has no text`);
                parseErrors++;
            }
        }
    }
    if (parseErrors > 0) {
        console.warn(`\n${parseErrors} parse warnings found. Proceeding anyway.\n`);
    }
    console.log("Ensuring SAT categories...");
    const categoryMap = await ensureCategories();
    console.log("Importing questions...");
    const moduleQuestionIds = await importQuestions(modules, categoryMap, 1);
    // Copy PDF to uploads
    const pdfSource = path_1.default.resolve(__dirname, "../../../satpapers/SAT1.pdf");
    const uploadsDir = path_1.default.resolve(__dirname, "../../uploads/sat");
    if (!fs_1.default.existsSync(uploadsDir))
        fs_1.default.mkdirSync(uploadsDir, { recursive: true });
    let pdfUrl = "";
    if (fs_1.default.existsSync(pdfSource)) {
        const pdfDest = path_1.default.join(uploadsDir, "SAT1.pdf");
        if (!fs_1.default.existsSync(pdfDest))
            fs_1.default.copyFileSync(pdfSource, pdfDest);
        pdfUrl = "/uploads/sat/SAT1.pdf";
        console.log(`PDF copied to ${pdfDest}`);
    }
    console.log("\nCreating SAT test...");
    await createSATTest(modules, moduleQuestionIds, 1, 2024, pdfUrl);
    console.log("\nSAT import complete!");
}
main()
    .catch((error) => {
    console.error("Import failed:", error);
    process.exitCode = 1;
})
    .finally(async () => {
    await mongoose_1.default.disconnect();
});
