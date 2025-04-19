import { body, param } from "express-validator";
import clients from "./clients.schema.js";
import {
  clientTypes,
  customValidatorId,
  customValidatorUniqueValueForInsert,
  customValidatorUniqueValueForUpdate,
} from "../../shared/shared.exports.js";
import Users from "../users/users.schema.js";
import Clients from "./clients.schema.js";

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
  /*body("user.city")
    .trim()
    .notEmpty()
    .withMessage('The city field is required.')
    .isObject()
    .withMessage('The city must be an object.'),*/

  body("user.city.gouvernorat")
    .trim()
    .notEmpty()
    .withMessage("The gouvernorat field is required.")
    .isString()
    .withMessage("The gouvernorat must be a string."),

  body("user.city.coordinates")
    .trim()
    .notEmpty()
    .withMessage("The coordinates field is required.")
    .isArray({ min: 2, max: 2 })
    .withMessage("The coordinates must be an array of two numbers.")
    .custom((value) => {
      if (!Array.isArray(value) || value.length !== 2) {
        throw new Error(
          "The coordinates array must contain exactly two values."
        );
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
  body("user.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone number must be exactly 8 digits long.")
    .isNumeric()
    .withMessage("Phone number must contain only numbers.")
    .custom(async (value) => {
      await customValidatorUniqueValueForInsert(Clients, "Phone", {
        phone: value.trim().toLowerCase(),
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
      const client = await Clients.findById(meta.req.params.id)
      const userId = client.userId.toString()
      await customValidatorUniqueValueForUpdate(
        Users,
        'email',
        {email : value.trim().toLowerCase()},
        userId
      )
      
    })
  ,

  /*body("user.phone")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required.")
    .isLength({ min: 8, max: 8 })
    .withMessage("Phone number must be exactly 8 digits long.")
    .isNumeric()
    .withMessage("Phone number must contain only numbers.")
    .custom(async (value, meta) => {
      await customValidatorUniqueValueForUpdate(
        Clients,
        "Phone",
        {
          phone: value.trim().toLowerCase(),
        },
        meta.req.params.id
      );
    }),*/
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
