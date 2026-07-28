"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inquiryValidator = void 0;
const express_validator_1 = require("express-validator");
exports.inquiryValidator = [
    (0, express_validator_1.body)("firstName").notEmpty().withMessage("First name is required"),
    (0, express_validator_1.body)("lastName").notEmpty().withMessage("Last name is required"),
    (0, express_validator_1.body)("email").isEmail().withMessage("Valid email is required"),
    (0, express_validator_1.body)("category").notEmpty().withMessage("Category is required"),
    (0, express_validator_1.body)("message").notEmpty().withMessage("Message is required"),
];
