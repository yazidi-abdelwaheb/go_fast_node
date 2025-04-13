import { body, param } from "express-validator";
import userFeature from "./user-feature.schema.js";
import { customValidatorId } from "../../shared/shared.exports.js";
import Users from "../users/users.schema.js";
import Features from "../features/features.schema.js";

export const createOneValidation = [
  body("user._id")
    .isMongoId()
    .withMessage("invalid user id")
    //.bail()
    .custom(async (value) => {
      await customValidatorId(Users, value, "user");
    }),

  body("group")
    .isArray({ min: 1 })
    .withMessage("group must be a non-empty array"),

  body("group.*.featureId._id")
    .isMongoId()
    .withMessage("invalid feature id")
    //.bail()
    .custom(async (value) => {
      await customValidatorId(Features, value, "feature");
    }),
];

export const readOneValidation = [
  param("userId")
    .isMongoId()
    .withMessage("invalid user id")
    //.bail()
    .custom(async (value) => {
      await customValidatorId(Users, value, "user");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  body("userFeatures")
    .isArray({ min: 1 })
    .withMessage("userFeatures must be a non-empty array"),

  body("userFeatures.*._id")
    .isMongoId()
    .withMessage("invalid feature id")
    //.bail()
    .custom(async (value) => {
      await customValidatorId(Features, value, "feature");
    }),
];

export const deleteOneValidation = [...readOneValidation];
