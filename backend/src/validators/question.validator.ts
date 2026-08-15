import { body } from "express-validator";

export const questionValidator = [
  body("text").notEmpty().withMessage("Question text is required"),
  body("options")
    .custom((value) => {
      if (value && value.length > 0) {
        if (value.length !== 4) {
          throw new Error("Exactly 4 options are required");
        }
        for (const opt of value) {
          if (!opt.label || !opt.text) {
            throw new Error("Option label and text are required");
          }
        }
      }
      return true;
    }),
  body("correctAnswer")
    .notEmpty()
    .withMessage("Correct answer is required")
    .custom((value, { req }) => {
      const hasOptions = req.body.options && req.body.options.length > 0;
      if (hasOptions) {
        if (!["A", "B", "C", "D"].includes(value)) {
          throw new Error("Correct answer must be A, B, C, or D for multiple choice questions");
        }
      }
      return true;
    }),
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
