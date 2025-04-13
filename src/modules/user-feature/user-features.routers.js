import controller from "./user-features.controller.js";
import { Router } from "express";
import {
  createOneValidation,
  readOneValidation,
  updateOneValidation,
  deleteOneValidation,
} from "./user-features.validators.js";
import { checkValidationErrors } from "../../shared/shared.exports.js";

// ****** Define routes ****** //
const routers = Router();

// ****** get all ****** //
routers.get("/", controller.getList);

routers.get(
  "/:userId",
  /*readOneValidation,
  checkValidationErrors,*/
  controller.readOne
);

routers.post(
  "/",
  createOneValidation,
  checkValidationErrors,
  controller.createOne
);

routers.put(
  "/:userId",
  updateOneValidation,
  checkValidationErrors,
  controller.updateOne
);

routers.delete(
  "/:userId",
  deleteOneValidation,
  checkValidationErrors,
  controller.deleteOne
);

export default routers;
