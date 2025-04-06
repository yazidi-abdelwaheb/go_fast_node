import { body, param } from "express-validator";
import Groups from "./groups.schema.js";
import {
  customValidatorId,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
} from "../../shared/shared.exports.js";
import Features from "../features/features.schema.js";

/*const groupFeaturesValidation = [
  body("groupFeatures.featureId")
    .isMongoId()
    .withMessage("Invalid feature id.")
    .custom(async (value) => {
      await customValidatorId(Features, value, "Feature");
    }),
];*/
export const createOneValidation = [
 // ...groupFeaturesValidation,
  body("group.code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Code must be between 3 and 20 characters")
    .custom(async (value) => {
      await customValidatorUniqueValueForInsert(Groups, "code", {
        code: value.trim().toLowerCase(),
      });
    }),

  body("group.label")
    .trim()
    .notEmpty()
    .withMessage("label is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("label must be between 3 and 20 characters"),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Groups, value, "Group");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  //...groupFeaturesValidation,
  body("group.code")
    .trim()
    .notEmpty()
    .withMessage("Code is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Code must be between 3 and 20 characters")
    .custom(async (value, meta) => {
      await customValidatorUniqueValueForUpdate(
        Groups,
        "code",
        { code: value.trim().toLowerCase() },
        meta.req.params.id
      );
    }),

  body("group.label")
    .trim()
    .notEmpty()
    .withMessage("label is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("label must be between 3 and 20 characters"),
];

export const deleteOneValidation = [...readOneValidation];
