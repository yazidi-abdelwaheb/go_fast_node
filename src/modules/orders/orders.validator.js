import { body, param } from "express-validator";
import Orders from "./orders.schema.js";
import Products from "../products/products.schema.js";
import { customValidatorId } from "../../shared/shared.exports.js";

export const createOneValidation = [
  body("order.productId")
    .isMongoId()
    .withMessage("product id not valid.")
    .custom(async (value) => {
      await customValidatorId(Products, value, "product");
    }),

  body("order.distination.government")
    .trim()
    .notEmpty()
    .withMessage("Government distination is required.")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Please entre a valid government name."),

  body("order.distination.ville")
    .trim()
    .notEmpty()
    .withMessage("ville distination is required.")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Please entre a valid ville name."),

  body("order.distination.link_to_position")
    .trim()
    .notEmpty()
    .withMessage("link to position client is required."),

  body("order.client.fullname")
    .trim()
    .notEmpty()
    .withMessage("client fullname is required.")
    .matches(/^[a-zA-Z0-9 ]+$/)
    .withMessage("Please entre a valid fullname."),

  body("order.client.phone_number")
    .trim()
    .notEmpty()
    .withMessage("client phone number is required.")
    .matches(/^[+ 0-9]+$/)
    .withMessage("Please entre a valid phone number."),
];

export const readOneValidation = [
  param("id")
    .isMongoId()
    .withMessage("invalid id")
    .custom(async (value) => {
      await customValidatorId(Orders, value, "command");
    }),
];

export const updateOneValidation = [
  ...readOneValidation,
  ...createOneValidation,
];

export const deleteOneValidation = [...readOneValidation];
