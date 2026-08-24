import "../config/env";
import fs from "node:fs/promises";
import path from "node:path";
import mongoose, { ClientSession, Types } from "mongoose";
import { PDFParse } from "pdf-parse";
import { connectDB } from "../config/db";
import DiagnosticTest from "../models/DiagnosticTest";
import Question from "../models/Question";
import QuestionCategory from "../models/QuestionCategory";
import SATTest from "../models/SATTest";
import {
  ParsedPracticeQuestion,
  parsePracticeQuestionDocument,
} from "../utils/practice-question-parser";

const SOURCE_DIRECTORY = path.resolve(
  __dirname,
  "../../../reference_data/practicequestions3",
);

const EXPECTED_FILES = [
  "Claim Example Match - Part 1 (25Q).pdf",
  "Claim Example Match - Part 2 (25Q).pdf",
  "Cross-Text Connections - Part 1 (25Q).pdf",
  "Cross-Text Connections - Part 2 (25Q).pdf",
  "Detail + Claim Example Match - Additional Mixed Set (30Q).pdf",
  "Detail - Part 1 (Q1-25).pdf",
  "Detail - Part 2 (Q26-50).pdf",
  "Evidence - Data Graphs Tables (50Q).pdf",
  "Evidence - Support Weaken - Part 1 (50Q).pdf",
  "Evidence - Support Weaken - Part 2 (30Q).pdf",
  "Evidence - Support Weaken - Part 3 (30Q).pdf",
  "Evidence - Support Weaken - Part 4 (20Q).pdf",
  "Function of Underlined Text (25Q).pdf",
  "Grammar - Part 1 (Q1-150).pdf",
  "Grammar - Part 2 (Q151-200).pdf",
  "Inference and Complete the Text (80Q).pdf",
  "Main Idea (25Q).pdf",
  "Main Purpose - Part 1 (Q1-25).pdf",
  "Main Purpose - Part 2 (Q26-50).pdf",
  "Overall Structure - Part 1 (25Q).pdf",
  "Overall Structure - Part 2 (25Q).pdf",
  "Quotation Illustrates Claim - Part 1 (Q1-20 Improved).pdf",
  "Quotation Illustrates Claim - Part 2 (Q21-40).pdf",
  "Quotation Illustrates Claim - Part 3 (20Q Additional Set).pdf",
  "Rhetorical Synthesis (90Q).pdf",
  "Transitions (80Q).pdf",
  "Vocabulary in Context - Part 1 (80Q).pdf",
  "Vocabulary in Context - Part 2 (20Q Set B).pdf",
] as const;

const EXPECTED_CATEGORY_COUNTS = new Map<string, number>([
  ["SAT Practice: Claim-Example Match", 65],
  ["SAT Practice: Cross-Text Connections", 50],
  ["SAT Practice: Detail", 65],
  ["SAT Practice: Evidence (Data, Graphs, Tables)", 50],
  ["SAT Practice: Evidence (Support, Weaken)", 130],
  ["SAT Practice: Function of Underlined Text", 25],
  ["SAT Practice: Grammar", 200],
  ["SAT Practice: Inference & Complete the Text", 80],
  ["SAT Practice: Main Idea", 25],
  ["SAT Practice: Main Purpose", 50],
  ["SAT Practice: Overall Structure", 50],
  ["SAT Practice: Quotation Illustrates Claim", 60],
  ["SAT Practice: Rhetorical Synthesis", 90],
  ["SAT Practice: Transitions", 80],
  ["SAT Practice: Vocabulary", 100],
]);

// These categories belong exclusively to the Create Your Own Test flow. This
// import must never create, update, or delete data in them.
const CUSTOM_TEST_CATEGORY_NAMES = new Set([
  "SAT Advanced Math",
  "SAT Algebra",
  "SAT Data & Statistics",
  "SAT Geometry",
  "SAT Grammar & Writing",
  "SAT Reading & Writing",
  "SAT Vocabulary",
  "SAT Reading Comprehension",
]);

interface PreparedQuestion extends ParsedPracticeQuestion {
  sourceFile: string;
}

interface ExistingCategory {
  _id: Types.ObjectId;
  name: string;
  section: "READING_WRITING" | "MATH";
}

interface UnplacedCategory {
  name: string;
  questionCount: number;
}

