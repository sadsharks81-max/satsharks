import { body } from "express-validator";

export const categoryValidator = [
  body("name").notEmpty().withMessage("Category name is required"),
  body("section")
    .isIn(["READING_WRITING", "MATH"])
    .withMessage("Section must be READING_WRITING or MATH"),
];
