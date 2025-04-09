import express from "express";
import Controller from "./groups.controller.js";
import { checkValidationErrors, featuresActionsEnum, featuresCodeEnum } from "../../shared/shared.exports.js";
import {
  createOneValidation,
  readOneValidation,
  deleteOneValidation,
  updateOneValidation,
} from "./groups.validator.js";
import { isAuthorized } from "../../middlewares/auth.middlewares.js";

const routers = express.Router();

// ****** Get list ******** //
routers.get("/", Controller.getList);

routers.get(
  "/all",
  Controller.getAll
);

// ****** Create one ******** //
routers.post(
  "/",
  isAuthorized([
    {
      code: featuresCodeEnum.groups,
      actions: [featuresActionsEnum.create],
    },
  ]),
  createOneValidation,
  checkValidationErrors,
  Controller.createOne
);
// ****** Read one ******** //
routers.get(
  "/:id",
  isAuthorized([
    {
      code: featuresCodeEnum.groups,
      actions: [featuresActionsEnum.read],
    },
  ]),
  readOneValidation,
  checkValidationErrors,
  Controller.readOne
);
// ****** Update one ******** //
routers.put(
  "/:id",
  isAuthorized([
    {
      code: featuresCodeEnum.groups,
      actions: [featuresActionsEnum.update],
    },
  ]),
  updateOneValidation,
  checkValidationErrors,
  Controller.updateOne
);
// ****** Delete one ******** //
routers.delete(
  "/:id",
  isAuthorized([
    {
      code: featuresCodeEnum.groups,
      actions: [featuresActionsEnum.delete],
    },
  ]),
  deleteOneValidation,
  checkValidationErrors,
  Controller.deleteOne
);

routers.get("/:id/group-feature", Controller.get_groupFeatures);

export default routers;
