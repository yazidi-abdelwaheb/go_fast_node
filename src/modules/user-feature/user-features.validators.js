import { body, param } from "express-validator";
import userFeature from "./user-feature.schema.js";
import { customValidatorId } from "../../shared/shared.exports.js";
import Users from "../users/users.schema.js";
import Features from "../features/features.schema.js";

export const createOneValidation = [
  body("userId")
    .isMongoId()
    .withMessage("invalid user id")
    .custom(async (value) => {
      await customValidatorId(Users, value, "user");
    }),

  body("userFeature.featureId")
    .isMongoId()
    .withMessage("invalid feature id")
    .custom(async (value) => {
      await customValidatorId(Features, value, "feature");
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
