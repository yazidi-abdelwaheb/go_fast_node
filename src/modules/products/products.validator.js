import { body, param } from "express-validator";
import Products from "./products.shema.js";
import { customValidatorId } from "../../shared/shared.exports.js";

export const createOneValidation = [
  body("product.label")
    .trim()
    .notEmpty()
    .withMessage("product label is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("product label must be between 2 and 50 characters"),

  body("product.price")
    .trim()
    .notEmpty()
    .withMessage("price is required")
    .isNumeric({ min: 0 })
    .withMessage("price must be at least 1."),
];

export const productIdValidator = [
  param("id")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (value) => {
      await customValidatorId(Products, value, "Product");
    }),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid product id")
    .custom(async (value) => {
      await customValidatorId(Products, value, "Product");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...createOneValidation,
];

export const deleteOneValidation = [...readOneValidation];
