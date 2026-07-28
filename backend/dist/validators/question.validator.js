"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkQuestionValidator = exports.questionValidator = void 0;
const express_validator_1 = require("express-validator");
exports.questionValidator = [
    (0, express_validator_1.body)("text").notEmpty().withMessage("Question text is required"),
    (0, express_validator_1.body)("options")
        .isArray({ min: 4, max: 4 })
        .withMessage("Exactly 4 options are required"),
    (0, express_validator_1.body)("options.*.label").notEmpty().withMessage("Option label is required"),
    (0, express_validator_1.body)("options.*.text").notEmpty().withMessage("Option text is required"),
    (0, express_validator_1.body)("correctAnswer")
        .isIn(["A", "B", "C", "D"])
        .withMessage("Correct answer must be A, B, C, or D"),
    (0, express_validator_1.body)("category").notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("difficulty")
        .isIn(["EASY", "MEDIUM", "HARD"])
        .withMessage("Difficulty must be EASY, MEDIUM, or HARD"),
    (0, express_validator_1.body)("section")
        .isIn(["READING_WRITING", "MATH"])
        .withMessage("Section must be READING_WRITING or MATH"),
];
exports.bulkQuestionValidator = [
    (0, express_validator_1.body)("questions")
        .isArray({ min: 1 })
        .withMessage("At least one question is required"),
];
