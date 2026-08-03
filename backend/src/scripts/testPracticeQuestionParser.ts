import assert from "node:assert/strict";
import { parsePracticeQuestionDocument } from "../utils/practice-question-parser";

const validDocument = `SAT Sharks Practice Question Import

QUESTION 1
SECTION: MATH
CATEGORY: Algebra
DIFFICULTY: MEDIUM
PROMPT: If 3x + 7 = 22,
what is the value of x?
A: 3
B: 5
C: 7
D: 15
ANSWER: B
EXPLANATION: Subtract 7 from both sides,
then divide by 3.
END QUESTION

QUESTION 2
SECTION: READING_WRITING
CATEGORY: Reading Comprehension
DIFFICULTY: EASY
PROMPT: Which choice best states the main idea?
A: Choice one
B: Choice two
C: Choice three
D: Choice four
ANSWER: A
EXPLANATION: Choice A states the central claim.
END QUESTION`;

const valid = parsePracticeQuestionDocument(validDocument);
assert.deepEqual(valid.errors, []);
assert.equal(valid.questions.length, 2);
assert.equal(valid.questions[0].text, "If 3x + 7 = 22,\nwhat is the value of x?");
assert.equal(valid.questions[0].correctAnswer, "B");
assert.equal(valid.questions[1].section, "READING_WRITING");

const missingAnswer = parsePracticeQuestionDocument(validDocument.replace("ANSWER: B", "ANSWER:"));
assert.equal(missingAnswer.questions.length, 0);
assert(missingAnswer.errors.some((error) => error.includes("ANSWER is required")));

const skippedNumber = parsePracticeQuestionDocument(validDocument.replace("QUESTION 2", "QUESTION 3"));
assert.equal(skippedNumber.questions.length, 0);
assert(skippedNumber.errors.some((error) => error.includes("must be consecutive")));

const wrongOrder = parsePracticeQuestionDocument(
  validDocument.replace("CATEGORY: Algebra\nDIFFICULTY: MEDIUM", "DIFFICULTY: MEDIUM\nCATEGORY: Algebra"),
);
assert.equal(wrongOrder.questions.length, 0);
assert(wrongOrder.errors.some((error) => error.includes("fields are out of order")));

console.log("Practice-question parser checks passed.");
