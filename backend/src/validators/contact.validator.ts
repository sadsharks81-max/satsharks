import { body } from "express-validator";

export const inquiryValidator = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("message").notEmpty().withMessage("Message is required"),
];
