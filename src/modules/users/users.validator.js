import { body, param } from "express-validator";
import Users from "./users.schema.js";
import Company from "../companys/companys.schema.js";
import {
  customValidatorId,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
  UserLanguagesEnum,
  UserStatusEnum,
  UserTypeEnum,
} from "../../shared/shared.exports.js";
import Groups from "../groups/groups.schema.js";

const userValidation = [
  /*body("user.companyId")
    .trim()
    .notEmpty()
    .withMessage("company Id is required")
    .isMongoId()
    .withMessage("invalid company id.")
    .custom(async (value) => {
       await customValidatorId(Company, value, "company");
    }),*/
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
  body("user.groupId._id")
    .trim()
    .notEmpty()
    .withMessage("group Id  is required")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Groups, value, "Group");
    }),
  body("user.type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .custom(async (value) => {
      if (!Object.values(UserTypeEnum).includes(value.toLowerCase())) {
        throw new Error("Type invalid");
      }
      return true;
    }),
];

export const createOneValidation = [
  ...userValidation,
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value) => {
      await customValidatorUniqueValueForInsert(Users, "email", {
        email: value.trim().toLowerCase(),
      });
    }),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Users, value, "user");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...userValidation,
  body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value, meta) => {
      await customValidatorUniqueValueForUpdate(
        Users,
        "email",
        { code: value.trim().toLowerCase() },
        meta.req.params.id
      );
    }),
  body("user.lang").custom(async (value) => {
    if (value && !Object.values(UserLanguagesEnum).includes(value)) {
      throw new Error("Invalid language.");
    }
    return true;
  }),
];

export const updateMyAccountValidation = [
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value, meta) => {
      return await customValidatorUniqueValueForUpdate(
        Users,
        "email",
        { code: value.trim().toLowerCase() },
        meta.req.user._id
      );
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
  body("user.lang").custom(async (value) => {
    if (!Object.values(UserLanguagesEnum).includes(value)) {
      throw new Error("Invalid language.");
    }
    return true;
  }),
];

export const deleteOneValidation = [...readOneValidation];

export const updateMyLanguageValidation = [
  body("lang").custom(async (value) => {
    if (!Object.values(UserLanguagesEnum).includes(value)) {
      throw new Error("Invalid language.");
    }
    return true;
  }),
];

export const updateMyStatusValidation = [
  body("status").custom(async (value) => {
    if (!Object.values(UserStatusEnum).includes(value)) {
      throw new Error("Invalid status.");
    }
    return true;
  }),
];
