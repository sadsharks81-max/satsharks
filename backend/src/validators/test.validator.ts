import { body } from "express-validator";

export const testValidator = [
  body("title").notEmpty().withMessage("Test title is required"),
  body("section")
    .isIn(["READING_WRITING", "MATH", "FULL"])
    .withMessage("Section must be READING_WRITING, MATH, or FULL"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("At least one question is required"),
  body("timeLimit")
    .isInt({ min: 1 })
    .withMessage("Time limit must be at least 1 minute"),
  body("accessLevel")
    .isIn(["FREE", "PAID"])
    .withMessage("Access level must be FREE or PAID"),
];

export const submitTestValidator = [
  body("answers")
    .isArray({ min: 1 })
    .withMessage("Answers are required"),
  body("answers.*.question").notEmpty().withMessage("Question ID is required"),
  body("answers.*.selectedAnswer").optional(),
  body("timeTaken")
    .isInt({ min: 0 })
    .withMessage("Time taken is required"),
];
