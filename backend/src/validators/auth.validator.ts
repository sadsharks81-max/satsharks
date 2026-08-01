import { body } from "express-validator";

/**
 * Every rule starts with `.isString()`. Without it a JSON body such as
 * `{"email": {"$ne": null}}` passes validation as an object and reaches the
 * controller, where Mongoose interprets it as a query operator. Length bounds
 * also stop unbounded strings from reaching bcrypt and the database.
 */
const emailRules = body("email")
  .isString()
  .withMessage("Valid email is required")
  .bail()
  .trim()
  .isLength({ max: 254 })
  .withMessage("Valid email is required")
  .isEmail()
  .withMessage("Valid email is required");

const passwordRules = body("password")
  .isString()
  .withMessage("Password must be text")
  .bail()
  // bcrypt silently truncates beyond 72 bytes; cap well below any DoS threshold.
  .isLength({ min: 8, max: 128 })
  .withMessage("Password must be at least 8 characters");

export const registerValidator = [
  body("name")
    .isString()
    .withMessage("Name is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ max: 200 })
    .withMessage("Name is too long"),
  emailRules,
  passwordRules,
  body("country")
    .isString()
    .withMessage("Country is required")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Country is required")
    .isLength({ max: 100 })
    .withMessage("Country is too long"),
];

export const loginValidator = [
  emailRules,
  body("password")
    .isString()
    .withMessage("Password is required")
    .bail()
    .notEmpty()
    .withMessage("Password is required"),
];

export const resetPasswordValidator = [emailRules];

export const confirmResetPasswordValidator = [
  body("token")
    .isString()
    .withMessage("Reset token is required")
    .bail()
    .trim()
    .isLength({ min: 32, max: 128 })
    .withMessage("Reset token is invalid"),
  passwordRules,
];
