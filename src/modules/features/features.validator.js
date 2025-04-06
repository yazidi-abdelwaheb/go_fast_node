import { body, param } from "express-validator";
import Features from "./features.schema.js";
import {
  FeaturesStatusEnum,
  FeaturesTypeEnum,
  customValidatorId,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
  featureStatus,
} from "../../shared/shared.exports.js";

export const createOneValidation = [
  body("feature.code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Code must be between 3 and 20 characters")
    .custom(async (value) => {
      return await customValidatorUniqueValueForInsert(Features, "code", {
        code: value.trim().toLowerCase(),
      });
    }),

  body("feature.title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title must be between 3 and 20 characters"),

  body("feature.type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .custom(async (value) => {
      if (!Object.values(FeaturesTypeEnum).includes(value.toLowerCase())) {
        throw new Error("Type invalid");
      }
      return true;
    }),
  body("feature.status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .custom(async (value) => {
      if (!Object.values(featureStatus).includes(value)) {
        throw new Error("Status invalid");
      }
      return true;
    }),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Features, value, "Feature");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  body("feature.code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Code must be between 3 and 20 characters")
    .custom(async (value, meta) => {
      return await customValidatorUniqueValueForUpdate(
        Features,
        "code",
        { code: value.trim().toLowerCase() },
        meta.req.params.id
      );
    }),

  body("feature.title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title must be between 3 and 20 characters"),

  body("feature.type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .custom(async (value) => {
      if (!Object.values(FeaturesTypeEnum).includes(value.toLowerCase())) {
        throw new Error("Type invalid");
      }
      return true;
    }),
  body("feature.status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .custom(async (value) => {
      if (!Object.values(featureStatus).includes(value)) {
        throw new Error("Status invalid");
      }
      return true;
    }),
];

export const deleteOneValidation = [...readOneValidation];
