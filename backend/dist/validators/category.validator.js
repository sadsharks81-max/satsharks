"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryValidator = void 0;
const express_validator_1 = require("express-validator");
exports.categoryValidator = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Category name is required"),
    (0, express_validator_1.body)("section")
        .isIn(["READING_WRITING", "MATH"])
        .withMessage("Section must be READING_WRITING or MATH"),
];