interface ReplacementResult {
  deletedCount: number;
  insertedCount: number;
  createdCategoryNames: string[];
}

const getQuestionNumbers = (text: string) =>
  [...text.matchAll(/^QUESTION\s+(\d{1,4})\s*$/gim)].map((match) => Number(match[1]));

const protectExplanationContinuationLabels = (text: string) => {
  const output: string[] = [];
  let insideQuestion = false;
  let insideExplanation = false;

  for (const line of text.replace(/\r/g, "").split("\n")) {
    if (/^QUESTION\s+\d{1,4}\s*$/i.test(line.trim())) {
      insideQuestion = true;
      insideExplanation = false;
    } else if (insideQuestion && /^EXPLANATION\s*:/i.test(line.trim()) && !insideExplanation) {
      insideExplanation = true;
    } else if (insideQuestion && /^END QUESTION\s*$/i.test(line.trim())) {
      insideQuestion = false;
      insideExplanation = false;
    } else if (
      insideExplanation &&
      /^(SECTION|CATEGORY|DIFFICULTY|PROMPT|A|B|C|D|ANSWER|EXPLANATION)\s*:/i.test(line.trim())
    ) {
      // PDF line wrapping can place prose such as "ALTERNATIVE\nEXPLANATION:"
      // or "Why not\nD:" at the start of a new extracted line. Join only these
      // post-EXPLANATION continuations so the strict parser does not mistake
      // prose for a second structured field.
      const previousIndex = output.length - 1;
      output[previousIndex] = `${output[previousIndex]} ${line.trim()}`;
      continue;
    }

    output.push(line);
  }

  return output.join("\n");
};

/**
 * The regular upload parser intentionally requires every uploaded PDF to begin
 * at question 1. Several supplied continuation PDFs begin at 21, 26, or 151.
 * Validate that their source numbering is consecutive, then renumber only the
 * in-memory text passed to the shared strict field parser.
 */
const normalizeQuestionNumbers = (text: string, fileName: string) => {
  const numbers = getQuestionNumbers(text);
  if (numbers.length === 0) {
    throw new Error(`${fileName}: no QUESTION blocks were found.`);
  }

  numbers.forEach((number, index) => {
    if (index > 0 && number !== numbers[index - 1] + 1) {
      throw new Error(
        `${fileName}: question numbering jumps from ${numbers[index - 1]} to ${number}.`,
      );
    }
  });

  let normalizedNumber = 0;
  const normalizedText = text.replace(/^QUESTION\s+\d{1,4}\s*$/gim, () => {
    normalizedNumber += 1;
    return `QUESTION ${normalizedNumber}`;
  });

  return { normalizedText, sourceCount: numbers.length };
};

const extractPdfText = async (pdfPath: string) => {
  const parser = new PDFParse({ data: await fs.readFile(pdfPath) });
  try {
    return (await parser.getText()).text;
  } finally {
    await parser.destroy();
  }
};

const prepareQuestions = async (): Promise<PreparedQuestion[]> => {
  const directoryEntries = (await fs.readdir(SOURCE_DIRECTORY, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".pdf")
    .map((entry) => entry.name)
    .sort();
  const expectedFiles = [...EXPECTED_FILES].sort();

  const missingFiles = expectedFiles.filter((file) => !directoryEntries.includes(file));
  const unexpectedFiles = directoryEntries.filter((file) => !expectedFiles.includes(file as never));
  if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
    throw new Error([
      "The practicequestions3 PDF set does not match the reviewed source manifest.",
      missingFiles.length ? `Missing: ${missingFiles.join(", ")}` : "",
      unexpectedFiles.length ? `Unexpected: ${unexpectedFiles.join(", ")}` : "",
    ].filter(Boolean).join("\n"));
  }

  const prepared: PreparedQuestion[] = [];
  for (const fileName of expectedFiles) {
    const text = protectExplanationContinuationLabels(
      await extractPdfText(path.join(SOURCE_DIRECTORY, fileName)),
    );
    const { normalizedText, sourceCount } = normalizeQuestionNumbers(text, fileName);
    const parsed = parsePracticeQuestionDocument(normalizedText);
    if (parsed.errors.length > 0) {
      throw new Error(
        `${fileName} failed validation:\n${parsed.errors.map((error) => `- ${error}`).join("\n")}`,
      );
    }
    if (parsed.questions.length !== sourceCount) {
      throw new Error(
        `${fileName}: found ${sourceCount} QUESTION markers but parsed ${parsed.questions.length} questions.`,
      );
    }

    prepared.push(...parsed.questions.map((question) => ({ ...question, sourceFile: fileName })));
  }

  validatePreparedQuestions(prepared);
  return prepared;
};

