"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitTestValidator = exports.testValidator = void 0;
const express_validator_1 = require("express-validator");
exports.testValidator = [
    (0, express_validator_1.body)("title").notEmpty().withMessage("Test title is required"),
    (0, express_validator_1.body)("section")
        .isIn(["READING_WRITING", "MATH", "FULL"])
        .withMessage("Section must be READING_WRITING, MATH, or FULL"),
    (0, express_validator_1.body)("questions")
        .isArray({ min: 1 })
        .withMessage("At least one question is required"),
    (0, express_validator_1.body)("timeLimit")
        .isInt({ min: 1 })
        .withMessage("Time limit must be at least 1 minute"),
    (0, express_validator_1.body)("accessLevel")
        .isIn(["FREE", "PAID"])
        .withMessage("Access level must be FREE or PAID"),
];
exports.submitTestValidator = [
    (0, express_validator_1.body)("answers")
        .isArray({ min: 1 })
        .withMessage("Answers are required"),
    (0, express_validator_1.body)("answers.*.question").notEmpty().withMessage("Question ID is required"),
    (0, express_validator_1.body)("answers.*.selectedAnswer").optional(),
    (0, express_validator_1.body)("timeTaken")
        .isInt({ min: 0 })
        .withMessage("Time taken is required"),
];
