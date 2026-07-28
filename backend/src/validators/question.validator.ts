import { body } from "express-validator";

export const questionValidator = [
  body("text").notEmpty().withMessage("Question text is required"),
  body("options")
    .isArray({ min: 4, max: 4 })
    .withMessage("Exactly 4 options are required"),
  body("options.*.label").notEmpty().withMessage("Option label is required"),
  body("options.*.text").notEmpty().withMessage("Option text is required"),
  body("correctAnswer")
    .isIn(["A", "B", "C", "D"])
    .withMessage("Correct answer must be A, B, C, or D"),
  body("category").notEmpty().withMessage("Category is required"),
  body("difficulty")
    .isIn(["EASY", "MEDIUM", "HARD"])
    .withMessage("Difficulty must be EASY, MEDIUM, or HARD"),
  body("section")
    .isIn(["READING_WRITING", "MATH"])
    .withMessage("Section must be READING_WRITING or MATH"),
];

export const bulkQuestionValidator = [
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
];
