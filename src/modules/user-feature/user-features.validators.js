import { body, param } from "express-validator";
import userFeature from "./user-feature.schema.js";
import { customValidatorId } from "../../shared/shared.exports.js";

export const createOneValidation = [
  body("userFeature.userId")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (value) => {
      await customValidatorId(userFeature, value, "userFeature");
    }),

  body("userFeature.featureId")
    .isMongoId()
    .withMessage("invalid feature id")
    .custom(async (value) => {
      await customValidatorId(userFeature, value, "userFeature");
    }),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid userFeature id")
    .custom(async (value) => {
      await customValidatorId(userFeature, value, "userFeature");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...createOneValidation,
];

export const deleteOneValidation = [...readOneValidation];
