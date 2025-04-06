import { Router } from "express";
import Controller from "./features.controller.js";
import {
  readOneValidation,
  createOneValidation,
  deleteOneValidation,
  updateOneValidation,
} from "./features.validator.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";
const routers = Router();

// ****** Get list ******** //
routers.get("/", Controller.getList);
// ****** Get all ******** //
routers.get("/all", Controller.all);
// ****** Get by link ******** //
routers.post("/link", Controller.getSingleFeatureByLink);
// ****** Get list parents ******** //
routers.get("/parents", Controller.getListParents);
// ****** Create one ******** //
routers.post(
  "/",
  createOneValidation,
  checkValidationErrors,
  Controller.createOne
);
// ****** Read one ******** //
routers.get(
  "/:id",
  readOneValidation,
  checkValidationErrors,
  Controller.readOne
);
// ****** Update one ******** //
routers.put(
  "/:id",
  updateOneValidation,
  checkValidationErrors,
  Controller.updateOne
);
// ****** Delete one ******** //
routers.delete(
  "/:id",
  deleteOneValidation,
  checkValidationErrors,
  Controller.deleteOne
);

export default routers;
