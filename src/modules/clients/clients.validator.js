import { body, param } from "express-validator";
import clients from "./clients.schema.js";
import {
  clientTypes,
  customValidatorId,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
} from "../../shared/shared.exports.js";
import Users from "../users/users.schema.js";

const clientValidation = [
  /*body("client.companyId")
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
    body("user.password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
    body("user.accountType")
    .trim()
    .notEmpty()
    .withMessage("account type is required")
    .custom(async (value) => {
      if (!Object.values(clientTypes).includes(value)) {
        throw new Error("account type invalid");
      }
      return true;
    }),

];

export const createOneValidation = [
  ...clientValidation,
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
      await customValidatorId(clients, value, "client");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...clientValidation,
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value, meta) => {
      await customValidatorUniqueValueForUpdate(
        clients,
        "email",
        { code: value.trim().toLowerCase() },
        meta.req.params.id
      );
    }),
];

export const updateMyAccountValidation = [
  body("user.email")
    .isEmail()
    .withMessage("Must be a valid email address.")
    .normalizeEmail()
    .custom(async (value, meta) => {
      return await customValidatorUniqueValueForUpdate(
        clients,
        "email",
        { code: value.trim().toLowerCase() },
        meta.req.client._id
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
];

export const deleteOneValidation = [...readOneValidation];