const validatePreparedQuestions = (questions: PreparedQuestion[]) => {
  const actualCounts = new Map<string, number>();
  const seenQuestionText = new Map<string, string>();

  for (const question of questions) {
    if (question.section !== "READING_WRITING") {
      throw new Error(
        `${question.sourceFile}, question ${question.questionNumber}: only READING_WRITING is allowed.`,
      );
    }
    if (CUSTOM_TEST_CATEGORY_NAMES.has(question.category)) {
      throw new Error(
        `${question.sourceFile}: category "${question.category}" belongs to Create Your Own Test.`,
      );
    }
    if (!EXPECTED_CATEGORY_COUNTS.has(question.category)) {
      throw new Error(`${question.sourceFile}: unexpected category "${question.category}".`);
    }

    actualCounts.set(question.category, (actualCounts.get(question.category) || 0) + 1);
    const duplicateKey = `${question.category}\u0000${question.text.trim().toLowerCase()}`;
    const previousFile = seenQuestionText.get(duplicateKey);
    if (previousFile) {
      throw new Error(
        `Duplicate question text in "${question.category}": ${previousFile} and ${question.sourceFile}.`,
      );
    }
    seenQuestionText.set(duplicateKey, question.sourceFile);
  }

  for (const [category, expectedCount] of EXPECTED_CATEGORY_COUNTS) {
    const actualCount = actualCounts.get(category) || 0;
    if (actualCount !== expectedCount) {
      throw new Error(
        `Category "${category}" has ${actualCount} questions; expected ${expectedCount}.`,
      );
    }
  }

  const expectedTotal = [...EXPECTED_CATEGORY_COUNTS.values()].reduce((sum, count) => sum + count, 0);
  if (questions.length !== expectedTotal) {
    throw new Error(`Prepared ${questions.length} questions; expected ${expectedTotal}.`);
  }
};

const printSourceSummary = (questions: PreparedQuestion[]) => {
  console.log(`Validated ${EXPECTED_FILES.length} PDFs and ${questions.length} English practice questions.`);
  for (const [category, count] of EXPECTED_CATEGORY_COUNTS) {
    const difficulties = questions
      .filter((question) => question.category === category)
      .reduce(
        (totals, question) => {
          totals[question.difficulty] += 1;
          return totals;
        },
        { EASY: 0, MEDIUM: 0, HARD: 0 },
      );
    console.log(
      `- ${category}: ${count} (easy ${difficulties.EASY}, medium ${difficulties.MEDIUM}, hard ${difficulties.HARD})`,
    );
  }
};

const getTargetCategories = async (session?: ClientSession): Promise<ExistingCategory[]> =>
  QuestionCategory.find({ name: { $in: [...EXPECTED_CATEGORY_COUNTS.keys()] } })
    .select("_id name section")
    .session(session || null)
    .lean<ExistingCategory[]>();

const getAllCategories = async (session?: ClientSession): Promise<ExistingCategory[]> =>
  QuestionCategory.find()
    .select("_id name section")
    .sort({ section: 1, name: 1 })
    .session(session || null)
    .lean<ExistingCategory[]>();

const assertCategorySections = (categories: ExistingCategory[]) => {
  const wrongSection = categories.filter((category) => category.section !== "READING_WRITING");
  if (wrongSection.length > 0) {
    throw new Error(
      `Refusing to modify categories outside READING_WRITING: ${wrongSection.map((category) => category.name).join(", ")}`,
    );
  }
};

