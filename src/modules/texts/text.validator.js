import { body, param } from "express-validator";
import Texts from "./text.shema.js";
import {
  customValidatorId,
  customValidatorUniqueValueForInsert,
} from "../../shared/shared.exports.js";

export const createOneValidation = [
  body("text.key")
    .isEmail()
    .withMessage("Must be a valid key.")
    .normalizeEmail()
    .custom(async (value) => {
      await customValidatorUniqueValueForInsert(Texts, "key", {
        key: value.trim().toLowerCase(),
      });
    }),

  body("text.fr").trim().notEmpty().withMessage("French version is required"),

  body("text.en").trim().notEmpty().withMessage("English version is required"),

  body("text.ar").trim().notEmpty().withMessage("Arabic version is required"),

  body("text.es").trim().notEmpty().withMessage("Spanish version is required"),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Texts, value, "text");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...createOneValidation,
];

export const deleteOneValidation = [...readOneValidation];
