import { body } from "express-validator";
import Users from "../users/users.shema.js";
import { customValidatorUniqueValueForInsert } from "../../shared/shared.exports.js";

export const registeryValidators = [
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value) => {
      return await customValidatorUniqueValueForInsert(Users, "email", {
        email: value.trim().toLowerCase(),
      });
    }),

  body("user.last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Last name must be between 2 and 20 characters"),

  body("user.first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("First name must be between 2 and 20 characters"),

  body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
const emailvalidator = [
  body("email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value) => {
      const user = await Users.findOne({ email: value });
      if (!user) throw new Error("User not found !");
      return true;
    }),
];

const codeValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isNumeric({ min: 100000, max: 999999 })
    .withMessage("code invalid !"),
];

export const verifyLoginSuperValidators = [...emailvalidator, ...codeValidator];
export const activeAccountValidators = [...emailvalidator, ...codeValidator];

export const sendEmailValidators = [...emailvalidator];

export const forgetPasswordVerifyCodeValidators = [
  ...emailvalidator,
  ...codeValidator,
];

export const resetPasswordValidators = [
  ...emailvalidator,
  ...codeValidator,
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];