const printDatabasePreflight = async (): Promise<UnplacedCategory[]> => {
  const allCategories = await getAllCategories();
  const targetCategories = allCategories.filter((category) =>
    EXPECTED_CATEGORY_COUNTS.has(category.name),
  );
  assertCategorySections(targetCategories);
  const categoryByName = new Map(targetCategories.map((category) => [category.name, category]));

  console.log("Database target-category checklist:");
  for (const [name, incomingCount] of EXPECTED_CATEGORY_COUNTS) {
    const category = categoryByName.get(name);
    const currentCount = category
      ? await Question.countDocuments({ category: category._id, section: "READING_WRITING" })
      : 0;
    console.log(
      category
        ? `- [x] ${name}: replace ${currentCount} current questions with ${incomingCount}`
        : `- [ ] ${name}: create new category with ${incomingCount} questions`,
    );
  }

  const categoryIds = targetCategories.map((category) => category._id);
  const targetQuestionIds = categoryIds.length
    ? await Question.find({ category: { $in: categoryIds }, section: "READING_WRITING" }).distinct("_id")
    : [];
  const [satTestReferences, diagnosticReferences] = targetQuestionIds.length
    ? await Promise.all([
        SATTest.countDocuments({ "modules.questions": { $in: targetQuestionIds } }),
        DiagnosticTest.countDocuments({ questions: { $in: targetQuestionIds } }),
      ])
    : [0, 0];

  console.log(`- Full-length/custom SAT tests referencing targeted questions: ${satTestReferences}`);
  console.log(`- Diagnostic tests referencing targeted questions: ${diagnosticReferences}`);

  const protectedCustomNames = new Set(
    [...CUSTOM_TEST_CATEGORY_NAMES].map((name) => name.toLowerCase()),
  );
  const protectedCustomCategories = allCategories.filter((category) =>
    protectedCustomNames.has(category.name.trim().toLowerCase()),
  );
  const protectedMathCategories = allCategories.filter((category) => category.section === "MATH");
  const unplacedCategories = allCategories.filter(
    (category) =>
      category.section === "READING_WRITING" &&
      !EXPECTED_CATEGORY_COUNTS.has(category.name) &&
      !protectedCustomNames.has(category.name.trim().toLowerCase()),
  );
  const unplacedWithCounts: UnplacedCategory[] = [];
  for (const category of unplacedCategories) {
    unplacedWithCounts.push({
      name: category.name,
      questionCount: await Question.countDocuments({ category: category._id }),
    });
  }

  console.log(
    `Protected and unchanged: ${protectedCustomCategories.length} Create Your Own Test categories; ${protectedMathCategories.length} Math categories.`,
  );
  console.log("Unplaced Reading & Writing categories (no changes will be made):");
  if (unplacedWithCounts.length === 0) {
    console.log("- [x] None");
  } else {
    for (const category of unplacedWithCounts) {
      console.log(`- [ ] ${category.name}: ${category.questionCount} current questions`);
    }
  }

  return unplacedWithCounts;
};

