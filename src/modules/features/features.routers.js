import { Router } from "express";
import Controller from "./features.controller.js";
import {
  readOneValidation,
  createOneValidation,
  deleteOneValidation,
  updateOneValidation,
} from "./features.validator.js";
import { checkValidationErrors, featuresActionsEnum, featuresCodeEnum } from "../../shared/shared.exports.js";
import { isAuthorized } from "../../middlewares/auth.middlewares.js";
const routers = Router();

// ****** Get list ******** //
routers.get("/", Controller.getList);
// ****** Get all ******** //
routers.get("/all", Controller.all);
// ****** Get by link ******** //
routers.get("/link", Controller.getSingleFeatureByLink);
// ****** Get list parents ******** //
routers.get("/parents", Controller.getListParents);
// ****** Create one ******** //
routers.post(
  "/",
  isAuthorized([
    {
      code: featuresCodeEnum.features,
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
      code: featuresCodeEnum.features,
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
      code: featuresCodeEnum.features,
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
      code: featuresCodeEnum.features,
      actions: [featuresActionsEnum.delete],
    },
  ]),
  deleteOneValidation,
  checkValidationErrors,
  Controller.deleteOne
);

export default routers;
