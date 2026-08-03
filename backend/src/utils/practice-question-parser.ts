import { stripEmojis } from "./text";

export const PRACTICE_QUESTION_SECTIONS = ["READING_WRITING", "MATH"] as const;
export const PRACTICE_QUESTION_DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;

type PracticeQuestionSection = (typeof PRACTICE_QUESTION_SECTIONS)[number];
type PracticeQuestionDifficulty = (typeof PRACTICE_QUESTION_DIFFICULTIES)[number];

export interface ParsedPracticeQuestion {
  questionNumber: number;
  text: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  category: string;
  difficulty: PracticeQuestionDifficulty;
  section: PracticeQuestionSection;
  confidence: number;
  approved: boolean;
}

export interface PracticeQuestionParseResult {
  questions: ParsedPracticeQuestion[];
  errors: string[];
}

const REQUIRED_FIELDS = [
  "SECTION",
  "CATEGORY",
  "DIFFICULTY",
  "PROMPT",
  "A",
  "B",
  "C",
  "D",
  "ANSWER",
  "EXPLANATION",
] as const;

type FieldName = (typeof REQUIRED_FIELDS)[number];

const FIELD_PATTERN = /^(SECTION|CATEGORY|DIFFICULTY|PROMPT|A|B|C|D|ANSWER|EXPLANATION)\s*:\s*(.*)$/i;
const QUESTION_START_PATTERN = /^QUESTION\s+(\d{1,4})\s*$/i;
const QUESTION_END_PATTERN = /^END QUESTION\s*$/i;

interface QuestionBlock {
  questionNumber: number;
  startLine: number;
  lines: string[];
  ended: boolean;
}

const cleanValue = (value: string) => value.trim().replace(/\n{3,}/g, "\n\n");

/**
 * Parses the documented practice-question import format.
 *
 * This parser is intentionally strict. A practice-question PDF is an import
 * document, not an arbitrary worksheet: rejecting an incomplete block is safer
 * than silently publishing a question with the wrong answer or subject.
 */
export const parsePracticeQuestionDocument = (text: string): PracticeQuestionParseResult => {
  const lines = text
    .replace(/\r/g, "")
    .replace(/\u00a0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .split("\n");

  const blocks: QuestionBlock[] = [];
  let current: QuestionBlock | null = null;

  lines.forEach((rawLine, index) => {
    const trimmed = rawLine.trim();
    const start = trimmed.match(QUESTION_START_PATTERN);
    if (start) {
      if (current) blocks.push(current);
      current = {
        questionNumber: Number(start[1]),
        startLine: index + 1,
        lines: [],
        ended: false,
      };
      return;
    }

    if (!current) return;

    if (QUESTION_END_PATTERN.test(trimmed)) {
      current.ended = true;
      blocks.push(current);
      current = null;
      return;
    }

    current.lines.push(rawLine);
  });

  if (current) blocks.push(current);

  if (blocks.length === 0) {
    return {
      questions: [],
      errors: ["No question blocks found. Start each block with `QUESTION 1` and finish it with `END QUESTION`."],
    };
  }

  const errors: string[] = [];
  const questions: ParsedPracticeQuestion[] = [];
  const seenNumbers = new Set<number>();

  blocks.forEach((block, blockIndex) => {
    const prefix = `Question ${block.questionNumber} (near PDF text line ${block.startLine})`;
    if (seenNumbers.has(block.questionNumber)) {
      errors.push(`${prefix}: duplicate question number.`);
    }
    seenNumbers.add(block.questionNumber);

    if (blockIndex === 0 && block.questionNumber !== 1) {
      errors.push(`${prefix}: numbering must start at 1.`);
    } else if (blockIndex > 0 && block.questionNumber !== blocks[blockIndex - 1].questionNumber + 1) {
      errors.push(`${prefix}: question numbers must be consecutive.`);
    }

    if (!block.ended) {
      errors.push(`${prefix}: missing END QUESTION.`);
    }

    const values = new Map<FieldName, string[]>();
    const fieldOrder: FieldName[] = [];
    let activeField: FieldName | null = null;

    for (const rawLine of block.lines) {
      const fieldMatch = rawLine.trim().match(FIELD_PATTERN);
      if (fieldMatch) {
        const field = fieldMatch[1].toUpperCase() as FieldName;
        if (values.has(field)) {
          errors.push(`${prefix}: ${field} appears more than once.`);
        } else {
          values.set(field, [fieldMatch[2]]);
          fieldOrder.push(field);
        }
        activeField = field;
        continue;
      }

      if (activeField) values.get(activeField)?.push(rawLine);
    }

    for (const field of REQUIRED_FIELDS) {
      const value = cleanValue(values.get(field)?.join("\n") || "");
      if (!value) errors.push(`${prefix}: ${field} is required.`);
    }

    const orderWithoutDuplicates = fieldOrder.filter(
      (field, index) => fieldOrder.indexOf(field) === index,
    );
    if (
      orderWithoutDuplicates.length === REQUIRED_FIELDS.length &&
      orderWithoutDuplicates.some((field, index) => field !== REQUIRED_FIELDS[index])
    ) {
      errors.push(`${prefix}: fields are out of order. Follow the template order exactly.`);
    }

    const section = cleanValue(values.get("SECTION")?.join("\n") || "").toUpperCase();
    const difficulty = cleanValue(values.get("DIFFICULTY")?.join("\n") || "").toUpperCase();
    const answer = cleanValue(values.get("ANSWER")?.join("\n") || "").toUpperCase();

    if (!PRACTICE_QUESTION_SECTIONS.includes(section as PracticeQuestionSection)) {
      errors.push(`${prefix}: SECTION must be READING_WRITING or MATH.`);
    }
    if (!PRACTICE_QUESTION_DIFFICULTIES.includes(difficulty as PracticeQuestionDifficulty)) {
      errors.push(`${prefix}: DIFFICULTY must be EASY, MEDIUM, or HARD.`);
    }
    if (!/^[A-D]$/.test(answer)) {
      errors.push(`${prefix}: ANSWER must be exactly A, B, C, or D.`);
    }

    const options = (["A", "B", "C", "D"] as const).map((label) => ({
      label,
      text: cleanValue(values.get(label)?.join("\n") || ""),
    }));
    const questionText = cleanValue(values.get("PROMPT")?.join("\n") || "");
    const category = cleanValue(values.get("CATEGORY")?.join("\n") || "");
    const explanation = stripEmojis(cleanValue(values.get("EXPLANATION")?.join("\n") || ""));

    const blockHasErrors = errors.some((error) => error.startsWith(`${prefix}:`));
    if (!blockHasErrors) {
      questions.push({
        questionNumber: block.questionNumber,
        text: questionText,
        options,
        correctAnswer: answer,
        explanation,
        category,
        difficulty: difficulty as PracticeQuestionDifficulty,
        section: section as PracticeQuestionSection,
        confidence: 1,
        approved: false,
      });
    }
  });

  return { questions: errors.length === 0 ? questions : [], errors };
};