const categoryTag = (name: string) =>
  name
    .replace(/^SAT Practice:\s*/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const replaceQuestions = async (questions: PreparedQuestion[]): Promise<ReplacementResult> => {
  const session = await mongoose.startSession();
  let deletedCount = 0;
  let insertedCount = 0;
  let createdCategoryNames: string[] = [];

  try {
    await session.withTransaction(async () => {
      let categories = await getTargetCategories(session);
      assertCategorySections(categories);
      const existingNames = new Set(categories.map((category) => category.name));

      const missingNames = [...EXPECTED_CATEGORY_COUNTS.keys()].filter(
        (name) => !existingNames.has(name),
      );
      if (missingNames.length > 0) {
        const created = await QuestionCategory.insertMany(
          missingNames.map((name) => ({
            name,
            section: "READING_WRITING",
            description: `Topic-specific practice for ${name.replace("SAT Practice: ", "")}`,
          })),
          { session, ordered: true },
        );
        createdCategoryNames = created.map((category) => category.name);
        categories = await getTargetCategories(session);
      }

      const categoryByName = new Map(categories.map((category) => [category.name, category]));
      if (categoryByName.size !== EXPECTED_CATEGORY_COUNTS.size) {
        throw new Error("Could not resolve every target category after category creation.");
      }

      const categoryIds = [...categoryByName.values()].map((category) => category._id);
      const targetFilter = {
        category: { $in: categoryIds },
        section: "READING_WRITING" as const,
      };
      const targetQuestionIds = await Question.find(targetFilter)
        .session(session)
        .distinct("_id");

      if (targetQuestionIds.length > 0) {
        const [satTestReferences, diagnosticReferences] = await Promise.all([
          SATTest.countDocuments({ "modules.questions": { $in: targetQuestionIds } }).session(session),
          DiagnosticTest.countDocuments({ questions: { $in: targetQuestionIds } }).session(session),
        ]);
        if (satTestReferences > 0 || diagnosticReferences > 0) {
          throw new Error(
            `Refusing replacement: targeted questions are referenced by ${satTestReferences} SAT test(s) and ${diagnosticReferences} diagnostic test(s).`,
          );
        }
      }

      const mathCountBefore = await Question.countDocuments({ section: "MATH" }).session(session);
      const nonTargetCountBefore = await Question.countDocuments({
        $nor: [{ category: { $in: categoryIds }, section: "READING_WRITING" }],
      }).session(session);

      const deleted = await Question.deleteMany(targetFilter, { session });
      deletedCount = deleted.deletedCount;

      const documents = questions.map((question) => {
        const category = categoryByName.get(question.category);
        if (!category) throw new Error(`Missing category "${question.category}" during insertion.`);

        return {
          text: question.text.trim(),
          options: question.options.map((option) => ({
            label: option.label,
            text: option.text.trim(),
          })),
          correctAnswer: question.correctAnswer,
          explanation: question.explanation.trim(),
          category: category._id,
          difficulty: question.difficulty,
          section: "READING_WRITING" as const,
          tags: ["practice-question", categoryTag(question.category)],
          source: "MANUAL" as const,
          status: "PUBLISHED" as const,
        };
      });

      const inserted = await Question.insertMany(documents, { session, ordered: true });
      insertedCount = inserted.length;

      for (const [name, expectedCount] of EXPECTED_CATEGORY_COUNTS) {
        const category = categoryByName.get(name);
        if (!category) throw new Error(`Missing category "${name}" during verification.`);
        const actualCount = await Question.countDocuments({
          category: category._id,
          section: "READING_WRITING",
        }).session(session);
        if (actualCount !== expectedCount) {
          throw new Error(
            `Post-insert verification failed for "${name}": ${actualCount}, expected ${expectedCount}.`,
          );
        }
      }

      const mathCountAfter = await Question.countDocuments({ section: "MATH" }).session(session);
      const nonTargetCountAfter = await Question.countDocuments({
        $nor: [{ category: { $in: categoryIds }, section: "READING_WRITING" }],
      }).session(session);
      if (mathCountAfter !== mathCountBefore || nonTargetCountAfter !== nonTargetCountBefore) {
        throw new Error("Scope verification failed: a non-target question count changed.");
      }
    });
  } finally {
    await session.endSession();
  }

  console.log(
    `Replacement committed: deleted ${deletedCount}, inserted ${insertedCount}, created ${createdCategoryNames.length} categories.`,
  );
  console.log("Completed category checklist:");
  const createdNames = new Set(createdCategoryNames);
  for (const [name, count] of EXPECTED_CATEGORY_COUNTS) {
    console.log(`- [x] ${name}: ${createdNames.has(name) ? "created" : "replaced"}, ${count} questions`);
  }

  return { deletedCount, insertedCount, createdCategoryNames };
};

const printPendingCategoryChecklist = (unplacedCategories: UnplacedCategory[]) => {
  console.log("Categories awaiting a keep/delete decision (left unchanged):");
  if (unplacedCategories.length === 0) {
    console.log("- [x] None");
    return;
  }
  for (const category of unplacedCategories) {
    console.log(`- [ ] ${category.name}: ${category.questionCount} questions`);
  }
};

async function main() {
  const apply = process.argv.includes("--apply");
  const checkDatabase = apply || process.argv.includes("--check-db");
  const questions = await prepareQuestions();
  printSourceSummary(questions);

  if (!checkDatabase) {
    console.log("Dry run complete. No database connection was opened and no data was changed.");
    console.log("Use --check-db for a read-only database preflight or --apply to replace the target data.");
    return;
  }

  const connected = await connectDB();
  if (!connected) throw new Error("DATABASE_URL is not configured.");
  const unplacedCategories = await printDatabasePreflight();

  if (!apply) {
    console.log("Database preflight complete. No data was changed.");
    return;
  }

  await replaceQuestions(questions);
  printPendingCategoryChecklist(unplacedCategories);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
