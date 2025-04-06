import express from "express";
import Controller from "./groups.controller.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";
import {
  createOneValidation,
  readOneValidation,
  deleteOneValidation,
  updateOneValidation,
} from "./groups.validator.js";

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

routers.get("/:id/group-feature", Controller.get_groupFeatures);

export default routers;
